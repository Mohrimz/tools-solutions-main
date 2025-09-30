export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  priceLKR: number
  stock: number
  category: "Hammers" | "Screwdrivers" | "Wrenches" | "Saws" | "Pliers"
  isActive: boolean
  rating: number // 1..5
  images: string[] // use local placeholders
  specs: Record<string, string>
  description?: string
  createdAt: string // ISO
}

export type ProductCategory = "Hammers" | "Screwdrivers" | "Wrenches" | "Saws" | "Pliers"

export type StockStatus = "in" | "low" | "out"

export interface ProductFilters {
  category?: string
  status?: "active" | "inactive"
  stock?: StockStatus
  search?: string
  sortBy?: "newest" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc"
  rating?: number
}

export interface AuthState {
  isAuthenticated: boolean
  username?: string
}

export interface CsvImportResult {
  imported: number
  skipped: number
  errors: string[]
}

export type MergeStrategy = "append" | "replace"
