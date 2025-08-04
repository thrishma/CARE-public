"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import { ArchitectureOutput } from "@/types/vendor";
import VendorLogo from "../ui/VendorLogo";

interface SimpleArchitectureDiagramProps {
  architecture: ArchitectureOutput;
}

export default function SimpleArchitectureDiagram({
  architecture,
}: SimpleArchitectureDiagramProps) {
  const componentDefs = [
    {
      key: "commerce_engine",
      label: "Commerce Engine",
      icon: "🛒",
      values: architecture.commerce_engine,
    },
    {
      key: "frontend_framework",
      label: "Frontend Framework",
      icon: "⚛️",
      values: architecture.frontend_framework,
    },
    { key: "pim", label: "PIM", icon: "📦", values: architecture.pim },
    { key: "cms", label: "CMS", icon: "📝", values: architecture.cms },
    { key: "search", label: "Search", icon: "🔍", values: architecture.search },
    {
      key: "payment_provider",
      label: "Payment",
      icon: "💳",
      values: architecture.payment_provider,
    },
    {
      key: "omnichannel",
      label: "Omnichannel",
      icon: "🌐",
      values: architecture.omnichannel,
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: "📊",
      values: architecture.analytics,
    },
    {
      key: "loyalty",
      label: "Loyalty",
      icon: "🎁",
      values: architecture.loyalty,
    },
    {
      key: "personalization",
      label: "Personalization",
      icon: "🎯",
      values: architecture.personalization,
    },
    { key: "tax", label: "Tax", icon: "💰", values: architecture.tax },
    {
      key: "inventory",
      label: "Inventory",
      icon: "📋",
      values: architecture.inventory,
    },
    {
      key: "order_management",
      label: "Order Management",
      icon: "📋",
      values: architecture.order_management,
    },
  ];

  const activeComponents = componentDefs.filter(
    ({ values }) => values && values.length > 0
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      commerce_engine: "#e8f5e8",
      omnichannel: "#e8f5e8",
      payment_provider: "#e8f5e8",
      order_management: "#e8f5e8",
      frontend_framework: "#fce4ec",
      pim: "#fff3e0",
      cms: "#fff3e0",
      inventory: "#fff3e0",
      search: "#f1f8ff",
      analytics: "#f1f8ff",
      loyalty: "#f1f8ff",
      personalization: "#f1f8ff",
      tax: "#f1f8ff",
    };
    return colors[category as keyof typeof colors] || "#f5f5f5";
  };

  const getBorderColor = (category: string) => {
    const colors = {
      commerce_engine: "#388e3c",
      omnichannel: "#388e3c",
      payment_provider: "#388e3c",
      order_management: "#388e3c",
      frontend_framework: "#e91e63",
      pim: "#f57c00",
      cms: "#f57c00",
      inventory: "#f57c00",
      search: "#0366d6",
      analytics: "#0366d6",
      loyalty: "#0366d6",
      personalization: "#0366d6",
      tax: "#0366d6",
    };
    return colors[category as keyof typeof colors] || "#666";
  };

  return (
    <VStack spacing={6} align="stretch">
      <VStack align="start" spacing={1}>
        <Heading size="md" color="blue.600">
          MACH Architecture Overview
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Enhanced data flow visualization for {architecture.business}
        </Text>
      </VStack>

      {/* Architecture Flow Diagram */}
      <Box
        bg="white"
        p={6}
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="gray.700"
          mb={4}
          textAlign="center"
        >
          MACH Architecture Data Flow
        </Text>

        {/* Create a flow diagram showing connections */}
        <Box position="relative" minH="400px" overflow="auto">
          {/* Layer 1: User & Business */}
          <VStack spacing={3} align="center" mb={6}>
            <Box
              bg="#e3f2fd"
              border="2px solid #1976d2"
              borderRadius="lg"
              p={3}
              minW="120px"
              textAlign="center"
            >
              <Text fontSize="lg">👤</Text>
              <Text fontWeight="bold" fontSize="sm" color="#1976d2">
                User
              </Text>
            </Box>

            <VStack spacing={1}>
              <Text color="#666" fontSize="lg">
                ↓
              </Text>
              <Text fontSize="xs" color="gray.600" textAlign="center">
                User Actions
                <br />
                Browse, Search, Purchase
              </Text>
            </VStack>

            <Box
              bg="#f3e5f5"
              border="2px solid #7b1fa2"
              borderRadius="lg"
              p={3}
              minW="120px"
              textAlign="center"
            >
              <Text fontSize="lg">🏢</Text>
              <Text fontWeight="bold" fontSize="sm" color="#7b1fa2">
                {architecture.business}
              </Text>
            </Box>
          </VStack>

          {/* Layer 2: Frontend & Omnichannel */}
          {activeComponents.some(
            (c) => c.key === "frontend_framework" || c.key === "omnichannel"
          ) && (
            <VStack spacing={4} mb={6}>
              <VStack spacing={1}>
                <Text color="#666" fontSize="lg">
                  ↓
                </Text>
                <Text fontSize="xs" color="gray.600">
                  User Interface Layer
                </Text>
              </VStack>
              <HStack spacing={8} justify="center" wrap="wrap">
                {activeComponents
                  .filter(
                    (c) =>
                      c.key === "frontend_framework" || c.key === "omnichannel"
                  )
                  .map(({ key, label, icon, values }) => (
                    <VStack key={key} spacing={2}>
                      <Box
                        bg={getCategoryColor(key)}
                        border="2px solid"
                        borderColor={getBorderColor(key)}
                        borderRadius="lg"
                        p={3}
                        textAlign="center"
                        minW="100px"
                        position="relative"
                      >
                        <Text fontSize="lg">{icon}</Text>
                        <Text fontWeight="bold" fontSize="xs" color="gray.700">
                          {label}
                        </Text>
                        {/* Integration point indicator */}
                        <Box
                          position="absolute"
                          top="-2px"
                          right="-2px"
                          bg="red.500"
                          borderRadius="full"
                          w={3}
                          h={3}
                          title="Integration Point"
                        />
                      </Box>
                      {values?.map((vendor) => (
                        <Text
                          key={vendor}
                          fontSize="xs"
                          fontWeight="medium"
                          textAlign="center"
                        >
                          {vendor}
                        </Text>
                      ))}
                    </VStack>
                  ))}
              </HStack>
            </VStack>
          )}

          {/* Layer 3: Commerce Engine (Core) */}
          {activeComponents.some((c) => c.key === "commerce_engine") && (
            <VStack spacing={4} mb={6}>
              <VStack spacing={1}>
                <Text color="#666" fontSize="lg">
                  ↓
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Core Commerce Layer
                </Text>
              </VStack>
              {activeComponents
                .filter((c) => c.key === "commerce_engine")
                .map(({ key, label, icon, values }) => (
                  <VStack key={key} spacing={2}>
                    <Box
                      bg={getCategoryColor(key)}
                      border="3px solid"
                      borderColor={getBorderColor(key)}
                      borderRadius="lg"
                      p={4}
                      textAlign="center"
                      minW="140px"
                      position="relative"
                    >
                      <Text fontSize="xl">{icon}</Text>
                      <Text fontWeight="bold" fontSize="sm" color="gray.700">
                        {label}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Core Engine
                      </Text>
                      {/* Central hub indicator */}
                      <Box
                        position="absolute"
                        top="-2px"
                        right="-2px"
                        bg="orange.500"
                        borderRadius="full"
                        w={4}
                        h={4}
                        title="Central Hub"
                      />
                    </Box>
                    {values?.map((vendor) => (
                      <Text
                        key={vendor}
                        fontSize="sm"
                        fontWeight="medium"
                        textAlign="center"
                      >
                        {vendor}
                      </Text>
                    ))}
                  </VStack>
                ))}
            </VStack>
          )}

          {/* Data Flow Indicators */}
          <VStack spacing={4} mb={6}>
            <HStack spacing={4} justify="center" wrap="wrap">
              <HStack spacing={2}>
                <Text color="#666" fontSize="sm">
                  ↕️
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Bidirectional Data
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Box bg="red.500" borderRadius="full" w={3} h={3} />
                <Text fontSize="xs" color="gray.600">
                  Critical Integration
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Box bg="orange.500" borderRadius="full" w={3} h={3} />
                <Text fontSize="xs" color="gray.600">
                  Data Hub
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Box bg="green.500" borderRadius="full" w={3} h={3} />
                <Text fontSize="xs" color="gray.600">
                  Real-time Sync
                </Text>
              </HStack>
            </HStack>
          </VStack>

          {/* Layer 4: Connected Services with Data Flow Indicators */}
          <VStack spacing={4} mb={6}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="gray.700"
              textAlign="center"
            >
              Connected Services & Data Exchange
            </Text>
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
              {activeComponents
                .filter(
                  (c) =>
                    ![
                      "frontend_framework",
                      "omnichannel",
                      "commerce_engine",
                    ].includes(c.key)
                )
                .map(({ key, label, icon, values }) => {
                  // Determine data flow type based on component
                  let flowType = "bidirectional";
                  let flowColor = "blue.500";
                  let flowDescription = "API Integration";

                  if (["pim", "cms", "inventory"].includes(key)) {
                    flowType = "inbound";
                    flowColor = "green.500";
                    flowDescription = "Data Provider";
                  } else if (
                    ["payment_provider", "tax", "order_management"].includes(
                      key
                    )
                  ) {
                    flowType = "outbound";
                    flowColor = "orange.500";
                    flowDescription = "Service Consumer";
                  } else if (["analytics", "personalization"].includes(key)) {
                    flowType = "bidirectional";
                    flowColor = "purple.500";
                    flowDescription = "Data Processor";
                  }

                  return (
                    <VStack key={key} spacing={2}>
                      <Box
                        bg={getCategoryColor(key)}
                        border="2px solid"
                        borderColor={getBorderColor(key)}
                        borderRadius="lg"
                        p={3}
                        textAlign="center"
                        minW="90px"
                        position="relative"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        transition="all 0.2s"
                      >
                        <Text fontSize="lg">{icon}</Text>
                        <Text fontWeight="bold" fontSize="xs" color="gray.700">
                          {label}
                        </Text>
                        {/* Data flow indicator */}
                        <Box
                          position="absolute"
                          top="-2px"
                          right="-2px"
                          bg={flowColor}
                          borderRadius="full"
                          w={3}
                          h={3}
                          title={flowDescription}
                        />
                      </Box>
                      {values?.map((vendor) => (
                        <Text
                          key={vendor}
                          fontSize="xs"
                          fontWeight="medium"
                          textAlign="center"
                        >
                          {vendor}
                        </Text>
                      ))}
                      {/* Flow direction indicator */}
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        {flowType === "inbound"
                          ? "→ Commerce"
                          : flowType === "outbound"
                          ? "Commerce →"
                          : "↔ Commerce"}
                      </Text>
                    </VStack>
                  );
                })}
            </SimpleGrid>
          </VStack>

          {/* Integration Architecture Summary */}
          <Box
            bg="gray.50"
            p={4}
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>
              Integration Architecture Summary
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <VStack align="start" spacing={2}>
                <Text fontSize="xs" fontWeight="bold">
                  Data Sources:
                </Text>
                {activeComponents
                  .filter((c) => ["pim", "cms", "inventory"].includes(c.key))
                  .map((c) => (
                    <Text key={c.key} fontSize="xs" color="gray.600">
                      • {c.label}: {c.values?.join(", ")}
                    </Text>
                  ))}
              </VStack>
              <VStack align="start" spacing={2}>
                <Text fontSize="xs" fontWeight="bold">
                  Service Integrations:
                </Text>
                {activeComponents
                  .filter((c) =>
                    ["payment_provider", "tax", "search", "analytics"].includes(
                      c.key
                    )
                  )
                  .map((c) => (
                    <Text key={c.key} fontSize="xs" color="gray.600">
                      • {c.label}: {c.values?.join(", ")}
                    </Text>
                  ))}
              </VStack>
            </SimpleGrid>
          </Box>
        </Box>
      </Box>

      {/* MACH Compliance Legend */}
      <Box
        bg="gray.50"
        p={6}
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
      >
        <Text fontSize="md" fontWeight="bold" color="gray.700" mb={4}>
          MACH Architecture Principles
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="bold" color="green.600">
              ✓ Microservices-based
            </Text>
            <Text fontSize="xs" color="gray.600">
              Each component operates independently with clear boundaries
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="green.600">
              ✓ API-first
            </Text>
            <Text fontSize="xs" color="gray.600">
              All integrations happen through well-defined APIs
            </Text>
          </VStack>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="bold" color="green.600">
              ✓ Cloud-native SaaS
            </Text>
            <Text fontSize="xs" color="gray.600">
              Leveraging cloud infrastructure for scalability
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="green.600">
              ✓ Headless
            </Text>
            <Text fontSize="xs" color="gray.600">
              Decoupled frontend and backend systems
            </Text>
          </VStack>
        </SimpleGrid>
      </Box>
    </VStack>
  );
}
