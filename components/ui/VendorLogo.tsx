import { Image, Box, Text } from '@chakra-ui/react'
import vendorsData from '@/data/vendors.json'

interface VendorLogoProps {
  vendorName: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

export default function VendorLogo({ vendorName, size = 'md', showName = false }: VendorLogoProps) {
  const vendor = vendorsData.find(v => 
    v.name.toLowerCase() === vendorName.toLowerCase() ||
    v.id.toLowerCase() === vendorName.toLowerCase()
  )

  const logoUrl = vendor?.logoUrl || `/logos/${vendorName.toLowerCase().replace(/\s+/g, '-')}.svg`
  
  const sizes = {
    sm: { h: '20px', w: '60px', fontSize: 'xs' },
    md: { h: '30px', w: '90px', fontSize: 'sm' },
    lg: { h: '40px', w: '120px', fontSize: 'md' }
  }

  const { h, w, fontSize } = sizes[size]

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Image
        src={logoUrl}
        alt={vendorName}
        height={h}
        width={w}
        objectFit="contain"
        fallback={
          <Box 
            w={w} 
            h={h} 
            bg="gray.100" 
            borderRadius="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            color="gray.600"
            border="1px"
            borderColor="gray.200"
          >
            {vendorName.slice(0, 3).toUpperCase()}
          </Box>
        }
      />
      {showName && (
        <Text fontSize={fontSize} fontWeight="medium" color="gray.700">
          {vendorName}
        </Text>
      )}
    </Box>
  )
}