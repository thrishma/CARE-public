'use client'

import { useEffect, useRef } from 'react'
import { Box, Button, VStack, Text } from '@chakra-ui/react'
import mermaid from 'mermaid'

export default function TestDiagram() {
  const diagramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    })
  }, [])

  const testData = {
    business: "Hoodie Gang",
    commerce_engine: ["commercetools"],
    pim: ["Akeneo"],
    cms: ["Contentful"],
    payment_provider: ["Stripe"],
    search: ["Algolia"],
    analytics: ["Segment"]
  }

  const generateTestDiagram = () => {
    const diagram = `
graph TD
    User[👤 User]
    Business["🏢 Hoodie Gang"]
    CE["🛒 Commerce Engine<br/>• commercetools"]
    PIM["📦 PIM<br/>• Akeneo"]
    CMS["📝 CMS<br/>• Contentful"]
    PAY["💳 Payment<br/>• Stripe"]
    SEARCH["🔍 Search<br/>• Algolia"]
    ANALYTICS["📊 Analytics<br/>• Segment"]
    
    User --> Business
    User -.-> CE
    Business --> CE
    Business --> PIM
    Business --> CMS
    Business --> PAY
    Business --> SEARCH
    Business --> ANALYTICS
    
    PIM --> CE
    CMS --> CE
    CE --> SEARCH
    CE --> PAY
    CE --> ANALYTICS
    SEARCH --> ANALYTICS
    
    classDef userClass fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    classDef businessClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#000
    classDef coreClass fill:#e8f5e8,stroke:#388e3c,stroke-width:2px,color:#000
    classDef dataClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000
    classDef serviceClass fill:#f1f8ff,stroke:#0366d6,stroke-width:2px,color:#000
    
    class User userClass
    class Business businessClass
    class CE,PAY coreClass
    class PIM,CMS dataClass
    class SEARCH,ANALYTICS serviceClass
    `

    if (diagramRef.current) {
      const diagramId = `test-diagram-${Date.now()}`
      
      mermaid.render(diagramId, diagram)
        .then(({ svg }) => {
          if (diagramRef.current) {
            diagramRef.current.innerHTML = svg
          }
        })
        .catch((error) => {
          console.error('Test diagram error:', error)
          if (diagramRef.current) {
            diagramRef.current.innerHTML = `<p>Error: ${error.message}</p>`
          }
        })
    }
  }

  return (
    <VStack spacing={4} align="stretch">
      <Button onClick={generateTestDiagram} colorScheme="blue">
        Generate Test Diagram
      </Button>
      
      <Text fontSize="sm" color="gray.600">
        Test data: {JSON.stringify(testData, null, 2)}
      </Text>
      
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
  )
}