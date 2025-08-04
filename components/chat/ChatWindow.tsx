"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Spinner,
  HStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  FiDownload,
  FiMessageCircle,
  FiGitBranch,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SimpleArchitectureDiagram from "../diagram/SimpleArchitectureDiagram";
import FlowArchitectureDiagram from "../diagram/FlowArchitectureDiagram";
import EnhancedFlowDiagram from "../diagram/EnhancedFlowDiagram";
import CostCalculator from "../cost/CostCalculator";
import { Message } from "@/types/conversation";

export default function ChatWindow() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [architecture, setArchitecture] = useState<any>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [diagramType, setDiagramType] = useState<
    "simple" | "flow" | "enhanced"
  >("enhanced");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Only set welcome message if user is authenticated
    if (user) {
      const welcomeMessage: Message = {
        id: "1",
        role: "assistant",
        content: `Hello, ${
          user.user_metadata?.full_name || user.email
        }! I'm CARE, your Composable Architecture Recommendation Engine. I'll help you design a MACH-compliant e-commerce architecture.\n\nTo get started, tell me about your business and current e-commerce needs. For example:\n- What's your business name?\n- Do you have any preferred vendors?\n- What are your main requirements?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  // Calculate height based on authentication state
  const getContainerHeight = () => {
    // Base height minus header (80px)
    // If user is authenticated, subtract banner height (~88px with padding)
    // We check the user state from the auth listener to ensure it's current
    return user ? "calc(100vh - 168px)" : "calc(100vh - 80px)";
  };

  const handleSendMessage = async (content: string) => {
    // Check if user is authenticated
    if (!user) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Please log in to use the chat feature.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userMessage: content,
          conversationId: currentConversationId,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle authentication error
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "Authentication required. Please log in to continue using CARE.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          return;
        }
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Update conversation ID if it's a new conversation
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      console.log("Received data from API:", data);
      if (data.architecture) {
        console.log("Setting architecture:", data.architecture);
        setArchitecture(data.architecture);
      } else {
        console.log("No architecture in response");
      }

      // Debug: log current architecture state
      console.log("Current architecture state:", architecture);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportArchitecture = () => {
    if (architecture) {
      const dataStr = JSON.stringify(architecture, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `${
        architecture.business || "architecture"
      }-care-recommendation.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    }
  };

  if (authLoading) {
    return (
      <Box h="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box h={getContainerHeight()} display="flex" flexDirection="column">
        {/* Header */}
        <Box p={4} borderBottom="1px" borderColor="gray.200" bg="white">
          <Box maxW="7xl" mx="auto">
            <HStack justify="space-between" align="center">
              <VStack align="start" spacing={0}>
                <Link href="/" passHref>
                  <Heading
                    size="md"
                    color="blue.600"
                    cursor="pointer"
                    _hover={{ color: "blue.700" }}
                  >
                    CARE
                  </Heading>
                </Link>
                <Text fontSize="sm" color="gray.600">
                  Composable Architecture Recommendation Engine
                </Text>
              </VStack>

              <HStack spacing={2}>
                {/* Debug indicator */}
                <Text fontSize="xs" color="gray.500">
                  {architecture ? "Has Architecture" : "No Architecture"}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          flex="1"
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.50"
        >
          <Box maxW="7xl" mx="auto" px={4} w="full">
            <Alert
              status="info"
              w="full"
              maxW="md"
              borderRadius="md"
              p={4}
              mx="auto"
            >
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <AlertTitle>Welcome to CARE!</AlertTitle>
                <AlertDescription>
                  Please{" "}
                  <Link href="/auth/login" passHref>
                    <Button variant="link" colorScheme="blue" size="sm">
                      log in
                    </Button>
                  </Link>{" "}
                  to your account to start using the Composable Architecture
                  Recommendation Engine.
                </AlertDescription>
              </VStack>
            </Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box h={getContainerHeight()} display="flex" flexDirection="column">
      {/* Header */}
      <Box p={4} borderBottom="1px" borderColor="gray.200" bg="white">
        <Box maxW="7xl" mx="auto">
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Link href="/" passHref>
                <Heading
                  size="md"
                  color="blue.600"
                  cursor="pointer"
                  _hover={{ color: "blue.700" }}
                >
                  CARE
                </Heading>
              </Link>
              <Text fontSize="sm" color="gray.600">
                Composable Architecture Recommendation Engine
              </Text>
            </VStack>

            <HStack spacing={2}>
              <Link href="/dashboard" passHref>
                <Button
                  leftIcon={<FiUser />}
                  colorScheme="blue"
                  variant="ghost"
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              {architecture && (
                <Button
                  leftIcon={<FiDownload />}
                  onClick={handleExportArchitecture}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                >
                  Export JSON
                </Button>
              )}
              {/* Debug indicator */}
              <Text fontSize="xs" color="gray.500">
                {architecture ? "Has Architecture" : "No Architecture"}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flex="1" overflow="hidden">
        <Tabs h="full" display="flex" flexDirection="column">
          <Box borderBottom="1px" borderColor="gray.200">
            <Box maxW="7xl" mx="auto">
              <TabList>
                <Tab>
                  <HStack spacing={2}>
                    <FiMessageCircle />
                    <Text>Conversation</Text>
                  </HStack>
                </Tab>
                {architecture && (
                  <Tab>
                    <HStack spacing={2}>
                      <FiGitBranch />
                      <Text>Architecture</Text>
                    </HStack>
                  </Tab>
                )}
                {architecture && (
                  <Tab>
                    <HStack spacing={2}>
                      <FiDollarSign />
                      <Text>Cost Estimation</Text>
                    </HStack>
                  </Tab>
                )}
              </TabList>
            </Box>
          </Box>

          <TabPanels flex="1" overflow="hidden">
            <TabPanel p={0} h="full" display="flex" flexDirection="column">
              {/* Messages */}
              <Box flex="1" overflow="hidden" bg="gray.50">
                <Box maxW="7xl" mx="auto" h="full">
                  <VStack
                    h="full"
                    overflow="auto"
                    p={4}
                    spacing={0}
                    align="stretch"
                  >
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}

                    {isLoading && (
                      <HStack justify="center" py={4}>
                        <Spinner size="sm" color="blue.500" />
                        <Text fontSize="sm" color="gray.600">
                          CARE is thinking...
                        </Text>
                      </HStack>
                    )}

                    <div ref={messagesEndRef} />
                  </VStack>
                </Box>
              </Box>

              {/* Input */}
              <Box borderTop="1px" borderColor="gray.200">
                <Box maxW="7xl" mx="auto">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    disabled={!user}
                  />
                </Box>
              </Box>
            </TabPanel>

            {architecture && (
              <TabPanel p={0} h="full" overflow="hidden">
                <Box h="full" overflow="auto" bg="gray.50">
                  <Box maxW="7xl" mx="auto" h="full" p={4}>
                    {/* Diagram Type Toggle */}
                    <HStack spacing={2} mb={4} justify="center">
                      <Button
                        size="sm"
                        variant={
                          diagramType === "enhanced" ? "solid" : "outline"
                        }
                        colorScheme="blue"
                        onClick={() => setDiagramType("enhanced")}
                      >
                        Enhanced Flow
                      </Button>
                      <Button
                        size="sm"
                        variant={diagramType === "flow" ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setDiagramType("flow")}
                      >
                        Flow Diagram
                      </Button>
                      <Button
                        size="sm"
                        variant={diagramType === "simple" ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setDiagramType("simple")}
                      >
                        Component View
                      </Button>
                    </HStack>

                    {diagramType === "enhanced" ? (
                      <EnhancedFlowDiagram architecture={architecture} />
                    ) : diagramType === "flow" ? (
                      <FlowArchitectureDiagram architecture={architecture} />
                    ) : (
                      <SimpleArchitectureDiagram architecture={architecture} />
                    )}
                  </Box>
                </Box>
              </TabPanel>
            )}

            {architecture && (
              <TabPanel p={0} h="full" overflow="hidden">
                <Box h="full" overflow="auto" bg="gray.50">
                  <Box maxW="7xl" mx="auto" h="full" p={4}>
                    <CostCalculator architecture={architecture} />
                  </Box>
                </Box>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
