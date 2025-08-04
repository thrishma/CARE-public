export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  conversation_id?: string;
  metadata?: any;
}

export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  architecture?: any;
  vendorRecommendations?: any[];
  currentConversationId?: string;
}

export interface ConversationRequest {
  messages: Message[];
  userMessage: string;
  conversationId?: string;
}

// Database types for Supabase
export interface DatabaseConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  architecture_data?: any;
  vendor_recommendations?: any[];
  total_messages: number;
}

export interface DatabaseMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  metadata?: any;
}

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  total_messages: number;
  last_message_preview?: string;
  has_architecture?: boolean;
}
