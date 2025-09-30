import type { Product, CsvImportResult, MergeStrategy } from "./types"

export function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
  const rows = lines.slice(1)

  return rows.map((row) => {
    // Handle quoted values that may contain commas
    const values: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < row.length; i++) {
      const char = row[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    values.push(current.trim()) // Add the last value

    const obj: any = {}

    headers.forEach((header, index) => {
      const value = values[index] || ""

      // Handle special fields
      if (header === "images" && value) {
        obj[header] = value.split("|").map((img) => img.trim())
      } else if (header === "priceLKR" || header === "stock" || header === "rating") {
        obj[header] = Number.parseFloat(value) || 0
      } else if (header === "isActive") {
        obj[header] = value.toLowerCase() === "true"
      } else if (header === "specs" && value) {
        try {
          obj[header] = JSON.parse(value)
        } catch {
          obj[header] = {}
        }
      } else {
        obj[header] = value.replace(/"/g, "") // Remove quotes
      }
    })

    return obj
  })
}

export function validateProductRow(row: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!row.name?.trim()) errors.push("Name is required")
  if (!row.sku?.trim()) errors.push("SKU is required")
  if (!row.category?.trim()) errors.push("Category is required")

  const validCategories = ["Hammers", "Screwdrivers", "Wrenches", "Saws", "Pliers"]
  if (row.category && !validCategories.includes(row.category)) {
    errors.push(`Category must be one of: ${validCategories.join(", ")}`)
  }

  if (typeof row.priceLKR !== "number" || row.priceLKR < 0) errors.push("Valid price is required")
  if (typeof row.stock !== "number" || row.stock < 0) errors.push("Valid stock is required")

  return { valid: errors.length === 0, errors }
}

export function importProducts(csvText: string, existingProducts: Product[], strategy: MergeStrategy): CsvImportResult {
  const rows = parseCSV(csvText)
  let imported = 0
  let skipped = 0
  const errors: string[] = []

  const validRows = rows.filter((row, index) => {
    const validation = validateProductRow(row)
    if (!validation.valid) {
      skipped++
      errors.push(`Row ${index + 2}: ${validation.errors.join(", ")}`)
      return false
    }
    return true
  })

  imported = validRows.length

  return { imported, skipped, errors }
}

export function exportProductsToCSV(products: Product[]): string {
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
    "specs",
    "createdAt",
  ]

  const csvRows = [
    headers.join(","),
    ...products.map((product) =>
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
        `"${JSON.stringify(product.specs)}"`,
        product.createdAt,
      ].join(","),
    ),
  ]

  return csvRows.join("\n")
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
