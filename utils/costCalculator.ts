import { Vendor, BusinessMetrics, CostEstimate, ArchitectureCost, PricingTier, ArchitectureOutput } from '@/types/vendor'

export function selectBestTier(vendor: Vendor, businessMetrics: BusinessMetrics): PricingTier {
  // Default to first tier if no tiers available
  if (!vendor.pricing || vendor.pricing.length === 0) {
    return {
      name: "Contact Sales",
      description: "Pricing available on request",
      monthlyPrice: 0,
      annualPrice: 0,
      features: ["Contact vendor for pricing"]
    }
  }

  console.log(`Selecting tier for ${vendor.name}:`, {
    businessSize: businessMetrics.size,
    monthlyOrders: businessMetrics.monthlyOrders,
    users: businessMetrics.users,
    availableTiers: vendor.pricing.map(t => ({ name: t.name, limits: t.limits }))
  })

  // Sort tiers by price (cheapest first) to try them in order
  const sortedTiers = [...vendor.pricing].sort((a, b) => (a.monthlyPrice || 0) - (b.monthlyPrice || 0))

  // Find the most appropriate tier based on business size and metrics
  for (const tier of sortedTiers) {
    const tierName = tier.name.toLowerCase()
    
    // Check limits first - if metrics exceed tier limits, skip this tier
    if (tier.limits) {
      const exceedsOrderLimit = tier.limits.orders && tier.limits.orders !== -1 && businessMetrics.monthlyOrders > tier.limits.orders
      const exceedsUserLimit = tier.limits.users && tier.limits.users !== -1 && businessMetrics.users > tier.limits.users
      
      if (exceedsOrderLimit || exceedsUserLimit) {
        console.log(`Skipping ${tier.name} - exceeds limits:`, { exceedsOrderLimit, exceedsUserLimit })
        continue
      }
    }
    
    // Check if this tier matches business size preference
    if (businessMetrics.size === 'startup' && (tierName.includes('startup') || tierName.includes('smb') || tierName.includes('small'))) {
      console.log(`✅ Selected ${tier.name} for startup (matched by name)`)
      return tier
    }
    
    if (businessMetrics.size === 'smb' && (tierName.includes('smb') || tierName.includes('growth') || tierName.includes('medium'))) {
      console.log(`✅ Selected ${tier.name} for SMB (matched by name)`)
      return tier
    }
    
    if (businessMetrics.size === 'enterprise' && (tierName.includes('enterprise') || tierName.includes('large'))) {
      console.log(`✅ Selected ${tier.name} for enterprise (matched by name)`)
      return tier
    }
  }
  
  // If no tier matches business size, select the tier that can handle the metrics
  for (const tier of sortedTiers) {
    if (tier.limits) {
      const canHandleOrders = !tier.limits.orders || tier.limits.orders === -1 || businessMetrics.monthlyOrders <= tier.limits.orders
      const canHandleUsers = !tier.limits.users || tier.limits.users === -1 || businessMetrics.users <= tier.limits.users
      
      if (canHandleOrders && canHandleUsers) {
        console.log(`✅ Selected ${tier.name} based on capacity (orders: ${businessMetrics.monthlyOrders} <= ${tier.limits.orders}, users: ${businessMetrics.users} <= ${tier.limits.users})`)
        return tier
      }
    } else {
      // If no limits, this tier can handle anything - good fallback
      console.log(`✅ Selected ${tier.name} (no limits defined)`)
      return tier
    }
  }
  
  // Fallback based on business metrics volume
  if (businessMetrics.monthlyOrders <= 1000 || businessMetrics.monthlyRevenue <= 100000) {
    console.log(`✅ Selected ${sortedTiers[0].name} based on small business metrics`)
    return sortedTiers[0] // Cheapest tier for small business
  } else if (businessMetrics.monthlyOrders >= 50000 || businessMetrics.monthlyRevenue >= 5000000) {
    console.log(`✅ Selected ${sortedTiers[sortedTiers.length - 1].name} based on large business metrics`)
    return sortedTiers[sortedTiers.length - 1] // Most expensive tier for large business
  }
  
  // Default to middle tier or most expensive
  const defaultTier = sortedTiers[Math.floor(sortedTiers.length / 2)] || sortedTiers[sortedTiers.length - 1]
  console.log(`✅ Defaulted to ${defaultTier.name} (middle/most expensive tier)`)
  return defaultTier
}

export function calculateVendorCost(vendor: Vendor, businessMetrics: BusinessMetrics): CostEstimate {
  const tier = selectBestTier(vendor, businessMetrics)
  const notes: string[] = []
  
  console.log(`Calculating cost for ${vendor.name}:`, {
    selectedTier: tier.name,
    basePricing: { monthly: tier.monthlyPrice, annual: tier.annualPrice },
    businessMetrics: { orders: businessMetrics.monthlyOrders, revenue: businessMetrics.monthlyRevenue }
  })
  
  // Calculate base costs
  let monthlyTotal = tier.monthlyPrice || 0
  let annualTotal = tier.annualPrice || (monthlyTotal * 12)
  const setupCost = tier.setup || 0
  
  // Add transaction fees for payment and commerce vendors
  if (tier.transactionFee && (vendor.category === 'payment_provider' || vendor.category === 'commerce_engine')) {
    const monthlyTransactionCost = businessMetrics.monthlyOrders * tier.transactionFee
    monthlyTotal += monthlyTransactionCost
    annualTotal += monthlyTransactionCost * 12
    notes.push(`Includes $${tier.transactionFee} per transaction (${businessMetrics.monthlyOrders} orders/month)`)
    console.log(`Added transaction fees: $${monthlyTransactionCost}/month for ${businessMetrics.monthlyOrders} orders`)
  }
  
  // Add usage-based pricing considerations
  if (vendor.pricingModel === 'usage') {
    notes.push('Pricing may vary based on actual usage')
  }
  
  if (vendor.pricingModel === 'revenue_share') {
    const revenueShare = businessMetrics.monthlyRevenue * 0.02 // Assume 2% revenue share
    monthlyTotal += revenueShare
    annualTotal += revenueShare * 12
    notes.push('Includes estimated 2% revenue share')
  }
  
  return {
    vendor: vendor.name,
    category: vendor.category,
    tier,
    monthlyTotal,
    annualTotal,
    setupCost,
    notes
  }
}

export function calculateArchitectureCost(
  architecture: ArchitectureOutput,
  vendors: Vendor[],
  businessMetrics: BusinessMetrics
): ArchitectureCost {
  const costByCategory: { [category: string]: CostEstimate[] } = {}
  let totalMonthly = 0
  let totalAnnual = 0
  let setupTotal = 0
  const warnings: string[] = []
  
  console.log('=== COST CALCULATION START ===')
  console.log('Architecture:', architecture)
  console.log('Business Metrics:', businessMetrics)
  
  // Get all selected vendors from architecture
  const selectedVendorNames = new Set<string>()
  Object.entries(architecture).forEach(([category, vendorList]) => {
    if (Array.isArray(vendorList)) {
      vendorList.forEach(vendorName => {
        selectedVendorNames.add(vendorName)
        console.log(`Found selected vendor: ${vendorName} in category: ${category}`)
      })
    }
  })
  
  console.log('Selected vendor names:', Array.from(selectedVendorNames))
  
  // Calculate costs for each selected vendor
  selectedVendorNames.forEach(vendorName => {
    const vendor = vendors.find(v => v.name === vendorName)
    if (vendor) {
      console.log(`\n--- Processing vendor: ${vendor.name} ---`)
      const cost = calculateVendorCost(vendor, businessMetrics)
      console.log(`Cost result:`, cost)
      
      if (!costByCategory[vendor.category]) {
        costByCategory[vendor.category] = []
      }
      costByCategory[vendor.category].push(cost)
      
      totalMonthly += cost.monthlyTotal
      totalAnnual += cost.annualTotal
      setupTotal += cost.setupCost
      
      console.log(`Running totals - Monthly: $${totalMonthly}, Annual: $${totalAnnual}, Setup: $${setupTotal}`)
    } else {
      console.log(`❌ Vendor not found: ${vendorName}`)
    }
  })
  
  // Calculate savings
  const potentialAnnualFromMonthly = totalMonthly * 12
  const monthlyVsAnnual = potentialAnnualFromMonthly - totalAnnual
  const percentageDiscount = potentialAnnualFromMonthly > 0 ? (monthlyVsAnnual / potentialAnnualFromMonthly) * 100 : 0
  
  // Add warnings
  if (totalMonthly > 10000) {
    warnings.push('High monthly costs detected. Consider phased implementation.')
  }
  
  if (setupTotal > 50000) {
    warnings.push('Significant setup costs. Factor into initial budget planning.')
  }
  
  if (businessMetrics.size === 'startup' && totalMonthly > 5000) {
    warnings.push('Costs may be high for startup budget. Consider starting with fewer vendors.')
  }
  
  return {
    totalMonthly,
    totalAnnual,
    setupTotal,
    costByCategory,
    savings: {
      monthlyVsAnnual,
      percentageDiscount
    },
    warnings
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getBusinessSizeFromMetrics(metrics: BusinessMetrics): 'startup' | 'smb' | 'enterprise' {
  if (metrics.monthlyRevenue < 100000 || metrics.monthlyOrders < 1000) {
    return 'startup'
  } else if (metrics.monthlyRevenue < 1000000 || metrics.monthlyOrders < 10000) {
    return 'smb'
  } else {
    return 'enterprise'
  }
}