import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ConversationService } from "@/utils/conversationService";
import {
  ConversationSummary,
  Message,
  ConversationState,
} from "@/types/conversation";

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const conversationService = useMemo(() => new ConversationService(), []);

  // Load user conversations
  const loadConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userConversations = await conversationService.getUserConversations(
        user.id
      );
      setConversations(userConversations);
      setError(null);
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, [user, conversationService]);

  // Create a new conversation
  const createConversation = useCallback(
    async (title: string): Promise<string | null> => {
      if (!user) return null;

      try {
        const newConversation = await conversationService.createConversation(
          title,
          user.id
        );
        await loadConversations(); // Refresh the list
        return newConversation.id;
      } catch (err) {
        console.error("Error creating conversation:", err);
        setError("Failed to create conversation");
        return null;
      }
    },
    [user, loadConversations, conversationService]
  );

  // Delete a conversation
  const deleteConversation = useCallback(
    async (conversationId: string): Promise<boolean> => {
      try {
        await conversationService.deleteConversation(conversationId);
        await loadConversations(); // Refresh the list
        return true;
      } catch (err) {
        console.error("Error deleting conversation:", err);
        setError("Failed to delete conversation");
        return false;
      }
    },
    [loadConversations, conversationService]
  );

  // Load conversations when user changes
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    loadConversations,
    createConversation,
    deleteConversation,
  };
};

export const useConversation = (conversationId: string | null) => {
  const { user } = useAuth();
  const [conversationState, setConversationState] = useState<ConversationState>(
    {
      messages: [],
      isLoading: false,
      currentConversationId: conversationId || undefined,
    }
  );
  const [error, setError] = useState<string | null>(null);
  const conversationService = useMemo(() => new ConversationService(), []);

  // Load conversation messages
  const loadConversation = useCallback(async () => {
    if (!conversationId || !user) {
      setConversationState((prev) => ({ ...prev, messages: [] }));
      return;
    }

    try {
      setConversationState((prev) => ({ ...prev, isLoading: true }));

      const [conversation, messages] = await Promise.all([
        conversationService.getConversation(conversationId),
        conversationService.getConversationMessages(conversationId),
      ]);

      setConversationState({
        messages,
        isLoading: false,
        architecture: conversation?.architecture_data,
        vendorRecommendations: conversation?.vendor_recommendations,
        currentConversationId: conversationId,
      });
      setError(null);
    } catch (err) {
      console.error("Error loading conversation:", err);
      setError("Failed to load conversation");
      setConversationState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [conversationId, user, conversationService]);

  // Add a message to the conversation
  const addMessage = useCallback(
    async (role: "user" | "assistant", content: string, metadata?: any) => {
      if (!conversationId) return;

      try {
        const message = await conversationService.addMessage(
          conversationId,
          role,
          content,
          metadata
        );

        const newMessage: Message = {
          id: message.id,
          role: message.role as "user" | "assistant",
          content: message.content,
          timestamp: new Date(message.created_at),
          conversation_id: message.conversation_id,
          metadata: message.metadata,
        };

        setConversationState((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));

        return newMessage;
      } catch (err) {
        console.error("Error adding message:", err);
        setError("Failed to add message");
        return null;
      }
    },
    [conversationId, conversationService]
  );

  // Update conversation architecture
  const updateArchitecture = useCallback(
    async (architectureData: any, vendorRecommendations?: any[]) => {
      if (!conversationId) return;

      try {
        await conversationService.updateConversationArchitecture(
          conversationId,
          architectureData,
          vendorRecommendations
        );
        setConversationState((prev) => ({
          ...prev,
          architecture: architectureData,
          vendorRecommendations,
        }));
      } catch (err) {
        console.error("Error updating architecture:", err);
        setError("Failed to update architecture");
      }
    },
    [conversationId, conversationService]
  );

  // Load conversation when ID changes
  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return {
    conversationState,
    error,
    addMessage,
    updateArchitecture,
    loadConversation,
  };
};
