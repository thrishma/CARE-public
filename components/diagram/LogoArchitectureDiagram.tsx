'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, Heading, Text, VStack, HStack, Image, SimpleGrid } from '@chakra-ui/react'
import { ArchitectureOutput } from '@/types/vendor'
import vendorsData from '@/data/vendors.json'

interface LogoArchitectureDiagramProps {
  architecture: ArchitectureOutput
}

interface ComponentNode {
  id: string
  label: string
  category: string
  vendors: string[]
  icon: string
  position: { x: number; y: number }
}

export default function LogoArchitectureDiagram({ architecture }: LogoArchitectureDiagramProps) {
  const [components, setComponents] = useState<ComponentNode[]>([])
  
  useEffect(() => {
    if (architecture) {
      generateComponents(architecture)
    }
  }, [architecture])

  const generateComponents = (arch: ArchitectureOutput) => {
    const componentDefs = [
      { key: 'commerce_engine', label: 'Commerce Engine', icon: '🛒', values: arch.commerce_engine },
      { key: 'pim', label: 'PIM', icon: '📦', values: arch.pim },
      { key: 'cms', label: 'CMS', icon: '📝', values: arch.cms },
      { key: 'search', label: 'Search', icon: '🔍', values: arch.search },
      { key: 'payment_provider', label: 'Payment', icon: '💳', values: arch.payment_provider },
      { key: 'omnichannel', label: 'Omnichannel', icon: '🌐', values: arch.omnichannel },
      { key: 'analytics', label: 'Analytics', icon: '📊', values: arch.analytics },
      { key: 'loyalty', label: 'Loyalty', icon: '🎁', values: arch.loyalty },
      { key: 'personalization', label: 'Personalization', icon: '🎯', values: arch.personalization },
      { key: 'tax', label: 'Tax', icon: '💰', values: arch.tax },
      { key: 'inventory', label: 'Inventory', icon: '📋', values: arch.inventory },
      { key: 'order_management', label: 'Order Management', icon: '📋', values: arch.order_management }
    ]

    const activeComponents: ComponentNode[] = []

    // Add user and business nodes at the top
    activeComponents.push({
      id: 'user',
      label: 'User',
      category: 'user',
      vendors: [],
      icon: '👤',
      position: { x: 400, y: 80 }
    })

    activeComponents.push({
      id: 'business',
      label: arch.business,
      category: 'business',
      vendors: [],
      icon: '🏢',
      position: { x: 400, y: 180 }
    })

    // Add vendor components in a better layout
    const activeVendorComponents = componentDefs.filter(({ values }) => values && values.length > 0)
    const totalComponents = activeVendorComponents.length
    const cols = Math.min(3, totalComponents)
    const rows = Math.ceil(totalComponents / cols)
    
    let index = 0
    activeVendorComponents.forEach(({ key, label, icon, values }) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      
      // Calculate positions to spread components evenly
      const startX = 150
      const startY = 300
      const spacingX = 200
      const spacingY = 120
      
      activeComponents.push({
        id: key,
        label,
        category: key,
        vendors: values || [],
        icon,
        position: { 
          x: startX + (col * spacingX), 
          y: startY + (row * spacingY)
        }
      })
      
      index++
    })

    setComponents(activeComponents)
  }

  const getVendorLogo = (vendorName: string) => {
    const vendor = vendorsData.find(v => 
      v.name.toLowerCase() === vendorName.toLowerCase() ||
      v.id.toLowerCase() === vendorName.toLowerCase()
    )
    return vendor?.logoUrl || `/logos/${vendorName.toLowerCase().replace(/\s+/g, '-')}.svg`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      user: '#e3f2fd',
      business: '#f3e5f5', 
      commerce_engine: '#e8f5e8',
      omnichannel: '#e8f5e8',
      payment_provider: '#e8f5e8',
      order_management: '#e8f5e8',
      pim: '#fff3e0',
      cms: '#fff3e0',
      inventory: '#fff3e0',
      search: '#f1f8ff',
      analytics: '#f1f8ff',
      loyalty: '#f1f8ff',
      personalization: '#f1f8ff',
      tax: '#f1f8ff'
    }
    return colors[category as keyof typeof colors] || '#f5f5f5'
  }

  return (
    <VStack spacing={6} align="stretch">
      <VStack align="start" spacing={1}>
        <Heading size="md" color="blue.600">
          Architecture Diagram with Vendor Logos
        </Heading>
        <Text fontSize="sm" color="gray.600">
          MACH-compliant architecture for {architecture.business}
        </Text>
      </VStack>

      {/* SVG Diagram */}
      <Box 
        bg="white"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        overflow="auto"
        h="500px"
        position="relative"
      >
        <svg width="900" height="700" viewBox="0 0 900 700" style={{ minWidth: '900px', minHeight: '700px' }}>
          {/* Connections */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
             refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
            </marker>
          </defs>
          
          {/* Draw connections */}
          {components.filter(c => c.category !== 'user' && c.category !== 'business').map(component => (
            <g key={`connection-${component.id}`}>
              {/* Connection from business to component */}
              <line
                x1="400" y1="180"
                x2={component.position.x} y2={component.position.y}
                stroke="#ccc"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            </g>
          ))}
          
          {/* User to Business connection */}
          <line
            x1="400" y1="80"
            x2="400" y2="180"
            stroke="#666"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />

          {/* Component nodes */}
          {components.map(component => (
            <g key={component.id}>
              {/* Node background */}
              <rect
                x={component.position.x - 80}
                y={component.position.y - 30}
                width="160"
                height="60"
                rx="10"
                fill={getCategoryColor(component.category)}
                stroke={component.category === 'user' ? '#1976d2' : 
                        component.category === 'business' ? '#7b1fa2' : '#666'}
                strokeWidth="2"
              />
              
              {/* Icon */}
              <text
                x={component.position.x}
                y={component.position.y - 5}
                textAnchor="middle"
                fontSize="20"
              >
                {component.icon}
              </text>
              
              {/* Label */}
              <text
                x={component.position.x}
                y={component.position.y + 20}
                textAnchor="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#333"
              >
                {component.label}
              </text>
            </g>
          ))}
        </svg>
      </Box>

      {/* Vendor Logos Grid */}
      <Box 
        maxH="400px" 
        overflow="auto"
        bg="gray.50" 
        p={4} 
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
      >
        <VStack align="stretch" spacing={4}>
          <Heading size="sm" color="gray.700">
            Selected Vendors
          </Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {components
              .filter(c => c.vendors.length > 0)
              .map(component => (
                <VStack key={component.id} spacing={3} align="stretch">
                  <Text fontSize="sm" fontWeight="bold" color="gray.600" textAlign="center">
                    {component.icon} {component.label}
                  </Text>
                  <VStack spacing={2}>
                    {component.vendors.map(vendor => (
                      <HStack 
                        key={vendor}
                        p={3}
                        bg="white"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                        spacing={3}
                        minW="180px"
                        _hover={{ 
                          boxShadow: 'sm',
                          borderColor: 'blue.300'
                        }}
                      >
                        <Image
                          src={getVendorLogo(vendor)}
                          alt={vendor}
                          maxH="28px"
                          maxW="70px"
                          objectFit="contain"
                          fallback={
                            <Box 
                              w="70px" 
                              h="28px" 
                              bg="gray.100" 
                              borderRadius="sm"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="xs"
                              color="gray.600"
                              fontWeight="medium"
                            >
                              {vendor.slice(0, 8)}
                            </Box>
                          }
                        />
                        <Text fontSize="sm" fontWeight="medium" flex="1">
                          {vendor}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              ))}
          </SimpleGrid>
        </VStack>
      </Box>
    </VStack>
  )
}