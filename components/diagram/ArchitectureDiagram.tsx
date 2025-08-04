"use client";

import { useEffect, useRef } from "react";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import mermaid from "mermaid";
import { ArchitectureOutput } from "@/types/vendor";

interface ArchitectureDiagramProps {
  architecture: ArchitectureOutput;
}

export default function ArchitectureDiagram({
  architecture,
}: ArchitectureDiagramProps) {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
      securityLevel: "loose",
    });
  }, []);

  useEffect(() => {
    if (diagramRef.current && architecture) {
      const diagramDefinition = generateMermaidDiagram(architecture);
      console.log("Generating diagram for architecture:", architecture);
      console.log("Mermaid definition:", diagramDefinition);

      // Clear previous diagram
      if (diagramRef.current) {
        diagramRef.current.innerHTML = "";
      }

      // Generate unique ID for this diagram
      const diagramId = `architecture-diagram-${Date.now()}`;

      mermaid
        .render(diagramId, diagramDefinition)
        .then(({ svg }) => {
          if (diagramRef.current) {
            diagramRef.current.innerHTML = svg;
          }
        })
        .catch((error) => {
          console.error("Mermaid rendering error:", error);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = `
              <div style="padding: 20px; text-align: center; color: #666;">
                <p>Error rendering diagram</p>
                <p style="font-size: 12px;">${error.message}</p>
              </div>
            `;
          }
        });
    }
  }, [architecture]);

  const generateMermaidDiagram = (arch: ArchitectureOutput): string => {
    const nodes: string[] = [];
    const connections: string[] = [];

    // Add user node
    nodes.push("User[👤 User]");

    // Add business node
    nodes.push(`Business["🏢 ${arch.business}"]`);
    connections.push(
      'User -->|"User Actions<br/>Browse, Search, Purchase"| Business'
    );

    // Add architecture components
    const components = [
      {
        key: "commerce_engine",
        label: "🛒 Commerce Engine",
        values: arch.commerce_engine,
        nodeId: "CE",
      },
      { key: "pim", label: "📦 PIM", values: arch.pim, nodeId: "PIM" },
      { key: "cms", label: "📝 CMS", values: arch.cms, nodeId: "CMS" },
      {
        key: "search",
        label: "🔍 Search",
        values: arch.search,
        nodeId: "SEARCH",
      },
      {
        key: "payment_provider",
        label: "💳 Payment",
        values: arch.payment_provider,
        nodeId: "PAY",
      },
      {
        key: "omnichannel",
        label: "🌐 Omnichannel",
        values: arch.omnichannel,
        nodeId: "OMNI",
      },
      {
        key: "analytics",
        label: "📊 Analytics",
        values: arch.analytics,
        nodeId: "ANALYTICS",
      },
      {
        key: "loyalty",
        label: "🎁 Loyalty",
        values: arch.loyalty,
        nodeId: "LOYALTY",
      },
      {
        key: "personalization",
        label: "🎯 Personalization",
        values: arch.personalization,
        nodeId: "PERSO",
      },
      { key: "tax", label: "💰 Tax", values: arch.tax, nodeId: "TAX" },
      {
        key: "inventory",
        label: "📦 Inventory",
        values: arch.inventory,
        nodeId: "INV",
      },
      {
        key: "order_management",
        label: "📋 Order Management",
        values: arch.order_management,
        nodeId: "OMS",
      },
    ];

    const activeComponents: any[] = [];

    components.forEach(({ key, label, values, nodeId }) => {
      if (values && values.length > 0) {
        const vendorList = values.join("<br/>• ");
        nodes.push(`${nodeId}["${label}<br/>• ${vendorList}"]`);
        activeComponents.push({ key, nodeId });

        // Connect to business with specific data flow descriptions
        connections.push(
          `Business -->|"Configuration<br/>& Management"| ${nodeId}`
        );
      }
    });

    // Add intelligent connections with detailed data flow labels
    const componentMap = Object.fromEntries(
      activeComponents.map((c) => [c.key, c.nodeId])
    );

    // User journey flow with detailed labels
    if (componentMap.omnichannel && componentMap.commerce_engine) {
      connections.push(
        `User -.->|"Multi-channel<br/>Interactions"| ${componentMap.omnichannel}`
      );
      connections.push(
        `${componentMap.omnichannel} -->|"Unified Customer<br/>Experience"| ${componentMap.commerce_engine}`
      );
    } else if (componentMap.commerce_engine) {
      connections.push(
        `User -.->|"Direct Store<br/>Interactions"| ${componentMap.commerce_engine}`
      );
    }

    // Data flow connections with detailed descriptions
    if (componentMap.commerce_engine) {
      if (componentMap.pim) {
        connections.push(
          `${componentMap.pim} -->|"Product Data<br/>Catalog, Pricing, Specs"| ${componentMap.commerce_engine}`
        );
      }
      if (componentMap.cms) {
        connections.push(
          `${componentMap.cms} -->|"Content Data<br/>Marketing, Descriptions"| ${componentMap.commerce_engine}`
        );
      }
      if (componentMap.search) {
        connections.push(
          `${componentMap.commerce_engine} -->|"Search Index<br/>Products, Inventory"| ${componentMap.search}`
        );
        connections.push(
          `${componentMap.search} -.->|"Search Results<br/>& Suggestions"| ${componentMap.commerce_engine}`
        );
      }
      if (componentMap.payment_provider) {
        connections.push(
          `${componentMap.commerce_engine} -->|"Payment Requests<br/>Amount, Customer"| ${componentMap.payment_provider}`
        );
        connections.push(
          `${componentMap.payment_provider} -.->|"Payment Status<br/>Success/Failure"| ${componentMap.commerce_engine}`
        );
      }
      if (componentMap.tax) {
        connections.push(
          `${componentMap.commerce_engine} -->|"Tax Calculation<br/>Location, Items"| ${componentMap.tax}`
        );
        connections.push(
          `${componentMap.tax} -.->|"Tax Amounts<br/>& Compliance"| ${componentMap.commerce_engine}`
        );
      }
      if (componentMap.inventory) {
        connections.push(
          `${componentMap.inventory} -->|"Stock Levels<br/>Availability, Location"| ${componentMap.commerce_engine}`
        );
        connections.push(
          `${componentMap.commerce_engine} -.->|"Inventory Updates<br/>Reserved, Sold"| ${componentMap.inventory}`
        );
      }
      if (componentMap.order_management) {
        connections.push(
          `${componentMap.commerce_engine} -->|"Order Data<br/>Items, Customer, Shipping"| ${componentMap.order_management}`
        );
        connections.push(
          `${componentMap.order_management} -.->|"Order Status<br/>Processing, Shipped"| ${componentMap.commerce_engine}`
        );
      }
    }

    // Analytics data collection (bidirectional for insights)
    if (componentMap.analytics) {
      const analyticsSource = [
        componentMap.commerce_engine,
        componentMap.omnichannel,
        componentMap.search,
        componentMap.payment_provider,
      ].filter(Boolean);

      analyticsSource.forEach((source) => {
        connections.push(
          `${source} -->|"Event Data<br/>User Actions, Performance"| ${componentMap.analytics}`
        );
      });

      // Analytics insights back to systems
      if (componentMap.personalization) {
        connections.push(
          `${componentMap.analytics} -->|"User Behavior<br/>Patterns, Preferences"| ${componentMap.personalization}`
        );
      }
    }

    // Personalization connections with detailed data flows
    if (componentMap.personalization) {
      if (componentMap.cms) {
        connections.push(
          `${componentMap.personalization} -->|"Content Rules<br/>Personalized Experience"| ${componentMap.cms}`
        );
      }
      if (componentMap.search) {
        connections.push(
          `${componentMap.personalization} -->|"Search Personalization<br/>Custom Results"| ${componentMap.search}`
        );
      }
      if (componentMap.commerce_engine) {
        connections.push(
          `${componentMap.personalization} -->|"Product Recommendations<br/>Personalized Offers"| ${componentMap.commerce_engine}`
        );
      }
    }

    // Loyalty program integrations
    if (componentMap.loyalty) {
      if (componentMap.commerce_engine) {
        connections.push(
          `${componentMap.commerce_engine} <-->|"Loyalty Points<br/>Rewards, Redemptions"| ${componentMap.loyalty}`
        );
      }
      if (componentMap.personalization) {
        connections.push(
          `${componentMap.loyalty} -->|"Loyalty Data<br/>Tier, History"| ${componentMap.personalization}`
        );
      }
    }

    const diagramDefinition = `
graph TD
    ${nodes.join("\n    ")}
    ${connections.join("\n    ")}
    
    classDef userClass fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef businessClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#000
    classDef coreClass fill:#e8f5e8,stroke:#388e3c,stroke-width:3px,color:#000
    classDef dataClass fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    classDef serviceClass fill:#f1f8ff,stroke:#0366d6,stroke-width:3px,color:#000
    classDef insightClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#000
    
    class User userClass
    class Business businessClass
    class CE,OMNI,PAY,OMS coreClass
    class PIM,CMS,INV dataClass
    class SEARCH,TAX serviceClass
    class ANALYTICS,LOYALTY,PERSO insightClass
    
    %% Add hover effects and integration point highlights
    linkStyle default stroke:#666,stroke-width:2px
    `;

    return diagramDefinition;
  };

  return (
    <VStack spacing={4} align="stretch">
      <VStack align="start" spacing={1}>
        <Heading size="md" color="blue.600">
          Architecture Diagram
        </Heading>
        <Text fontSize="sm" color="gray.600">
          MACH-compliant architecture for {architecture.business}
        </Text>
      </VStack>

      <Box
        ref={diagramRef}
        p={4}
        bg="white"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        overflow="auto"
        minH="400px"
      />
    </VStack>
  );
}
