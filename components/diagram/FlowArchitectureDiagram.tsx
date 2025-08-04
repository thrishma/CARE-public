'use client'

import { Box, Heading, Text, VStack, HStack, Button } from '@chakra-ui/react'
import { useState } from 'react'
import { ArchitectureOutput } from '@/types/vendor'
import VendorLogo from '../ui/VendorLogo'

interface FlowArchitectureDiagramProps {
  architecture: ArchitectureOutput
}

export default function FlowArchitectureDiagram({ architecture }: FlowArchitectureDiagramProps) {
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null)

  // Create a simple linear flow with more spacing
  const flowSteps = [
    { key: 'user', label: 'User', icon: '👤', x: 100, y: 100, values: null },
    { key: 'frontend', label: 'Frontend', icon: '⚛️', x: 300, y: 100, values: architecture.frontend_framework },
    { key: 'commerce', label: 'Commerce', icon: '🛒', x: 500, y: 100, values: architecture.commerce_engine },
    { key: 'checkout', label: 'Checkout', icon: '🛍️', x: 700, y: 100, values: null },
    { key: 'payment', label: 'Payment', icon: '💳', x: 900, y: 100, values: architecture.payment_provider },
  ]

  // Supporting services below with more spacing
  const supportingServices = [
    { key: 'pim', label: 'PIM', icon: '📦', values: architecture.pim, x: 200, y: 300 },
    { key: 'cms', label: 'CMS', icon: '📝', values: architecture.cms, x: 400, y: 300 },
    { key: 'search', label: 'Search', icon: '🔍', values: architecture.search, x: 600, y: 300 },
    { key: 'analytics', label: 'Analytics', icon: '📊', values: architecture.analytics, x: 800, y: 300 },
    { key: 'loyalty', label: 'Loyalty', icon: '🎁', values: architecture.loyalty, x: 1000, y: 300 },
  ]

  // Build connections based on selected services
  const connections = [
    // Main horizontal flow - checkout process (always show)
    { from: { x: 160, y: 100 }, to: { x: 240, y: 100 }, label: '1. Browse', color: '#2196f3', step: 1 },
    { from: { x: 360, y: 100 }, to: { x: 440, y: 100 }, label: '2. Search', color: '#2196f3', step: 2 },
    { from: { x: 560, y: 100 }, to: { x: 640, y: 100 }, label: '3. Cart', color: '#4caf50', step: 3 },
    { from: { x: 760, y: 100 }, to: { x: 840, y: 100 }, label: '4. Payment', color: '#f44336', step: 4 },
  ]

  // Add conditional arrows based on selected services
  if (architecture.pim && architecture.pim.length > 0) {
    connections.push({ from: { x: 300, y: 135 }, to: { x: 200, y: 265 }, label: 'Products', color: '#ff9800', step: 0 })
  }
  
  if (architecture.cms && architecture.cms.length > 0) {
    connections.push({ from: { x: 300, y: 135 }, to: { x: 400, y: 265 }, label: 'Content', color: '#ff9800', step: 0 })
  }
  
  if (architecture.search && architecture.search.length > 0) {
    connections.push({ from: { x: 300, y: 135 }, to: { x: 600, y: 265 }, label: 'Search', color: '#9c27b0', step: 0 })
  }
  
  if (architecture.analytics && architecture.analytics.length > 0) {
    connections.push({ from: { x: 500, y: 135 }, to: { x: 800, y: 265 }, label: 'Events', color: '#607d8b', step: 0 })
  }
  
  if (architecture.loyalty && architecture.loyalty.length > 0) {
    connections.push({ from: { x: 500, y: 135 }, to: { x: 1000, y: 265 }, label: 'Loyalty', color: '#e91e63', step: 0 })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      commerce_engine: '#4caf50',
      frontend_framework: '#2196f3', 
      omnichannel: '#2196f3',
      checkout: '#f44336',
      pim: '#ff9800',
      cms: '#ff9800',
      search: '#9c27b0',
      payment_provider: '#f44336',
      analytics: '#607d8b',
      personalization: '#607d8b',
      loyalty: '#e91e63',
      tax: '#f44336',
      inventory: '#795548',
      order_management: '#795548'
    }
    return colors[category as keyof typeof colors] || '#757575'
  }

  return (
    <VStack spacing={6} align="stretch">
      <VStack align="start" spacing={1}>
        <Heading size="md" color="blue.600">
          MACH Architecture Flow Diagram
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Interactive data flow visualization for {architecture.business}
        </Text>
      </VStack>

      {/* SVG Flow Diagram */}
      <Box 
        bg="white"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        overflow="auto"
        h="500px"
        position="relative"
      >
        <svg width="1200" height="400" viewBox="0 0 1200 400" style={{ minWidth: '1200px' }}>
          {/* Connections/Arrows */}
          <defs>
            <marker id="arrowhead-flow" markerWidth="8" markerHeight="6" 
             refX="8" refY="3" orient="auto" fill="#666">
              <polygon points="0 0, 8 3, 0 6" />
            </marker>
          </defs>

          {/* Draw connections */}
          {connections.map((conn, index) => {
            const strokeWidth = conn.step > 0 ? 3 : 2
            const opacity = hoveredComponent ? 0.4 : (conn.step > 0 ? 0.8 : 0.6)

            return (
              <g key={index}>
                <line
                  x1={conn.from.x}
                  y1={conn.from.y}
                  x2={conn.to.x}
                  y2={conn.to.y}
                  stroke={conn.color || "#999"}
                  strokeWidth={strokeWidth}
                  markerEnd="url(#arrowhead-flow)"
                  opacity={opacity}
                  strokeDasharray={conn.step === 0 ? "5,5" : "none"}
                />
                {/* Connection label */}
                <text
                  x={(conn.from.x + conn.to.x) / 2}
                  y={(conn.from.y + conn.to.y) / 2 - 10}
                  textAnchor="middle"
                  fontSize={conn.step > 0 ? "11" : "9"}
                  fontWeight={conn.step > 0 ? "bold" : "normal"}
                  fill={conn.color || "#666"}
                  opacity={hoveredComponent ? 0.3 : 0.8}
                >
                  {conn.label}
                </text>
              </g>
            )
          })}

          {/* Main flow steps */}
          {flowSteps.map(({ key, label, icon, x, y, values }) => (
            <g key={key}>
              <rect
                x={x - 60}
                y={y - 35}
                width="120"
                height="70"
                rx="8"
                fill={key === 'user' ? '#1976d2' : '#4caf50'}
                stroke="#333"
                strokeWidth="2"
                opacity={hoveredComponent && hoveredComponent !== key ? 0.3 : 1}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredComponent(key)}
                onMouseLeave={() => setHoveredComponent(null)}
              />
              
              <text x={x} y={y - 15} textAnchor="middle" fontSize="16">
                {icon}
              </text>
              
              <text x={x} y={y} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
                {label}
              </text>

              {/* Show selected vendor if available */}
              {values && values[0] && (
                <text x={x} y={y + 15} textAnchor="middle" fontSize="9" fill="white" opacity="0.9">
                  {values[0]}
                </text>
              )}
              
              {/* Show count if more than 1 */}
              {values && values.length > 1 && (
                <text x={x} y={y + 28} textAnchor="middle" fontSize="8" fill="white" opacity="0.7">
                  +{values.length - 1} more
                </text>
              )}
            </g>
          ))}

          {/* Supporting services */}
          {supportingServices.filter(service => service.values && service.values.length > 0).map(({ key, label, icon, values, x, y }) => (
            <g key={key}>
              <rect
                x={x - 60}
                y={y - 35}
                width="120"
                height="70"
                rx="8"
                fill={getCategoryColor(key)}
                stroke="#666"
                strokeWidth="2"
                opacity={hoveredComponent && hoveredComponent !== key ? 0.3 : 1}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredComponent(key)}
                onMouseLeave={() => setHoveredComponent(null)}
              />
              
              <text x={x} y={y - 15} textAnchor="middle" fontSize="14">
                {icon}
              </text>
              
              <text x={x} y={y} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                {label}
              </text>

              {/* Show first selected vendor */}
              {values && values[0] && (
                <text x={x} y={y + 15} textAnchor="middle" fontSize="9" fill="white" opacity="0.9">
                  {values[0]}
                </text>
              )}
              
              {/* Show count if more than 1 */}
              {values && values.length > 1 && (
                <text x={x} y={y + 28} textAnchor="middle" fontSize="8" fill="white" opacity="0.7">
                  +{values.length - 1} more
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Hover information */}
        {hoveredComponent && (
          <Box
            position="absolute"
            top="10px"
            right="10px"
            bg="rgba(0,0,0,0.8)"
            color="white"
            p={3}
            borderRadius="md"
            maxW="200px"
          >
            {(() => {
              const service = supportingServices.find(s => s.key === hoveredComponent)
              const flow = flowSteps.find(f => f.key === hoveredComponent)
              
              if (service && service.values) {
                return (
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="sm">
                      {service.icon} {service.label}
                    </Text>
                    {service.values?.map(vendor => (
                      <Text key={vendor} fontSize="xs">
                        • {vendor}
                      </Text>
                    ))}
                    <Text fontSize="xs" color="green.300" mt={1}>
                      💰 View costs in Cost Estimation tab
                    </Text>
                  </VStack>
                )
              }
              
              if (flow && flow.values) {
                return (
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="sm">
                      {flow.icon} {flow.label}
                    </Text>
                    {flow.values?.map(vendor => (
                      <Text key={vendor} fontSize="xs">
                        • {vendor}
                      </Text>
                    ))}
                    <Text fontSize="xs" color="green.300" mt={1}>
                      💰 View costs in Cost Estimation tab
                    </Text>
                  </VStack>
                )
              }
              
              if (flow) {
                return (
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold" fontSize="sm">
                      {flow.icon} {flow.label}
                    </Text>
                    <Text fontSize="xs">
                      Core e-commerce flow step
                    </Text>
                  </VStack>
                )
              }
              
              return null
            })()}
          </Box>
        )}
      </Box>

      {/* Checkout Flow Legend */}
      <Box bg="gray.50" p={4} borderRadius="md" border="1px" borderColor="gray.200">
        <Text fontWeight="bold" mb={3} color="gray.700">E-commerce Checkout Flow:</Text>
        <VStack spacing={2} align="stretch">
          <HStack spacing={4} wrap="wrap">
            <HStack spacing={1}>
              <Box w="15px" h="3px" bg="#2196f3" />
              <Text fontSize="xs"><strong>1-2.</strong> Browse & Search</Text>
            </HStack>
            <HStack spacing={1}>
              <Box w="15px" h="3px" bg="#4caf50" />
              <Text fontSize="xs"><strong>3.</strong> Add to Cart</Text>
            </HStack>
            <HStack spacing={1}>
              <Box w="15px" h="3px" bg="#f44336" />
              <Text fontSize="xs"><strong>4.</strong> Payment & Tax</Text>
            </HStack>
            <HStack spacing={1}>
              <Box w="15px" h="3px" bg="#795548" />
              <Text fontSize="xs"><strong>5.</strong> Order Creation</Text>
            </HStack>
          </HStack>
          <HStack spacing={4} wrap="wrap">
            <HStack spacing={1}>
              <Box w="15px" h="3px" bg="#607d8b" />
              <Text fontSize="xs"><strong>6.</strong> Analytics & Personalization</Text>
            </HStack>
            <HStack spacing={1}>
              <Box w="15px" h="3px" bg="#e91e63" />
              <Text fontSize="xs"><strong>7.</strong> Loyalty Rewards</Text>
            </HStack>
            <HStack spacing={1}>
              <Box w="15px" h="2px" bg="#ff9800" border="1px dashed #ff9800" />
              <Text fontSize="xs">Data Feeds (PIM/CMS)</Text>
            </HStack>
          </HStack>
          <Text fontSize="xs" color="gray.600" fontStyle="italic" mt={2}>
            🛍️ <strong>Checkout Flow:</strong> Shows when payment processing happens and how systems interact during purchase
          </Text>
        </VStack>
      </Box>
    </VStack>
  )
}