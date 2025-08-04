import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Message } from "@/types/conversation";
import { Vendor } from "@/types/vendor";
import vendorsData from "@/data/vendors.json";
import { createClient } from "@/utils/supabase/server";
import { ServerConversationService } from "@/utils/serverConversationService";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are CARE, a solutions architect specializing in composable MACH architectures for e-commerce.

MACH Principles:
- Microservices-based: Avoid monoliths
- API-first: Integrations driven by APIs  
- Cloud-native SaaS: No on-premise dependencies
- Headless: Decoupled front/back, interchangeable layers

Your role:
1. Ask specific questions to understand the user's business and technical needs
2. Recommend only MACH-compliant solutions from the vendor list
3. If the user names a specific vendor, remember it for the final architecture
4. If the user has no preference, suggest options with pros/cons
5. Explain why each recommendation follows MACH principles
6. Clarify any missing architecture components

Available MACH-compliant vendors by category:
${getVendorsByCategory()}

Guidelines:
- Never recommend non-MACH solutions (like Magento, SAP, NetSuite monoliths)
- Always explain the "why" behind recommendations
- Ask follow-up questions to fill gaps in the architecture
- Keep responses conversational and helpful
- When you have enough information, provide a final JSON architecture summary

When you have enough information to provide a complete architecture recommendation, end your response with the architecture in this EXACT format:

**ARCHITECTURE JSON:**
\`\`\`json
{
  "business": "Business Name",
  "commerce_engine": ["vendor1", "vendor2"],
  "pim": ["vendor1"],
  "cms": ["vendor1", "vendor2"],
  "omnichannel": ["vendor1"],
  "payment_provider": ["vendor1", "vendor2"],
  "tax": ["vendor1"],
  "search": ["vendor1"],
  "loyalty": ["vendor1"],
  "analytics": ["vendor1"],
  "personalization": ["vendor1"],
  "inventory": ["vendor1"],
  "order_management": ["vendor1"]
}
\`\`\`

IMPORTANT: Only include categories that were specifically discussed or requested. Do not include empty arrays.`;

function getVendorsByCategory(): string {
  const vendors = vendorsData as Vendor[];
  const machVendors = vendors.filter((v) => v.machCompliant);

  const categories: { [key: string]: string[] } = {};
  machVendors.forEach((vendor) => {
    if (!categories[vendor.category]) {
      categories[vendor.category] = [];
    }
    categories[vendor.category].push(vendor.name);
  });

  return Object.entries(categories)
    .map(([category, vendors]) => `${category}: ${vendors.join(", ")}`)
    .join("\n");
}

export async function POST(request: Request) {
  try {
    // Authentication: Check if user is logged in
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "Authentication required. Please log in to use the chat feature.",
        },
        { status: 401 }
      );
    }

    const { messages, userMessage, conversationId } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Initialize conversation service
    const conversationService = new ServerConversationService();
    let currentConversationId = conversationId;

    // If no conversation ID, create a new conversation
    if (!currentConversationId) {
      const title = conversationService.generateConversationTitle(userMessage);
      const newConversation = await conversationService.createConversation(
        title,
        user.id
      );
      currentConversationId = newConversation.id;
    }

    // Save the user message
    await conversationService.addMessage(
      currentConversationId,
      "user",
      userMessage
    );

    // Convert messages to OpenAI format
    const openaiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((msg: Message) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: openaiMessages as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content ||
      "Sorry, I could not generate a response.";

    // Save the assistant message
    await conversationService.addMessage(
      currentConversationId,
      "assistant",
      assistantMessage
    );

    // Check if the response contains JSON architecture
    let architecture = null;

    // Look for the specific architecture JSON format
    const architectureMatch = assistantMessage.match(
      /\*\*ARCHITECTURE JSON:\*\*\s*```json\s*([\s\S]*?)\s*```/
    );

    if (architectureMatch) {
      try {
        const jsonStr = architectureMatch[1].trim();
        architecture = JSON.parse(jsonStr);
        console.log("Successfully parsed architecture:", architecture);

        // Save architecture to conversation
        await conversationService.updateConversationArchitecture(
          currentConversationId,
          architecture,
          [] // vendor recommendations can be added later
        );
      } catch (error) {
        console.error("Error parsing architecture JSON:", error);
      }
    } else {
      // Fallback: try other patterns
      const patterns = [
        /```json\s*([\s\S]*?)\s*```/, // Standard json code block
        /```\s*json\s*([\s\S]*?)\s*```/, // json with extra spaces
        /\{[\s\S]*?"business"[\s\S]*?\}/, // Direct JSON object
      ];

      for (const pattern of patterns) {
        const match = assistantMessage.match(pattern);
        if (match) {
          try {
            const jsonStr = match[1] || match[0];
            const cleanJson = jsonStr
              .trim()
              .replace(/^[^{]*/, "")
              .replace(/[^}]*$/, "");

            if (cleanJson.startsWith("{") && cleanJson.includes('"business"')) {
              architecture = JSON.parse(cleanJson);
              console.log(
                "Successfully parsed architecture with fallback:",
                architecture
              );

              // Save architecture to conversation
              await conversationService.updateConversationArchitecture(
                currentConversationId,
                architecture,
                [] // vendor recommendations can be added later
              );
              break;
            }
          } catch (error) {
            console.error("Error parsing JSON with fallback pattern:", error);
          }
        }
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      architecture: architecture,
      timestamp: new Date().toISOString(),
      conversationId: currentConversationId,
    });
  } catch (error) {
    console.error("Conversation API error:", error);
    return NextResponse.json(
      { error: "Failed to process conversation" },
      { status: 500 }
    );
  }
}
