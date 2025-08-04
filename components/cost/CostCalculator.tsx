'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  Input,
  Select,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Spinner
} from '@chakra-ui/react'
import { FiDollarSign, FiTrendingUp, FiAlertTriangle, FiActivity } from 'react-icons/fi'
import { ArchitectureOutput, BusinessMetrics, ArchitectureCost, Vendor } from '@/types/vendor'
import { calculateArchitectureCost, formatCurrency } from '@/utils/costCalculator'

interface CostCalculatorProps {
  architecture: ArchitectureOutput
}

export default function CostCalculator({ architecture }: CostCalculatorProps) {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics>({
    size: 'smb',
    monthlyOrders: 5000,
    monthlyRevenue: 500000,
    users: 25,
    products: 1000,
    countries: 1
  })
  
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [cost, setCost] = useState<ArchitectureCost | null>(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  // Fetch vendors data
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendors')
        const result = await response.json()
        console.log('API response:', result)
        
        if (result.success && result.data) {
          // Flatten vendors from categories
          const allVendors: Vendor[] = []
          const vendorsByCategory = result.data.machCompliant || result.data.all || result.data
          
          Object.values(vendorsByCategory).forEach((categoryVendors: any) => {
            if (Array.isArray(categoryVendors)) {
              allVendors.push(...categoryVendors)
            }
          })
          
          console.log('All vendors loaded:', allVendors.length)
          setVendors(allVendors)
        } else {
          throw new Error('Invalid API response format')
        }
      } catch (error) {
        console.error('Error fetching vendors:', error)
        toast({
          title: 'Error',
          description: 'Failed to load vendor data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    }
    
    fetchVendors()
  }, [toast])

  // Calculate costs when metrics or architecture changes
  useEffect(() => {
    if (vendors.length > 0) {
      setLoading(true)
      try {
        console.log('Calculating costs with:', { 
          architecture, 
          vendorsCount: vendors.length, 
          businessMetrics,
          vendorSample: vendors.slice(0, 3).map(v => ({ name: v.name, category: v.category, hasPricing: !!v.pricing }))
        })
        
        const calculatedCost = calculateArchitectureCost(architecture, vendors, businessMetrics)
        console.log('Calculated cost:', calculatedCost)
        setCost(calculatedCost)
      } catch (error) {
        console.error('Error calculating costs:', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        toast({
          title: 'Error',
          description: `Failed to calculate costs: ${errorMessage}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        // Set a default cost structure to show something
        setCost({
          totalMonthly: 0,
          totalAnnual: 0,
          setupTotal: 0,
          costByCategory: {},
          savings: { monthlyVsAnnual: 0, percentageDiscount: 0 },
          warnings: ['Error calculating costs - showing defaults', errorMessage]
        })
      } finally {
        setLoading(false)
      }
    } else {
      console.log('No vendors loaded yet, vendors.length:', vendors.length)
    }
  }, [vendors, architecture, businessMetrics, toast])

  const handleMetricsChange = (field: keyof BusinessMetrics, value: string | number) => {
    const newValue = typeof value === 'string' ? (isNaN(Number(value)) ? value : Number(value)) : value
    console.log('Metrics changing:', field, 'from', businessMetrics[field], 'to', newValue)
    
    setBusinessMetrics(prev => {
      const updated = {
        ...prev,
        [field]: newValue
      }
      console.log('Updated businessMetrics:', updated)
      return updated
    })
  }

  if (!cost && loading) {
    return (
      <Box p={6} textAlign="center">
        <VStack spacing={4}>
          <Text>Loading cost calculation...</Text>
          <Text fontSize="sm" color="gray.600">
            Fetching vendor data and calculating costs...
          </Text>
        </VStack>
      </Box>
    )
  }

  if (!cost) {
    return (
      <Box p={6} textAlign="center">
        <VStack spacing={4}>
          <Text>No cost data available</Text>
          <Text fontSize="sm" color="gray.600">
            Please ensure vendors have pricing information
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={0}>
          <Heading size="md" color="blue.600">
            <HStack spacing={2}>
              <FiActivity />
              <Text>Cost Estimation</Text>
              {loading && <Spinner size="sm" color="blue.500" />}
            </HStack>
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Estimated costs for your MACH architecture
          </Text>
        </VStack>
      </HStack>

      {/* Business Metrics Input */}
      <Box bg="gray.50" p={4} borderRadius="md">
        <Heading size="sm" mb={3}>Business Metrics</Heading>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          <FormControl>
            <FormLabel fontSize="xs">Business Size</FormLabel>
            <Select 
              size="sm" 
              value={businessMetrics.size}
              onChange={(e) => handleMetricsChange('size', e.target.value)}
            >
              <option value="startup">Startup</option>
              <option value="smb">SMB</option>
              <option value="enterprise">Enterprise</option>
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize="xs">Monthly Orders</FormLabel>
            <Input 
              size="sm" 
              type="number" 
              value={businessMetrics.monthlyOrders}
              onChange={(e) => handleMetricsChange('monthlyOrders', e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize="xs">Monthly Revenue ($)</FormLabel>
            <Input 
              size="sm" 
              type="number" 
              value={businessMetrics.monthlyRevenue}
              onChange={(e) => handleMetricsChange('monthlyRevenue', e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize="xs">Team Size</FormLabel>
            <Input 
              size="sm" 
              type="number" 
              value={businessMetrics.users}
              onChange={(e) => handleMetricsChange('users', e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize="xs">Products</FormLabel>
            <Input 
              size="sm" 
              type="number" 
              value={businessMetrics.products}
              onChange={(e) => handleMetricsChange('products', e.target.value)}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel fontSize="xs">Countries</FormLabel>
            <Input 
              size="sm" 
              type="number" 
              value={businessMetrics.countries}
              onChange={(e) => handleMetricsChange('countries', e.target.value)}
            />
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Cost Summary */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <Stat bg="white" p={4} borderRadius="md" border="1px" borderColor="gray.200">
          <StatLabel>
            <HStack spacing={1}>
              <FiDollarSign />
              <Text>Monthly Total</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="blue.600">{formatCurrency(cost.totalMonthly)}</StatNumber>
          <StatHelpText>Recurring monthly costs</StatHelpText>
        </Stat>
        
        <Stat bg="white" p={4} borderRadius="md" border="1px" borderColor="gray.200">
          <StatLabel>
            <HStack spacing={1}>
              <FiTrendingUp />
              <Text>Annual Total</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="green.600">{formatCurrency(cost.totalAnnual)}</StatNumber>
          <StatHelpText>
            Save {formatCurrency(cost.savings.monthlyVsAnnual)} 
            ({cost.savings.percentageDiscount.toFixed(1)}%)
          </StatHelpText>
        </Stat>
        
        <Stat bg="white" p={4} borderRadius="md" border="1px" borderColor="gray.200">
          <StatLabel>Setup Costs</StatLabel>
          <StatNumber color="orange.600">{formatCurrency(cost.setupTotal)}</StatNumber>
          <StatHelpText>One-time implementation</StatHelpText>
        </Stat>
        
        <Stat bg="white" p={4} borderRadius="md" border="1px" borderColor="gray.200">
          <StatLabel>First Year Total</StatLabel>
          <StatNumber color="purple.600">
            {formatCurrency(cost.totalAnnual + cost.setupTotal)}
          </StatNumber>
          <StatHelpText>Including setup costs</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Warnings */}
      {cost.warnings.length > 0 && (
        <VStack spacing={2} align="stretch">
          {cost.warnings.map((warning, index) => (
            <Alert key={index} status="warning" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">{warning}</Text>
            </Alert>
          ))}
        </VStack>
      )}

      {/* Discount Highlights */}
      <Box bg="green.50" p={4} borderRadius="md" border="1px" borderColor="green.200">
        <Heading size="sm" mb={3} color="green.700">
          💰 Available Discounts & Savings Opportunities
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {Object.entries(cost.costByCategory).map(([category, estimates]) => {
            const categoryDiscounts = estimates.flatMap(est => est.tier.discounts || [])
            if (categoryDiscounts.length === 0) return null

            return (
              <Box key={category} bg="white" p={3} borderRadius="md" border="1px" borderColor="green.200">
                <Text fontWeight="bold" fontSize="sm" color="green.700" mb={2} textTransform="capitalize">
                  {category.replace('_', ' ')}
                </Text>
                {estimates.map((estimate, idx) => {
                  if (!estimate.tier.discounts) return null
                  return (
                    <VStack key={idx} align="start" spacing={1} mb={2}>
                      <Text fontSize="xs" fontWeight="medium">{estimate.vendor}</Text>
                      {estimate.tier.discounts.map((discount, dIdx) => (
                        <HStack key={dIdx} spacing={2}>
                          <Badge colorScheme="green" size="sm">
                            {discount.type === 'percentage' ? `${discount.value}% OFF` :
                             discount.type === 'fixed' ? `$${discount.value.toLocaleString()} OFF` :
                             `${discount.value} FREE MONTHS`}
                          </Badge>
                          <Text fontSize="xs" color="green.600">
                            {discount.description}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  )
                })}
              </Box>
            )
          })}
        </SimpleGrid>
        
        {Object.values(cost.costByCategory).every(estimates => 
          estimates.every(est => !est.tier.discounts || est.tier.discounts.length === 0)
        ) && (
          <Text fontSize="sm" color="gray.600" textAlign="center" fontStyle="italic">
            No special discounts available for the selected vendors at this time.
          </Text>
        )}
      </Box>

      {/* Cost Breakdown by Category */}
      <Box bg="white" p={4} borderRadius="md" border="1px" borderColor="gray.200">
        <Heading size="sm" mb={4}>Cost Breakdown by Category</Heading>
        <Accordion allowMultiple>
          {Object.entries(cost.costByCategory).map(([category, estimates]) => {
            const categoryTotal = estimates.reduce((sum, est) => sum + est.monthlyTotal, 0)
            
            return (
              <AccordionItem key={category}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack justify="space-between">
                      <Text fontWeight="medium" textTransform="capitalize">
                        {category.replace('_', ' ')}
                      </Text>
                      <Badge colorScheme="blue">
                        {formatCurrency(categoryTotal)}/month
                      </Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={3} align="stretch">
                    {estimates.map((estimate, index) => (
                      <Box key={index} p={3} bg="gray.50" borderRadius="md">
                        <HStack justify="space-between" mb={2}>
                          <Text fontWeight="bold">{estimate.vendor}</Text>
                          <Badge colorScheme="green">{estimate.tier.name}</Badge>
                        </HStack>
                        
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={2}>
                          <Box>
                            <Text fontSize="xs" color="gray.600">Monthly</Text>
                            <Text fontWeight="medium">{formatCurrency(estimate.monthlyTotal)}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.600">Annual</Text>
                            <Text fontWeight="medium">{formatCurrency(estimate.annualTotal)}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.600">Setup</Text>
                            <Text fontWeight="medium">{formatCurrency(estimate.setupCost)}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="xs" color="gray.600">Tier</Text>
                            <Text fontSize="sm">{estimate.tier.description}</Text>
                          </Box>
                        </SimpleGrid>
                        
                        {/* Available Discounts */}
                        {estimate.tier.discounts && estimate.tier.discounts.length > 0 && (
                          <Box>
                            <Text fontSize="xs" color="green.600" mb={1} fontWeight="bold">💰 Available Discounts:</Text>
                            {estimate.tier.discounts.map((discount, discountIndex) => (
                              <Box key={discountIndex} p={2} bg="green.50" borderRadius="md" mb={1}>
                                <HStack justify="space-between" align="start">
                                  <VStack align="start" spacing={0} flex={1}>
                                    <Text fontSize="xs" fontWeight="bold" color="green.700">
                                      {discount.description}
                                    </Text>
                                    {discount.conditions && (
                                      <Text fontSize="xs" color="green.600">
                                        Conditions: {discount.conditions.join(', ')}
                                      </Text>
                                    )}
                                    {discount.minCommitment && (
                                      <Text fontSize="xs" color="green.600">
                                        Min. commitment: {discount.minCommitment}
                                      </Text>
                                    )}
                                    {discount.expiresAt && (
                                      <Text fontSize="xs" color="orange.600">
                                        Expires: {discount.expiresAt}
                                      </Text>
                                    )}
                                  </VStack>
                                  <Badge colorScheme="green" size="sm">
                                    {discount.type === 'percentage' ? `${discount.value}% OFF` :
                                     discount.type === 'fixed' ? `$${discount.value.toLocaleString()} OFF` :
                                     `${discount.value} FREE MONTHS`}
                                  </Badge>
                                </HStack>
                              </Box>
                            ))}
                          </Box>
                        )}

                        {estimate.notes && estimate.notes.length > 0 && (
                          <Box>
                            <Text fontSize="xs" color="gray.600" mb={1}>Notes:</Text>
                            {estimate.notes.map((note, noteIndex) => (
                              <Text key={noteIndex} fontSize="xs" color="gray.500">
                                • {note}
                              </Text>
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            )
          })}
        </Accordion>
      </Box>
    </VStack>
  )
}