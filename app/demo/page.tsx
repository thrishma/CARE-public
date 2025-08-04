import { Box, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import VendorLogo from '@/components/ui/VendorLogo'

const vendors = [
  'commercetools', 'Elastic Path', 'VTEX', 'Akeneo', 'Salsify',
  'Contentstack', 'Contentful', 'Storyblok', 'Algolia', 'Elasticsearch',
  'Talon.One', 'Segment', 'Amplitude', 'Dynamic Yield', 'Adyen',
  'Stripe', 'NewStore', 'Tulip Retail', 'Avalara', 'SAP', 'NetSuite'
]

export default function DemoPage() {
  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading>Vendor Logos Demo</Heading>
        
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {vendors.map(vendor => (
            <Box 
              key={vendor}
              p={4}
              bg="white"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
              textAlign="center"
            >
              <VendorLogo vendorName={vendor} size="lg" showName />
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  )
}