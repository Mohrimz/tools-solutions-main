import { NextRequest, NextResponse } from 'next/server'
import type { Product } from '@/lib/types'

// In a real app, this would be a database
// For now, we'll use a server-side array that persists during the session
let serverProducts: Product[] = []

// Initialize with mock data if empty
import { mockProducts } from '@/lib/mock-data'
if (serverProducts.length === 0) {
  serverProducts = [...mockProducts]
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      products: serverProducts
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data } = await request.json()

    switch (action) {
      case 'ADD_PRODUCT':
        const newProduct: Product = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        }
        serverProducts.push(newProduct)
        
        return NextResponse.json({
          success: true,
          product: newProduct
        })

      case 'UPDATE_PRODUCT':
        const { id, updates } = data
        const productIndex = serverProducts.findIndex(p => p.id === id)
        
        if (productIndex === -1) {
          return NextResponse.json(
            { success: false, message: 'Product not found' },
            { status: 404 }
          )
        }
        
        serverProducts[productIndex] = {
          ...serverProducts[productIndex],
          ...updates
        }
        
        return NextResponse.json({
          success: true,
          product: serverProducts[productIndex]
        })

      case 'DELETE_PRODUCTS':
        const { ids } = data
        serverProducts = serverProducts.filter(p => !ids.includes(p.id))
        
        return NextResponse.json({
          success: true,
          deletedIds: ids
        })

      case 'SET_PRODUCTS':
        serverProducts = data.products
        
        return NextResponse.json({
          success: true,
          products: serverProducts
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error handling products request:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    )
  }
}