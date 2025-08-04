"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import { ConversationSummary } from "@/types/conversation";
import Link from "next/link";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Heading,
  useToast,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiMessageCircle,
  FiGitBranch,
  FiTrash2,
} from "react-icons/fi";

// Helper function to format date
const formatTimeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return past.toLocaleDateString();
};

interface ConversationHistoryProps {
  onSelectConversation?: (conversationId: string) => void;
  showArchitectureOnly?: boolean;
}

export default function ConversationHistory({
  onSelectConversation,
  showArchitectureOnly = false,
}: ConversationHistoryProps) {
  const { user } = useAuth();
  const { conversations, loading, error, deleteConversation } =
    useConversations();
  const [filteredConversations, setFilteredConversations] = useState<
    ConversationSummary[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const toast = useToast();

  // Filter conversations based on search and architecture filter
  useEffect(() => {
    let filtered = conversations;

    if (showArchitectureOnly) {
      filtered = filtered.filter((conv) => conv.has_architecture);
    }

    if (searchQuery) {
      filtered = filtered.filter((conv) =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredConversations(filtered);
  }, [conversations, searchQuery, showArchitectureOnly]);

  const handleDeleteConversation = async (
    conversationId: string,
    title: string
  ) => {
    if (
      window.confirm(
        `Are you sure you want to delete the conversation "${title}"?`
      )
    ) {
      const success = await deleteConversation(conversationId);
      if (success) {
        toast({
          title: "Conversation deleted",
          description: `"${title}" has been deleted successfully.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete conversation. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  if (!user) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">Please log in to view your conversations</Text>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text mt={2} color="gray.500">
          Loading conversations...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        Error loading conversations: {error}
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch" p={6}>
      {/* Search Input */}
      <InputGroup size="lg">
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          bg="white"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
        />
        <InputRightElement>
          <FiSearch color="gray.400" />
        </InputRightElement>
      </InputGroup>

      {filteredConversations.length === 0 ? (
        <Box textAlign="center" py={12}>
          <VStack spacing={4}>
            <Box
              w={16}
              h={16}
              bg="gray.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {showArchitectureOnly ? (
                <FiGitBranch size={24} color="gray.400" />
              ) : (
                <FiMessageCircle size={24} color="gray.400" />
              )}
            </Box>
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="medium" color="gray.700">
                {showArchitectureOnly
                  ? "No architecture conversations found"
                  : searchQuery
                  ? "No conversations match your search"
                  : "No conversations yet"}
              </Text>
              <Text color="gray.500">
                {!showArchitectureOnly && !searchQuery
                  ? "Start a new conversation to see it here"
                  : "Try adjusting your search or filters"}
              </Text>
            </VStack>
          </VStack>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              variant="outline"
              _hover={{ shadow: "md" }}
              transition="all 0.2s"
            >
              <CardBody>
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={3} flex={1}>
                    <HStack spacing={3} align="center">
                      <Heading size="md" color="gray.900">
                        {conversation.title}
                      </Heading>
                      {conversation.has_architecture && (
                        <Badge colorScheme="blue" variant="subtle">
                          <HStack spacing={1}>
                            <FiGitBranch size={12} />
                            <Text>Architecture</Text>
                          </HStack>
                        </Badge>
                      )}
                    </HStack>

                    <HStack spacing={4} fontSize="sm" color="gray.500">
                      <HStack spacing={1}>
                        <FiMessageCircle size={14} />
                        <Text>
                          {conversation.total_messages} message
                          {conversation.total_messages !== 1 ? "s" : ""}
                        </Text>
                      </HStack>
                      <Text>{formatTimeAgo(conversation.updated_at)}</Text>
                    </HStack>
                  </VStack>

                  <HStack spacing={2}>
                    {onSelectConversation ? (
                      <Button
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => onSelectConversation(conversation.id)}
                      >
                        View
                      </Button>
                    ) : (
                      <Button
                        as={Link}
                        href={`/conversation/${conversation.id}`}
                        size="sm"
                        colorScheme="blue"
                        variant="outline"
                      >
                        View
                      </Button>
                    )}

                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      leftIcon={<FiTrash2 />}
                      onClick={() =>
                        handleDeleteConversation(
                          conversation.id,
                          conversation.title
                        )
                      }
                    >
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
