import { create } from "zustand"
import type { Product } from "@/lib/types"
import { generateSlug } from "@/lib/utils"

interface ProductStore {
  products: Product[]
  isLoading: boolean

  // Actions
  loadProducts: () => Promise<void>
  addProduct: (productData: Omit<Product, "id" | "createdAt" | "slug">) => Promise<void>
  updateProduct: (id: string, patch: Partial<Omit<Product, "id" | "createdAt" | "slug">>) => Promise<void>
  deleteProducts: (ids: string[]) => Promise<void>
  duplicateProduct: (id: string) => Promise<void>
  importCsv: (rows: Product[], strategy: "append" | "replace") => Promise<void>
  exportCsv: (filtered: Product[]) => string

  // Utilities
  getProduct: (id: string) => Product | undefined
}

const generateUniqueSlug = (name: string, existingProducts: Product[], excludeId?: string): string => {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (existingProducts.some((p) => p.slug === slug && p.id !== excludeId)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// API helper functions
const apiCall = async (action: string, data?: any) => {
  const response = await fetch('/api/products', {
    method: action === 'LOAD_PRODUCTS' ? 'GET' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: action === 'LOAD_PRODUCTS' ? undefined : JSON.stringify({ action, data }),
  })

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`)
  }

  return response.json()
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  isLoading: false,

  loadProducts: async () => {
    set({ isLoading: true })
    try {
      const result = await apiCall('LOAD_PRODUCTS')
      if (result.success) {
        set({ products: result.products })
      }
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      set({ isLoading: false })
    }
  },

  addProduct: async (productData) => {
    const products = get().products
    const slug = generateUniqueSlug(productData.name, products)
    
    try {
      const result = await apiCall('ADD_PRODUCT', {
        ...productData,
        slug
      })
      
      if (result.success) {
        set({ products: [...products, result.product] })
      }
    } catch (error) {
      console.error('Failed to add product:', error)
      throw error
    }
  },

  updateProduct: async (id, patch) => {
    const products = get().products
    const existingProduct = products.find(p => p.id === id)
    
    if (!existingProduct) {
      throw new Error('Product not found')
    }

    // Generate new slug if name is being updated
    let updates: any = { ...patch }
    if (patch.name) {
      updates.slug = generateUniqueSlug(patch.name, products, id)
    }

    try {
      const result = await apiCall('UPDATE_PRODUCT', { id, updates })
      
      if (result.success) {
        set({
          products: products.map(p => p.id === id ? result.product : p)
        })
      }
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  },

  deleteProducts: async (ids) => {
    try {
      const result = await apiCall('DELETE_PRODUCTS', { ids })
      
      if (result.success) {
        const products = get().products
        set({
          products: products.filter(p => !ids.includes(p.id))
        })
      }
    } catch (error) {
      console.error('Failed to delete products:', error)
      throw error
    }
  },

  duplicateProduct: async (id) => {
    const product = get().getProduct(id)
    if (!product) {
      throw new Error('Product not found')
    }

    const duplicateData = {
      ...product,
      name: `${product.name} (Copy)`,
      sku: `${product.sku}-COPY`,
    }
    
    // Remove fields that will be auto-generated
    delete (duplicateData as any).id
    delete (duplicateData as any).createdAt
    delete (duplicateData as any).slug

    await get().addProduct(duplicateData)
  },

  importCsv: async (rows, strategy) => {
    try {
      if (strategy === "replace") {
        const result = await apiCall('SET_PRODUCTS', { products: rows })
        if (result.success) {
          set({ products: result.products })
        }
      } else {
        // Append strategy - add each product individually
        for (const row of rows) {
          const { id, createdAt, slug, ...productData } = row
          await get().addProduct(productData)
        }
      }
    } catch (error) {
      console.error('Failed to import CSV:', error)
      throw error
    }
  },

  exportCsv: (filtered) => {
    const headers = [
      "id",
      "name",
      "slug", 
      "sku",
      "priceLKR",
      "stock",
      "category",
      "isActive",
      "rating",
      "images",
      "description",
    ]

    const csvRows = [
      headers.join(","),
      ...filtered.map((product) =>
        [
          product.id,
          `"${product.name}"`,
          product.slug,
          product.sku,
          product.priceLKR,
          product.stock,
          product.category,
          product.isActive,
          product.rating,
          `"${product.images.join("|")}"`,
          `"${product.description || ""}"`,
        ].join(","),
      ),
    ]

    return csvRows.join("\n")
  },

  getProduct: (id) => {
    return get().products.find((p) => p.id === id)
  },
}))