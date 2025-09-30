"use client"

import type React from "react"

import { useState, useMemo, useRef, useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import type { ProductFilters, MergeStrategy, Product } from "@/lib/types"
import { formatPriceLKR, debounce, getStockStatus, generateSlug } from "@/lib/utils"
import { parseCSV, downloadCSV } from "@/lib/csv"
import { validateProductRow } from "@/lib/schemas/product-schema"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { StockBadge } from "@/components/ui/stock-badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { RatingStars } from "@/components/ui/rating-stars"
import { BulkActions } from "@/components/admin/bulk-actions"
import { ProductFiltersBar } from "@/components/admin/product-filters-bar"
import { CSVImportDialog } from "@/components/admin/csv-import-dialog"
import { useProductStore } from "@/lib/stores/product-store"
import type { ProductFormData } from "@/lib/schemas/product-schema"
import { ProductFormDrawer } from "@/components/admin/product-form-drawer"

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProducts, duplicateProduct, exportCsv, importCsv } =
    useProductStore()

  const [filters, setFilters] = useState<ProductFilters>({})
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [csvImportOpen, setCsvImportOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editingProductData = editingProduct ? products.find((p) => p.id === editingProduct) : null
  
  // Debug log for editing
  useEffect(() => {
    console.log("[v0] Total products in store:", products.length)
    if (editingProduct) {
      console.log("[v0] Editing product ID:", editingProduct)
      console.log("[v0] Found product data:", editingProductData)
    }
  }, [editingProduct, editingProductData, products.length])

  const debouncedSearch = useMemo(
    () =>
      debounce((search: string) => {
        setFilters((prev) => ({ ...prev, search }))
      }, 300),
    [],
  )

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.sku.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }
      if (filters.category && filters.category !== "all" && product.category !== filters.category) {
        return false
      }
      if (filters.status === "active" && !product.isActive) return false
      if (filters.status === "inactive" && product.isActive) return false
      if (filters.stock) {
        const stockStatus = getStockStatus(product.stock)
        if (stockStatus !== filters.stock) return false
      }
      return true
    })

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return a.priceLKR - b.priceLKR
          case "price-desc":
            return b.priceLKR - a.priceLKR
          case "stock-asc":
            return a.stock - b.stock
          case "stock-desc":
            return b.stock - a.stock
          case "newest":
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
      })
    }

    return filtered
  }, [products, filters])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId])
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId))
    }
  }

  const handleCreateProduct = (productData: ProductFormData) => {
    try {
      console.log("[v0] Creating product:", productData)
      addProduct(productData)
      setIsFormOpen(false)
      setEditingProduct(null)
      toast({
        title: "Product created",
        description: `${productData.name} has been created successfully.`,
      })
    } catch (error) {
      console.error("[v0] Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDrawerClose = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) {
      // Clear editing state when drawer closes
      setEditingProduct(null)
    }
  }

  const handleUpdateProduct = (productData: ProductFormData) => {
    if (!editingProduct) {
      toast({
        title: "Error",
        description: "No product selected for editing.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("[v0] Updating product:", editingProduct, productData)
      
      // Find the product to ensure it exists
      const existingProduct = products.find((p) => p.id === editingProduct)
      if (!existingProduct) {
        toast({
          title: "Error",
          description: "Product not found.",
          variant: "destructive",
        })
        return
      }

      updateProduct(editingProduct, productData)
      setEditingProduct(null)
      setIsFormOpen(false)
      toast({
        title: "Product updated",
        description: `${productData.name} has been updated successfully.`,
      })
    } catch (error) {
      console.error("[v0] Error updating product:", error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = (productId: string) => {
    try {
      const product = products.find((p) => p.id === productId)
      deleteProducts([productId])
      setDeleteConfirmId(null)
      toast({
        title: "Product deleted",
        description: `${product?.name} has been deleted.`,
      })
    } catch (error) {
      console.error("[v0] Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateProduct = (productId: string) => {
    try {
      duplicateProduct(productId)
      toast({
        title: "Product duplicated",
        description: "Product has been duplicated successfully.",
      })
    } catch (error) {
      console.error("[v0] Error duplicating product:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkAction = (action: string) => {
    const selectedCount = selectedProducts.length

    try {
      switch (action) {
        case "activate":
          selectedProducts.forEach((id) => updateProduct(id, { isActive: true }))
          toast({
            title: "Products activated",
            description: `${selectedCount} products have been activated.`,
          })
          break
        case "deactivate":
          selectedProducts.forEach((id) => updateProduct(id, { isActive: false }))
          toast({
            title: "Products deactivated",
            description: `${selectedCount} products have been deactivated.`,
          })
          break
        case "delete":
          deleteProducts(selectedProducts)
          toast({
            title: "Products deleted",
            description: `${selectedCount} products have been deleted.`,
          })
          break
      }
      setSelectedProducts([])
    } catch (error) {
      console.error("[v0] Error in bulk action:", error)
      toast({
        title: "Error",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImportCSV = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csvText = e.target?.result as string
      setCsvImportOpen(true)
      ;(window as any).pendingCsvImport = csvText
    }
    reader.readAsText(file)

    event.target.value = ""
  }

  const handleCsvImport = (csvText: string, strategy: MergeStrategy) => {
    try {
      const rows = parseCSV(csvText)
      let imported = 0
      let skipped = 0
      const errors: string[] = []

      const validRows: Product[] = rows
        .map((row, index) => {
          const validation = validateProductRow(row)
          if (!validation.valid) {
            skipped++
            errors.push(`Row ${index + 2}: ${validation.errors.join(", ")}`)
            return null
          }
          imported++
          return {
            id: crypto.randomUUID(),
            name: row.name,
            sku: row.sku,
            slug: generateSlug(row.name),
            category: row.category,
            priceLKR: Number(row.priceLKR) || 0,
            stock: Number(row.stock) || 0,
            isActive: row.isActive === "true" || row.isActive === true,
            description: row.description || "",
            specs: row.specs || {},
            images: Array.isArray(row.images) ? row.images : row.images ? row.images.split("|") : [],
            rating: Number(row.rating) || 4,
            createdAt: new Date().toISOString(),
          } as Product
        })
        .filter((row): row is Product => row !== null)

      importCsv(validRows, strategy)

      if (errors.length > 0) {
        toast({
          title: "Import completed with errors",
          description: `Imported ${imported} products, skipped ${skipped}. Check console for details.`,
          variant: "destructive",
        })
        console.error("CSV Import Errors:", errors)
      } else {
        toast({
          title: "CSV imported successfully",
          description: `Imported ${imported} products successfully.`,
        })
      }

      setCsvImportOpen(false)
    } catch (error) {
      console.error("[v0] Error importing CSV:", error)
      toast({
        title: "Error",
        description: "Failed to import CSV. Please check the format and try again.",
        variant: "destructive",
      })
    }
  }

  const handleExportCSV = () => {
    try {
      const csvContent = exportCsv(filteredProducts)
      const filename = `tools-solutions-products-${new Date().toISOString().split("T")[0]}.csv`
      downloadCSV(csvContent, filename)

      toast({
        title: "CSV exported",
        description: `Exported ${filteredProducts.length} products to ${filename}.`,
      })
    } catch (error) {
      console.error("[v0] Error exporting CSV:", error)
      toast({
        title: "Error",
        description: "Failed to export CSV. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
            {editingProduct && (
              <span className="ml-2 text-blue-600 font-medium">
                • Editing: {editingProductData?.name || 'Loading...'}
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
          <Button variant="outline" onClick={handleImportCSV} aria-label="Import products from CSV file">
            Import CSV
          </Button>
          <Button variant="outline" onClick={handleExportCSV} aria-label="Export products to CSV file">
            Export CSV
          </Button>
          <Button
            onClick={() => {
              setEditingProduct(null)
              setIsFormOpen(true)
            }}
            aria-label="Create new product"
          >
            New Product
          </Button>
        </div>
      </header>

      <section aria-label="Product search">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Input
              placeholder="Search products..."
              onChange={(e) => debouncedSearch(e.target.value)}
              aria-label="Search products by name or SKU"
            />
          </div>
        </div>
      </section>

      <section aria-label="Product filters">
        <ProductFiltersBar filters={filters} onFiltersChange={setFilters} />
      </section>

      {selectedProducts.length > 0 && (
        <section aria-label="Bulk actions">
          <BulkActions selectedCount={selectedProducts.length} onAction={handleBulkAction} />
        </section>
      )}

      <main>
        <Card>
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" role="status">
              <div className="text-center">
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground mt-1">
                  {filters.search || filters.category || filters.status || filters.stock
                    ? "Try adjusting your filters"
                    : "Add your first product to get started"}
                </p>
                {!filters.search && !filters.category && !filters.status && !filters.stock && (
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setEditingProduct(null)
                      setIsFormOpen(true)
                    }}
                    aria-label="Add your first product"
                  >
                    Add Product
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === filteredProducts.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts(filteredProducts.map((p) => p.id))
                        } else {
                          setSelectedProducts([])
                        }
                      }}
                      aria-label="Select all products"
                    />
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts((prev) => [...prev, product.id])
                          } else {
                            setSelectedProducts((prev) => prev.filter((id) => id !== product.id))
                          }
                        }}
                        aria-label={`Select ${product.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <ImagePlaceholder
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="h-12 w-12"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatPriceLKR(product.priceLKR)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{product.stock}</span>
                        <StockBadge stock={product.stock} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge isActive={product.isActive} />
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={product.rating} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("[v0] Opening edit for product:", product.id, product.name)
                            console.log("[v0] Current state - isFormOpen:", isFormOpen, "editingProduct:", editingProduct)
                            setEditingProduct(product.id)
                            setIsFormOpen(true)
                            console.log("[v0] After setState - should be:", { editingProduct: product.id, isFormOpen: true })
                          }}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="text-destructive hover:text-destructive"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </main>

      <CSVImportDialog open={csvImportOpen} onOpenChange={setCsvImportOpen} onImport={handleCsvImport} />

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId) {
                  handleDeleteProduct(deleteConfirmId)
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ProductFormDrawer
        mode={editingProductData ? "edit" : "create"}
        open={isFormOpen}
        onOpenChange={handleDrawerClose}
        initial={editingProductData || undefined}
        onSubmitSuccess={(formData) => {
          if (editingProductData) {
            handleUpdateProduct(formData)
          } else {
            handleCreateProduct(formData)
          }
        }}
      />
    </div>
  )
}
