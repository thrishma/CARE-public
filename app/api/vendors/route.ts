import { NextResponse } from 'next/server'
import { Vendor, VendorsByCategory } from '@/types/vendor'
import vendorsData from '@/data/vendors.json'

export async function GET() {
  try {
    const vendors = vendorsData as Vendor[]
    
    // Group vendors by category
    const vendorsByCategory: VendorsByCategory = vendors.reduce((acc, vendor) => {
      if (!acc[vendor.category]) {
        acc[vendor.category] = []
      }
      acc[vendor.category].push(vendor)
      return acc
    }, {} as VendorsByCategory)

    // Filter only MACH-compliant vendors
    const machVendorsByCategory: VendorsByCategory = {}
    Object.keys(vendorsByCategory).forEach(category => {
      machVendorsByCategory[category] = vendorsByCategory[category].filter(
        vendor => vendor.machCompliant
      )
    })

    return NextResponse.json({
      success: true,
      data: {
        all: vendorsByCategory,
        machCompliant: machVendorsByCategory,
        categories: Object.keys(vendorsByCategory),
        totalVendors: vendors.length,
        machCompliantCount: vendors.filter(v => v.machCompliant).length
      }
    })
  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vendors' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { category, machOnly = true } = await request.json()
    const vendors = vendorsData as Vendor[]
    
    let filteredVendors = vendors
    
    if (category) {
      filteredVendors = filteredVendors.filter(vendor => vendor.category === category)
    }
    
    if (machOnly) {
      filteredVendors = filteredVendors.filter(vendor => vendor.machCompliant)
    }
    
    return NextResponse.json({
      success: true,
      data: filteredVendors,
      count: filteredVendors.length
    })
  } catch (error) {
    console.error('Error filtering vendors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to filter vendors' },
      { status: 500 }
    )
  }
}