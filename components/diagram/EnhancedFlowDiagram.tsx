"use client";

import { useState, useEffect, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Tooltip,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiDatabase,
  FiExternalLink,
  FiRefreshCw,
  FiZap,
} from "react-icons/fi";
import { ArchitectureOutput } from "@/types/vendor";
import VendorLogo from "../ui/VendorLogo";

interface EnhancedFlowDiagramProps {
  architecture: ArchitectureOutput;
}

interface DataFlow {
  id: string;
  from: string;
  to: string;
  dataType: string;
  description: string;
  frequency: "realtime" | "batch" | "ondemand";
  priority: "high" | "medium" | "low";
  integrationPattern: "api" | "webhook" | "batch" | "stream";
}

interface IntegrationPoint {
  id: string;
  components: string[];
  type: "data_sync" | "api_call" | "event_stream" | "batch_process";
  description: string;
  criticalPath: boolean;
}

export default function EnhancedFlowDiagram({
  architecture,
}: EnhancedFlowDiagramProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [highlightedFlows, setHighlightedFlows] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<
    "overview" | "dataflow" | "integration"
  >("overview");
  const [animationActive, setAnimationActive] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Generate active components from architecture
  const activeComponents = [
    {
      key: "user",
      label: "User",
      icon: "👤",
      values: ["User Interface"],
      category: "frontend",
    },
    {
      key: "commerce_engine",
      label: "Commerce Engine",
      icon: "🛒",
      values: architecture.commerce_engine,
      category: "core",
    },
    {
      key: "pim",
      label: "PIM",
      icon: "📦",
      values: architecture.pim,
      category: "data",
    },
    {
      key: "cms",
      label: "CMS",
      icon: "📝",
      values: architecture.cms,
      category: "data",
    },
    {
      key: "search",
      label: "Search",
      icon: "🔍",
      values: architecture.search,
      category: "service",
    },
    {
      key: "payment_provider",
      label: "Payment",
      icon: "💳",
      values: architecture.payment_provider,
      category: "service",
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: "📊",
      values: architecture.analytics,
      category: "insight",
    },
    {
      key: "personalization",
      label: "Personalization",
      icon: "🎯",
      values: architecture.personalization,
      category: "service",
    },
    {
      key: "loyalty",
      label: "Loyalty",
      icon: "🎁",
      values: architecture.loyalty,
      category: "service",
    },
    {
      key: "order_management",
      label: "Order Management",
      icon: "📋",
      values: architecture.order_management,
      category: "core",
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: "📋",
      values: architecture.inventory,
      category: "data",
    },
    {
      key: "tax",
      label: "Tax",
      icon: "💰",
      values: architecture.tax,
      category: "service",
    },
  ].filter((comp) => comp.values && comp.values.length > 0);

  // Generate data flows based on architecture
  const generateDataFlows = (): DataFlow[] => {
    const flows: DataFlow[] = [];

    // Core e-commerce flows
    if (architecture.commerce_engine) {
      // PIM to Commerce
      if (architecture.pim) {
        flows.push({
          id: "pim-to-commerce",
          from: "pim",
          to: "commerce_engine",
          dataType: "Product Data",
          description: "Product information, pricing, specifications",
          frequency: "batch",
          priority: "high",
          integrationPattern: "api",
        });
      }

      // CMS to Commerce
      if (architecture.cms) {
        flows.push({
          id: "cms-to-commerce",
          from: "cms",
          to: "commerce_engine",
          dataType: "Content Data",
          description: "Marketing content, product descriptions, media",
          frequency: "realtime",
          priority: "medium",
          integrationPattern: "api",
        });
      }

      // Commerce to Search
      if (architecture.search) {
        flows.push({
          id: "commerce-to-search",
          from: "commerce_engine",
          to: "search",
          dataType: "Search Index",
          description: "Product catalog, inventory status, pricing",
          frequency: "realtime",
          priority: "high",
          integrationPattern: "stream",
        });
      }

      // Commerce to Payment
      if (architecture.payment_provider) {
        flows.push({
          id: "commerce-to-payment",
          from: "commerce_engine",
          to: "payment_provider",
          dataType: "Transaction Data",
          description: "Payment requests, order totals, customer info",
          frequency: "realtime",
          priority: "high",
          integrationPattern: "api",
        });
      }

      // Inventory to Commerce
      if (architecture.inventory) {
        flows.push({
          id: "inventory-to-commerce",
          from: "inventory",
          to: "commerce_engine",
          dataType: "Stock Levels",
          description: "Available quantity, warehouse locations",
          frequency: "realtime",
          priority: "high",
          integrationPattern: "webhook",
        });
      }

      // Commerce to Order Management
      if (architecture.order_management) {
        flows.push({
          id: "commerce-to-oms",
          from: "commerce_engine",
          to: "order_management",
          dataType: "Order Data",
          description: "Order details, customer info, fulfillment",
          frequency: "realtime",
          priority: "high",
          integrationPattern: "api",
        });
      }
    }

    // Analytics flows
    if (architecture.analytics) {
      activeComponents.forEach((comp) => {
        if (comp.key !== "analytics" && comp.key !== "user") {
          flows.push({
            id: `${comp.key}-to-analytics`,
            from: comp.key,
            to: "analytics",
            dataType: "Event Data",
            description: `User interactions, performance metrics from ${comp.label}`,
            frequency: "realtime",
            priority: "medium",
            integrationPattern: "stream",
          });
        }
      });
    }

    // Personalization flows
    if (architecture.personalization) {
      if (architecture.analytics) {
        flows.push({
          id: "analytics-to-personalization",
          from: "analytics",
          to: "personalization",
          dataType: "User Behavior",
          description: "Customer preferences, behavior patterns",
          frequency: "batch",
          priority: "medium",
          integrationPattern: "api",
        });
      }

      if (architecture.search) {
        flows.push({
          id: "personalization-to-search",
          from: "personalization",
          to: "search",
          dataType: "Personalization Rules",
          description: "Customized search results and recommendations",
          frequency: "realtime",
          priority: "medium",
          integrationPattern: "api",
        });
      }
    }

    // User interaction flows
    flows.push({
      id: "user-to-commerce",
      from: "user",
      to: "commerce_engine",
      dataType: "User Actions",
      description: "Browse, search, add to cart, checkout",
      frequency: "realtime",
      priority: "high",
      integrationPattern: "api",
    });

    return flows;
  };

  // Generate integration points
  const generateIntegrationPoints = (): IntegrationPoint[] => {
    const points: IntegrationPoint[] = [];

    // Critical integration points
    if (architecture.commerce_engine && architecture.payment_provider) {
      points.push({
        id: "commerce-payment-integration",
        components: ["commerce_engine", "payment_provider"],
        type: "api_call",
        description: "Real-time payment processing integration",
        criticalPath: true,
      });
    }

    if (architecture.commerce_engine && architecture.inventory) {
      points.push({
        id: "commerce-inventory-integration",
        components: ["commerce_engine", "inventory"],
        type: "event_stream",
        description: "Real-time inventory updates",
        criticalPath: true,
      });
    }

    if (architecture.pim && architecture.commerce_engine) {
      points.push({
        id: "pim-commerce-integration",
        components: ["pim", "commerce_engine"],
        type: "data_sync",
        description: "Product information synchronization",
        criticalPath: true,
      });
    }

    return points;
  };

  const dataFlows = generateDataFlows();
  const integrationPoints = generateIntegrationPoints();

  const handleComponentHover = (componentKey: string) => {
    setSelectedComponent(componentKey);
    // Highlight related flows
    const relatedFlows = dataFlows
      .filter((flow) => flow.from === componentKey || flow.to === componentKey)
      .map((flow) => flow.id);
    setHighlightedFlows(relatedFlows);
  };

  const handleComponentLeave = () => {
    setSelectedComponent(null);
    setHighlightedFlows([]);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      frontend: "#e3f2fd",
      core: "#e8f5e8",
      data: "#fff3e0",
      service: "#f1f8ff",
      insight: "#f3e5f5",
    };
    return colors[category as keyof typeof colors] || "#f5f5f5";
  };

  const getCategoryBorder = (category: string) => {
    const colors = {
      frontend: "#1976d2",
      core: "#388e3c",
      data: "#f57c00",
      service: "#0366d6",
      insight: "#7b1fa2",
    };
    return colors[category as keyof typeof colors] || "#666";
  };

  const getFlowColor = (flow: DataFlow) => {
    if (flow.priority === "high") return "#f44336";
    if (flow.priority === "medium") return "#ff9800";
    return "#4caf50";
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "realtime":
        return FiZap;
      case "batch":
        return FiDatabase;
      default:
        return FiRefreshCw;
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <VStack align="start" spacing={2}>
        <Heading size="md" color="blue.600">
          Enhanced Data Flow Architecture
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Interactive diagram showing data interactions and integration points
          for {architecture.business}
        </Text>
      </VStack>

      {/* View Mode Controls */}
      <HStack spacing={2} justify="center">
        <Button
          size="sm"
          variant={viewMode === "overview" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setViewMode("overview")}
        >
          Overview
        </Button>
        <Button
          size="sm"
          variant={viewMode === "dataflow" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setViewMode("dataflow")}
        >
          Data Flows
        </Button>
        <Button
          size="sm"
          variant={viewMode === "integration" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setViewMode("integration")}
        >
          Integration Points
        </Button>
        <Button
          size="sm"
          variant="outline"
          colorScheme="green"
          onClick={() => setAnimationActive(!animationActive)}
        >
          {animationActive ? "Stop Animation" : "Animate Flows"}
        </Button>
      </HStack>

      {/* Main Diagram */}
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={6}
        minH="600px"
        position="relative"
        overflow="auto"
      >
        {/* Components Grid */}
        <SimpleGrid columns={4} spacing={6} mb={8}>
          {activeComponents.map((component) => (
            <Tooltip
              key={component.key}
              label={`${component.label}: ${component.values?.join(", ")}`}
              placement="top"
            >
              <Box
                p={4}
                bg={getCategoryColor(component.category)}
                border="2px solid"
                borderColor={
                  selectedComponent === component.key
                    ? getCategoryBorder(component.category)
                    : "transparent"
                }
                borderRadius="lg"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                  borderColor: getCategoryBorder(component.category),
                }}
                onMouseEnter={() => handleComponentHover(component.key)}
                onMouseLeave={handleComponentLeave}
              >
                <VStack spacing={2}>
                  <Text fontSize="2xl">{component.icon}</Text>
                  <Text fontWeight="bold" fontSize="sm" textAlign="center">
                    {component.label}
                  </Text>
                  <Badge colorScheme="blue" size="sm">
                    {component.category}
                  </Badge>
                  {component.values && component.values.length > 0 && (
                    <Text fontSize="xs" color="gray.600" textAlign="center">
                      {component.values[0]}
                    </Text>
                  )}
                </VStack>
              </Box>
            </Tooltip>
          ))}
        </SimpleGrid>

        {/* Data Flow Visualization */}
        {viewMode === "dataflow" && (
          <VStack spacing={4} align="stretch">
            <Heading size="sm" color="gray.700">
              Data Flow Patterns
            </Heading>
            {dataFlows.map((flow) => (
              <Box
                key={flow.id}
                p={4}
                bg={
                  highlightedFlows.includes(flow.id) ? "yellow.50" : "gray.50"
                }
                border="1px"
                borderColor={
                  highlightedFlows.includes(flow.id) ? "yellow.300" : "gray.200"
                }
                borderRadius="md"
                opacity={
                  highlightedFlows.length > 0 &&
                  !highlightedFlows.includes(flow.id)
                    ? 0.3
                    : 1
                }
                transition="all 0.2s"
              >
                <HStack spacing={4} align="center">
                  <Badge colorScheme="blue">
                    {activeComponents.find((c) => c.key === flow.from)?.label ||
                      flow.from}
                  </Badge>
                  <Icon as={FiArrowRight} color={getFlowColor(flow)} />
                  <Badge colorScheme="green">
                    {activeComponents.find((c) => c.key === flow.to)?.label ||
                      flow.to}
                  </Badge>
                  <VStack align="start" spacing={1} flex="1">
                    <HStack>
                      <Text fontWeight="bold" fontSize="sm">
                        {flow.dataType}
                      </Text>
                      <Icon as={getFrequencyIcon(flow.frequency)} />
                      <Badge
                        colorScheme={
                          flow.priority === "high"
                            ? "red"
                            : flow.priority === "medium"
                            ? "orange"
                            : "green"
                        }
                        size="sm"
                      >
                        {flow.priority}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.600">
                      {flow.description}
                    </Text>
                  </VStack>
                  <Badge variant="outline" colorScheme="purple">
                    {flow.integrationPattern}
                  </Badge>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}

        {/* Integration Points */}
        {viewMode === "integration" && (
          <VStack spacing={4} align="stretch">
            <Heading size="sm" color="gray.700">
              Critical Integration Points
            </Heading>
            {integrationPoints.map((point) => (
              <Alert
                key={point.id}
                status={point.criticalPath ? "warning" : "info"}
                variant="left-accent"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">
                    {point.components
                      .map(
                        (c) =>
                          activeComponents.find((comp) => comp.key === c)
                            ?.label || c
                      )
                      .join(" ↔ ")}
                  </AlertTitle>
                  <AlertDescription fontSize="xs">
                    {point.description} ({point.type.replace("_", " ")})
                  </AlertDescription>
                </Box>
                {point.criticalPath && (
                  <Badge colorScheme="red" ml="auto">
                    Critical Path
                  </Badge>
                )}
              </Alert>
            ))}
          </VStack>
        )}

        {/* Animation Overlay */}
        {animationActive && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            pointerEvents="none"
            zIndex={1}
          >
            {/* Add animated flow lines here */}
            <style jsx>{`
              @keyframes flowAnimation {
                0% {
                  opacity: 0;
                  transform: translateX(-100%);
                }
                50% {
                  opacity: 1;
                }
                100% {
                  opacity: 0;
                  transform: translateX(100%);
                }
              }
            `}</style>
          </Box>
        )}
      </Box>

      {/* Legend */}
      <Box p={4} bg="gray.50" borderRadius="md">
        <Heading size="xs" mb={3}>
          Legend
        </Heading>
        <SimpleGrid columns={2} spacing={4}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="bold">
              Component Categories:
            </Text>
            <HStack>
              <Box w={4} h={4} bg="#e3f2fd" borderRadius="sm" />
              <Text fontSize="xs">Frontend</Text>
            </HStack>
            <HStack>
              <Box w={4} h={4} bg="#e8f5e8" borderRadius="sm" />
              <Text fontSize="xs">Core</Text>
            </HStack>
            <HStack>
              <Box w={4} h={4} bg="#fff3e0" borderRadius="sm" />
              <Text fontSize="xs">Data</Text>
            </HStack>
            <HStack>
              <Box w={4} h={4} bg="#f1f8ff" borderRadius="sm" />
              <Text fontSize="xs">Service</Text>
            </HStack>
            <HStack>
              <Box w={4} h={4} bg="#f3e5f5" borderRadius="sm" />
              <Text fontSize="xs">Insight</Text>
            </HStack>
          </VStack>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="bold">
              Data Flow Priority:
            </Text>
            <HStack>
              <Box w={4} h={4} bg="#f44336" borderRadius="sm" />
              <Text fontSize="xs">High Priority</Text>
            </HStack>
            <HStack>
              <Box w={4} h={4} bg="#ff9800" borderRadius="sm" />
              <Text fontSize="xs">Medium Priority</Text>
            </HStack>
            <HStack>
              <Box w={4} h={4} bg="#4caf50" borderRadius="sm" />
              <Text fontSize="xs">Low Priority</Text>
            </HStack>
          </VStack>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
