import { createClient } from "@/utils/supabase/server";
import {
  DatabaseConversation,
  DatabaseMessage,
  ConversationSummary,
  Message,
} from "@/types/conversation";

export class ServerConversationService {
  private supabase = createClient();

  // Create a new conversation
  async createConversation(
    title: string,
    userId: string
  ): Promise<DatabaseConversation> {
    const { data, error } = await this.supabase
      .from("conversations")
      .insert([
        {
          user_id: userId,
          title: title,
          total_messages: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      throw new Error("Failed to create conversation");
    }

    return data;
  }

  // Add a message to a conversation
  async addMessage(
    conversationId: string,
    role: "user" | "assistant",
    content: string,
    metadata?: any
  ): Promise<DatabaseMessage> {
    const { data, error } = await this.supabase
      .from("messages")
      .insert([
        {
          conversation_id: conversationId,
          role,
          content,
          metadata,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding message:", error);
      throw new Error("Failed to add message");
    }

    return data;
  }

  // Update conversation architecture data
  async updateConversationArchitecture(
    conversationId: string,
    architectureData: any,
    vendorRecommendations?: any[]
  ): Promise<void> {
    const { error } = await this.supabase
      .from("conversations")
      .update({
        architecture_data: architectureData,
        vendor_recommendations: vendorRecommendations,
      })
      .eq("id", conversationId);

    if (error) {
      console.error("Error updating conversation architecture:", error);
      throw new Error("Failed to update conversation architecture");
    }
  }

  // Generate conversation title from first message
  generateConversationTitle(firstMessage: string): string {
    // Extract meaningful words from the first message
    const words = firstMessage
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 4);

    if (words.length === 0) {
      return "New Conversation";
    }

    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
