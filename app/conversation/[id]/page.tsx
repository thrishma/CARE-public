import ConversationViewer from "@/components/conversation/ConversationViewer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default function ConversationPage({ params }: ConversationPageProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                  Conversation
                </h1>
              </div>
              <Link
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                New Chat
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ConversationViewer conversationId={params.id} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
