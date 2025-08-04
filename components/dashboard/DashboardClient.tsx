"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ConversationHistory from "@/components/conversation/ConversationHistory";
import ConversationViewer from "@/components/conversation/ConversationViewer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  IconButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiMessageCircle,
  FiGitBranch,
  FiPlus,
} from "react-icons/fi";
import Link from "next/link";

export default function DashboardClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"conversations" | "architecture">(
    "conversations"
  );
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleBackToList = () => {
    setSelectedConversationId(null);
  };

  if (loading) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box>
      {/* Welcome Banner */}
      <Container maxW="7xl" py={4}>
        <Box
          bg="blue.50"
          p={4}
          borderRadius="lg"
          border="1px"
          borderColor="blue.200"
        >
          <HStack justify="space-between" align="center">
            <Text color="blue.700" fontSize="sm">
              Welcome back, {user.user_metadata?.full_name || user.email}!
            </Text>
            <Button
              as={Link}
              href="/"
              colorScheme="blue"
              leftIcon={<FiPlus />}
              size="sm"
            >
              New Chat
            </Button>
          </HStack>
        </Box>
      </Container>

      <Container maxW="7xl" py={4}>
        {selectedConversationId ? (
          <VStack spacing={6} align="stretch">
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={handleBackToList}
                  cursor="pointer"
                  color="blue.600"
                  _hover={{ color: "blue.700" }}
                >
                  <HStack spacing={2}>
                    <FiArrowLeft />
                    <Text>Back to conversations</Text>
                  </HStack>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <Text color="gray.500">Conversation Details</Text>
              </BreadcrumbItem>
            </Breadcrumb>

            <Box
              bg="white"
              borderRadius="lg"
              shadow="sm"
              border="1px"
              borderColor="gray.200"
            >
              <ConversationViewer conversationId={selectedConversationId} />
            </Box>
          </VStack>
        ) : (
          <VStack spacing={8} align="stretch">
            <VStack align="start" spacing={2}>
              <Heading size="lg" color="gray.900">
                Your Conversations
              </Heading>
              <Text color="gray.600">
                View and manage your conversation history with CARE
              </Text>
            </VStack>

            <Box
              bg="white"
              borderRadius="lg"
              shadow="sm"
              border="1px"
              borderColor="gray.200"
            >
              <Tabs colorScheme="blue">
                <TabList px={6} pt={6}>
                  <Tab>
                    <HStack spacing={2}>
                      <FiMessageCircle />
                      <Text>All Conversations</Text>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack spacing={2}>
                      <FiGitBranch />
                      <Text>Architecture</Text>
                    </HStack>
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <ConversationHistory
                      onSelectConversation={handleSelectConversation}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ConversationHistory
                      onSelectConversation={handleSelectConversation}
                      showArchitectureOnly={true}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </VStack>
        )}
      </Container>
    </Box>
  );
}
