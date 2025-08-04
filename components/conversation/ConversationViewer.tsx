"use client";

import { useState, useEffect } from "react";
import { useConversation } from "@/hooks/useConversations";
import SimpleMessage from "@/components/conversation/SimpleMessage";
import EnhancedFlowDiagram from "@/components/diagram/EnhancedFlowDiagram";
import ArchitectureDiagram from "@/components/diagram/ArchitectureDiagram";
import SimpleArchitectureDiagram from "@/components/diagram/SimpleArchitectureDiagram";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  Card,
  CardBody,
  Heading,
} from "@chakra-ui/react";
import { FiMessageCircle, FiGitBranch } from "react-icons/fi";

interface ConversationViewerProps {
  conversationId: string;
  showArchitectureOnly?: boolean;
}

export default function ConversationViewer({
  conversationId,
  showArchitectureOnly = false,
}: ConversationViewerProps) {
  const { conversationState, error } = useConversation(conversationId);
  const [activeTab, setActiveTab] = useState<"conversation" | "architecture">(
    "conversation"
  );
  const [diagramType, setDiagramType] = useState<
    "enhanced" | "flow" | "simple"
  >("enhanced");

  useEffect(() => {
    if (showArchitectureOnly && conversationState.architecture) {
      setActiveTab("architecture");
    }
  }, [showArchitectureOnly, conversationState.architecture]);

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        Error loading conversation: {error}
      </Alert>
    );
  }

  if (conversationState.isLoading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" color="blue.500" />
        <Text mt={2} color="gray.500">
          Loading conversation...
        </Text>
      </Box>
    );
  }

  const renderDiagram = () => {
    if (!conversationState.architecture) {
      return (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">
            No architecture diagram available for this conversation
          </Text>
        </Box>
      );
    }

    switch (diagramType) {
      case "enhanced":
        return (
          <EnhancedFlowDiagram architecture={conversationState.architecture} />
        );
      case "flow":
        return (
          <ArchitectureDiagram architecture={conversationState.architecture} />
        );
      case "simple":
        return (
          <SimpleArchitectureDiagram
            architecture={conversationState.architecture}
          />
        );
      default:
        return (
          <EnhancedFlowDiagram architecture={conversationState.architecture} />
        );
    }
  };

  return (
    <Box p={6}>
      <Tabs colorScheme="blue" index={activeTab === "conversation" ? 0 : 1}>
        <TabList>
          <Tab onClick={() => setActiveTab("conversation")}>
            <HStack spacing={2}>
              <FiMessageCircle />
              <Text>Conversation</Text>
            </HStack>
          </Tab>
          {conversationState.architecture && (
            <Tab onClick={() => setActiveTab("architecture")}>
              <HStack spacing={2}>
                <FiGitBranch />
                <Text>Architecture</Text>
              </HStack>
            </Tab>
          )}
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              <Heading size="lg" color="gray.900">
                Conversation Messages
              </Heading>

              {conversationState.messages.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">No messages in this conversation</Text>
                </Box>
              ) : (
                <VStack spacing={4} align="stretch">
                  {conversationState.messages.map((message) => (
                    <SimpleMessage key={message.id} message={message} />
                  ))}
                </VStack>
              )}
            </VStack>
          </TabPanel>

          {conversationState.architecture && (
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between" align="center">
                  <Heading size="lg" color="gray.900">
                    Architecture Diagram
                  </Heading>

                  {/* Diagram Type Selector */}
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      variant={diagramType === "enhanced" ? "solid" : "outline"}
                      colorScheme="blue"
                      onClick={() => setDiagramType("enhanced")}
                    >
                      Enhanced
                    </Button>
                    <Button
                      size="sm"
                      variant={diagramType === "flow" ? "solid" : "outline"}
                      colorScheme="blue"
                      onClick={() => setDiagramType("flow")}
                    >
                      Flow
                    </Button>
                    <Button
                      size="sm"
                      variant={diagramType === "simple" ? "solid" : "outline"}
                      colorScheme="blue"
                      onClick={() => setDiagramType("simple")}
                    >
                      Simple
                    </Button>
                  </HStack>
                </HStack>

                <Card variant="outline">
                  <CardBody>{renderDiagram()}</CardBody>
                </Card>

                {/* Architecture Data */}
                {conversationState.architecture && (
                  <Card variant="outline" bg="gray.50">
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Heading size="md" color="gray.900">
                          Architecture Details
                        </Heading>
                        <Box
                          bg="white"
                          p={4}
                          borderRadius="md"
                          border="1px"
                          borderColor="gray.200"
                          overflowX="auto"
                        >
                          <Code
                            display="block"
                            whiteSpace="pre"
                            fontSize="sm"
                            color="gray.700"
                          >
                            {JSON.stringify(
                              conversationState.architecture,
                              null,
                              2
                            )}
                          </Code>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
}
