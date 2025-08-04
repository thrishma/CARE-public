import { createClient } from "@/utils/supabase/client";
import {
  DatabaseConversation,
  DatabaseMessage,
  ConversationSummary,
  Message,
} from "@/types/conversation";

export class ConversationService {
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

  // Get all conversations for a user
  async getUserConversations(userId: string): Promise<ConversationSummary[]> {
    const { data, error } = await this.supabase
      .from("conversations")
      .select(
        `
        id,
        title,
        created_at,
        updated_at,
        total_messages,
        architecture_data
      `
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      throw new Error("Failed to fetch conversations");
    }

    return data.map((conv) => ({
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      total_messages: conv.total_messages,
      has_architecture: !!conv.architecture_data,
    }));
  }

  // Get a specific conversation with messages
  async getConversation(
    conversationId: string
  ): Promise<DatabaseConversation | null> {
    const { data, error } = await this.supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

    if (error) {
      console.error("Error fetching conversation:", error);
      return null;
    }

    return data;
  }

  // Get messages for a conversation
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      throw new Error("Failed to fetch messages");
    }

    return data.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      timestamp: new Date(msg.created_at),
      conversation_id: msg.conversation_id,
      metadata: msg.metadata,
    }));
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

  // Update conversation title
  async updateConversationTitle(
    conversationId: string,
    title: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from("conversations")
      .update({ title })
      .eq("id", conversationId);

    if (error) {
      console.error("Error updating conversation title:", error);
      throw new Error("Failed to update conversation title");
    }
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await this.supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.error("Error deleting conversation:", error);
      throw new Error("Failed to delete conversation");
    }
  }

  // Get conversations with architecture data
  async getConversationsWithArchitecture(
    userId: string
  ): Promise<ConversationSummary[]> {
    const { data, error } = await this.supabase
      .from("conversations")
      .select(
        `
        id,
        title,
        created_at,
        updated_at,
        total_messages,
        architecture_data
      `
      )
      .eq("user_id", userId)
      .not("architecture_data", "is", null)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations with architecture:", error);
      throw new Error("Failed to fetch conversations with architecture");
    }

    return data.map((conv) => ({
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      total_messages: conv.total_messages,
      has_architecture: true,
    }));
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
