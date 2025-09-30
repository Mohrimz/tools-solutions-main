import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { StockStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceLKR(priceLKR: number): string {
  return `Rs ${priceLKR.toLocaleString()}`
}

export const formatPrice = formatPriceLKR

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return "out"
  if (stock <= 9) return "low" // Changed threshold to 1-9 as per spec
  return "in"
}

export function getStockBadgeVariant(status: StockStatus) {
  switch (status) {
    case "in":
      return "default"
    case "low":
      return "secondary"
    case "out":
      return "destructive"
  }
}

export function getStockLabel(status: StockStatus): string {
  switch (status) {
    case "in":
      return "In Stock"
    case "low":
      return "Low Stock"
    case "out":
      return "Out of Stock"
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait = 300): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function updateSearchParams(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams(window.location.search)

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    } else {
      searchParams.delete(key)
    }
  })

  return searchParams.toString()
}

export function getSearchParam(key: string): string | null {
  if (typeof window === "undefined") return null
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(key)
}

export function openWhatsAppForProduct(productName: string, price: number): void {
  const message = `Hi! I'm interested in purchasing the ${productName}. Price: ${formatPriceLKR(price)}. Could you please provide more details about availability and delivery?`
  const whatsappNumber = "+94752441325"
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank')
}
