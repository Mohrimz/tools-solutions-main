import * as z from "zod"

export const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.enum(["Hammers", "Screwdrivers", "Wrenches", "Saws", "Pliers"], {
    required_error: "Category is required",
  }),
  priceLKR: z.coerce.number().int().min(0, "Price must be 0 or greater"),
  stock: z.coerce.number().int().min(0, "Stock must be 0 or greater"),
  isActive: z.boolean(),
  description: z.string().optional(),
  specs: z.record(z.string().min(1)),
  images: z.array(z.string()),
  rating: z.coerce.number().min(0).max(5),
})

export type ProductFormData = z.infer<typeof FormSchema>

// Validation function for CSV import
export const validateProductRow = (row: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  try {
    FormSchema.parse({
      name: row.name,
      sku: row.sku,
      category: row.category,
      priceLKR: Number(row.priceLKR) || 0,
      stock: Number(row.stock) || 0,
      isActive: row.isActive === "true" || row.isActive === true || true,
      description: row.description || "",
      specs: row.specs || {},
      images: Array.isArray(row.images) ? row.images : row.images ? row.images.split("|") : [],
      rating: Number(row.rating) || 4,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map((e) => `${e.path.join(".")}: ${e.message}`))
    }
  }

  return { valid: errors.length === 0, errors }
}
