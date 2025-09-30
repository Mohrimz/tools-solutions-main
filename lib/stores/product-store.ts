import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/types"
import { mockProducts } from "@/lib/mock-data"
import { generateSlug } from "@/lib/utils"

interface ProductStore {
  products: Product[]

  // Actions
  addProduct: (productData: Omit<Product, "id" | "createdAt" | "slug">) => void
  updateProduct: (id: string, patch: Partial<Omit<Product, "id" | "createdAt" | "slug">>) => void
  deleteProducts: (ids: string[]) => void
  duplicateProduct: (id: string) => void
  importCsv: (rows: Product[], strategy: "append" | "replace") => void
  exportCsv: (filtered: Product[]) => string

  // Utilities
  getProduct: (id: string) => Product | undefined
  setProducts: (products: Product[]) => void
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

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,

      addProduct: (productData) => {
        const products = get().products
        const id = crypto.randomUUID()
        const slug = generateUniqueSlug(productData.name, products)
        const createdAt = new Date().toISOString()

        const newProduct: Product = {
          ...productData,
          id,
          slug,
          createdAt,
          rating: productData.rating || 4,
          images: productData.images?.length ? productData.images : ["/placeholder.svg"],
          specs: productData.specs || {},
        }

        set({ products: [newProduct, ...products] })
      },

      updateProduct: (id, patch) => {
        const products = get().products
        const updatedProducts = products.map((product) => {
          if (product.id === id) {
            const updated = { ...product, ...patch }
            // Regenerate slug if name changed
            if (patch.name && patch.name !== product.name) {
              updated.slug = generateUniqueSlug(patch.name, products, id)
            }
            return updated
          }
          return product
        })
        set({ products: updatedProducts })
      },

      deleteProducts: (ids) => {
        const products = get().products
        set({ products: products.filter((p) => !ids.includes(p.id)) })
      },

      duplicateProduct: (id) => {
        const products = get().products
        const original = products.find((p) => p.id === id)
        if (!original) return

        const duplicated: Product = {
          ...original,
          id: crypto.randomUUID(),
          name: `${original.name} (Copy)`,
          sku: `${original.sku}-COPY`,
          slug: generateUniqueSlug(`${original.name} (Copy)`, products),
          createdAt: new Date().toISOString(),
        }

        set({ products: [duplicated, ...products] })
      },

      importCsv: (rows, strategy) => {
        const products = get().products
        const validRows = rows.map((row) => ({
          ...row,
          id: row.id || crypto.randomUUID(),
          slug: row.slug || generateUniqueSlug(row.name, strategy === "replace" ? [] : products),
          createdAt: row.createdAt || new Date().toISOString(),
          rating: row.rating || 4,
          images: row.images || ["/placeholder.svg"],
          specs: row.specs || {},
        }))

        if (strategy === "replace") {
          set({ products: validRows })
        } else {
          set({ products: [...validRows, ...products] })
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

      setProducts: (products) => {
        set({ products })
      },
    }),
    {
      name: "product-store",
      version: 1,
    },
  ),
)
