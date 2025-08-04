# Conversation Management System Setup

## Overview

The CARE application now includes a comprehensive conversation management system that allows users to:

1. **Save conversations securely** - All conversations are saved in Supabase with proper authentication
2. **View conversation history** - Dashboard access to all past conversations
3. **Architecture tab** - View previous architecture diagrams separately
4. **Secure access** - Uses AuthContext for consistent user authentication

## Database Setup

### 1. Apply Database Migration

Run the following SQL in your Supabase database to create the necessary tables:

```sql
-- Execute the SQL from: database/migrations/001_create_conversations.sql
```

The migration creates:

- `conversations` table - stores conversation metadata
- `messages` table - stores individual messages
- Row Level Security (RLS) policies for secure access
- Automatic triggers for updating conversation timestamps

### 2. Environment Variables

Ensure your `.env.local` file includes:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## Features

### 1. Conversation Storage

- **Automatic creation** - New conversations are created automatically when users start chatting
- **Smart titles** - Conversation titles are generated from the first message
- **Architecture storage** - Architecture diagrams are saved with conversations
- **Message history** - All messages are preserved with timestamps

### 2. Dashboard Interface

Access the dashboard at `/dashboard` to:

- View all conversations with message counts and timestamps
- Filter conversations to show only those with architecture diagrams
- Search conversations by title
- View individual conversations with full message history
- Access architecture diagrams from past conversations

### 3. Architecture Management

- **Architecture tab** - Separate tab in dashboard for conversations with architecture
- **Three diagram types** - Enhanced, Flow, and Simple views
- **Export functionality** - Download architecture as JSON
- **Persistent storage** - Architecture data is saved and retrievable

### 4. Security Features

- **Row Level Security** - Users can only access their own conversations
- **Authentication required** - All features require user authentication
- **Secure API endpoints** - All conversation APIs validate user authentication

## Usage

### Starting a New Conversation

1. User visits the main chat interface
2. Authentication is checked using AuthContext
3. User sends first message
4. System creates new conversation with auto-generated title
5. All subsequent messages are saved to the conversation

### Accessing Conversation History

1. User clicks "Dashboard" button in the header
2. Dashboard displays all user's conversations
3. User can:
   - Switch between "All Conversations" and "Architecture" tabs
   - Search conversations by title
   - Click "View" to see full conversation
   - Click "Delete" to remove conversations

### Viewing Architecture

1. From dashboard, click on a conversation with architecture
2. Use the "Architecture" tab to view diagrams
3. Switch between Enhanced, Flow, and Simple diagram types
4. View raw architecture data in JSON format

## API Endpoints

### Conversation Management

- `POST /api/conversation` - Send message and save to conversation
- `GET /api/conversations` - Get user's conversations
- `GET /api/conversations?id=<id>` - Get specific conversation with messages
- `GET /api/conversations?withArchitecture=true` - Get conversations with architecture
- `DELETE /api/conversations?id=<id>` - Delete conversation
- `PATCH /api/conversations?id=<id>` - Update conversation title

### Authentication

All API endpoints require authentication and will return 401 if user is not logged in.

## Components

### New Components

1. **ConversationHistory** - Lists user's conversations with search and filtering
2. **ConversationViewer** - Displays individual conversation with messages and architecture
3. **SimpleMessage** - Simple message component for displaying conversation history
4. **DashboardClient** - Updated dashboard with conversation management

### Services

1. **ConversationService** - Client-side conversation management
2. **ServerConversationService** - Server-side conversation operations
3. **useConversations** - React hook for conversation state management

## Database Schema

### Conversations Table

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  architecture_data JSONB,
  vendor_recommendations JSONB,
  total_messages INTEGER DEFAULT 0
);
```

### Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);
```

## Next Steps

1. **Run the database migration** to set up the tables
2. **Test the conversation flow** by starting a new chat
3. **Verify dashboard access** by checking saved conversations
4. **Test architecture saving** by completing a conversation that generates architecture
5. **Confirm security** by ensuring users can only see their own conversations

The system is now ready for production use with secure conversation management and comprehensive user dashboard access.
