import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ConversationService } from "@/utils/conversationService";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("id");
    const withArchitecture = searchParams.get("withArchitecture") === "true";

    const conversationService = new ConversationService();

    if (conversationId) {
      // Get specific conversation with messages
      const [conversation, messages] = await Promise.all([
        conversationService.getConversation(conversationId),
        conversationService.getConversationMessages(conversationId),
      ]);

      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        conversation,
        messages,
      });
    } else if (withArchitecture) {
      // Get conversations with architecture
      const conversations =
        await conversationService.getConversationsWithArchitecture(user.id);
      return NextResponse.json({ conversations });
    } else {
      // Get all conversations
      const conversations = await conversationService.getUserConversations(
        user.id
      );
      return NextResponse.json({ conversations });
    }
  } catch (error) {
    console.error("Error in conversations API:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("id");

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    const conversationService = new ConversationService();
    await conversationService.deleteConversation(conversationId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("id");
    const { title } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID required" },
        { status: 400 }
      );
    }

    const conversationService = new ConversationService();
    await conversationService.updateConversationTitle(conversationId, title);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return NextResponse.json(
      { error: "Failed to update conversation" },
      { status: 500 }
    );
  }
}
