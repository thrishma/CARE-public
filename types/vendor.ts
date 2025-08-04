export interface Discount {
  type: 'percentage' | 'fixed' | 'free_months'
  value: number // percentage (e.g., 20), fixed amount, or number of free months
  description: string
  conditions?: string[] // e.g., ["Annual payment", "New customers only"]
  expiresAt?: string // Date when discount expires
  minCommitment?: string // e.g., "12 months", "24 months"
}

export interface PricingTier {
  name: string // "Startup", "SMB", "Enterprise"
  description: string
  monthlyPrice: number // USD per month
  annualPrice: number // USD per year (often discounted)
  setup?: number // One-time setup fee
  transactionFee?: number // Per transaction fee (for payment/commerce)
  features: string[]
  discounts?: Discount[] // Available discounts for this tier
  limits?: {
    orders?: number
    users?: number
    bandwidth?: string
    storage?: string
  }
}

export interface Vendor {
  id: string
  name: string
  category: string
  description: string
  machCompliant: boolean
  offerings: string[]
  pros: string[]
  cons: string[]
  integrationNotes: string
  logoUrl?: string
  website?: string
  pricing: PricingTier[]
  pricingModel: 'fixed' | 'usage' | 'revenue_share' | 'hybrid'
  pricingNotes?: string
}

export type VendorCategory = 
  | 'commerce_engine'
  | 'pim'
  | 'cms'
  | 'search'
  | 'loyalty'
  | 'analytics'
  | 'personalization'
  | 'checkout'
  | 'omnichannel'
  | 'erp'
  | 'payment'
  | 'tax'
  | 'inventory'
  | 'order_management'
  | 'frontend_framework'

export interface VendorsByCategory {
  [key: string]: Vendor[]
}

export interface ArchitectureOutput {
  business: string
  commerce_engine?: string[]
  pim?: string[]
  cms?: string[]
  omnichannel?: string[]
  payment_provider?: string[]
  tax?: string[]
  search?: string[]
  loyalty?: string[]
  analytics?: string[]
  personalization?: string[]
  checkout?: string[]
  erp?: string[]
  inventory?: string[]
  order_management?: string[]
  frontend_framework?: string[]
}

export interface BusinessMetrics {
  size: 'startup' | 'smb' | 'enterprise'
  monthlyOrders: number
  monthlyRevenue: number
  users: number
  products: number
  countries: number
}

export interface CostEstimate {
  vendor: string
  category: string
  tier: PricingTier
  monthlyTotal: number
  annualTotal: number
  setupCost: number
  notes?: string[]
}

export interface ArchitectureCost {
  totalMonthly: number
  totalAnnual: number
  setupTotal: number
  costByCategory: { [category: string]: CostEstimate[] }
  savings: {
    monthlyVsAnnual: number
    percentageDiscount: number
  }
  warnings: string[]
}