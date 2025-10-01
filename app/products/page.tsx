"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { toast } from "@/hooks/use-toast"
import type { Product, ProductFilters } from "@/lib/types"
import { debounce, updateSearchParams, getStockStatus } from "@/lib/utils"
import { ProductGrid } from "@/components/store/product-grid"
import { ProductCard } from "@/components/store/product-card"
import { ProductQuickView } from "@/components/store/product-quick-view"
import { ProductFiltersComponent } from "@/components/store/product-filters"
import { useMobile } from "@/hooks/use-mobile"
import { useWishlist } from "@/hooks/use-wishlist"
import { useProductStore } from "@/lib/stores/product-store"

export default function ProductsPage() {
  const { products: allProducts } = useProductStore()
  const { wishlist, isLoaded: wishlistLoaded, toggleWishlist, isInWishlist } = useWishlist()
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useMobile()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<ProductFilters>(() => {
    return {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined,
      sortBy: (searchParams.get("sortBy") as ProductFilters["sortBy"]) || "newest",
      stock: (searchParams.get("stock") as ProductFilters["stock"]) || undefined,
    }
  })

  // Update filters when URL changes (for direct navigation)
  useEffect(() => {
    const newFilters: ProductFilters = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "all",
      rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined,
      sortBy: (searchParams.get("sortBy") as ProductFilters["sortBy"]) || "newest",
      stock: (searchParams.get("stock") as ProductFilters["stock"]) || undefined,
    }
    setFilters(newFilters)
  }, [searchParams])

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: ProductFilters) => {
      const params = updateSearchParams({
        search: newFilters.search || undefined,
        category: newFilters.category === "all" ? undefined : newFilters.category,
        rating: newFilters.rating?.toString(),
        sortBy: newFilters.sortBy === "newest" ? undefined : newFilters.sortBy,
        stock: newFilters.stock,
      })
      router.replace(`/products?${params}`, { scroll: false })
    },
    [router],
  )

  const debouncedSearch = useMemo(
    () =>
      debounce((search: string) => {
        setFilters((prevFilters) => {
          const newFilters = { ...prevFilters, search }
          updateURL(newFilters)
          return newFilters
        })
      }, 300),
    [updateURL],
  )

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: ProductFilters) => {
      setFilters(newFilters)
      updateURL(newFilters)
    },
    [updateURL],
  )

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    // First filter for active products only
    const activeProducts = allProducts.filter((p) => p.isActive)
    
    const filtered = activeProducts.filter((product) => {
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.category.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.sku.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }
      if (filters.category && filters.category !== "all" && product.category !== filters.category) {
        return false
      }
      if (filters.rating && product.rating < filters.rating) {
        return false
      }
      if (filters.stock) {
        const stockStatus = getStockStatus(product.stock)
        // Map admin-style values to store values
        const stockMapping = {
          "in-stock": "in",
          "low-stock": "low", 
          "out-of-stock": "out"
        }
        if (stockMapping[filters.stock as keyof typeof stockMapping] !== stockStatus) return false
      }
      return true
    })

    // Sort products
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
  }, [allProducts, filters])

  const handleAddToWishlist = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId)
    const wasInWishlist = isInWishlist(productId)

    toggleWishlist(productId)

    toast({
      title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: `${product?.name} has been ${wasInWishlist ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product)
  }

  const handleProductClick = (product: Product) => {
    // Show quick view modal instead of navigating
    setQuickViewProduct(product)
  }

  const QuickViewComponent = isMobile ? Drawer : Sheet

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-balance">Tools Solutions Catalog</h1>
        <p className="text-lg text-muted-foreground text-pretty">Professional quality tools for every project</p>
      </header>

      {/* Search and Filters */}
      <section aria-label="Product search and filters">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Search tools..."
              className="pl-10"
              defaultValue={filters.search}
              onChange={(e) => debouncedSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>

          <div className="flex items-center gap-2">
            <ProductFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </section>

      {/* Results Count and Active Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          {filters.search && ` for "${filters.search}"`}
        </p>

        {/* Active Filters Summary */}
        {(filters.category !== "all" || filters.rating || filters.stock) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {filters.category && filters.category !== "all" && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">Category: {filters.category}</span>
            )}
            {filters.rating && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">Rating: {filters.rating}+ stars</span>
            )}
            {filters.stock && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                Stock: {filters.stock === "in" ? "In Stock" : filters.stock === "low" ? "Low Stock" : "Out of Stock"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <main>
        {isLoading ? (
          <ProductGrid>
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden" aria-label="Loading product">
                <div className="aspect-square bg-muted animate-pulse" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </ProductGrid>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center" role="status">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                {filters.search || filters.category !== "all" || filters.rating || filters.stock
                  ? "Try adjusting your search or filters"
                  : "Check back later for new products"}
              </p>
            </div>
          </div>
        ) : (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={isInWishlist(product.id)}
                onAddToWishlist={() => handleAddToWishlist(product.id)}
                onQuickView={() => handleQuickView(product)}
                onProductClick={() => handleProductClick(product)}
              />
            ))}
          </ProductGrid>
        )}
      </main>

      {/* Quick View */}
      <QuickViewComponent open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        {isMobile ? (
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Product Details</DrawerTitle>
            </DrawerHeader>
            {quickViewProduct && (
              <ProductQuickView
                product={quickViewProduct}
                isWishlisted={isInWishlist(quickViewProduct.id)}
                onAddToWishlist={() => handleAddToWishlist(quickViewProduct.id)}
                onClose={() => setQuickViewProduct(null)}
              />
            )}
          </DrawerContent>
        ) : (
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Product Details</SheetTitle>
            </SheetHeader>
            {quickViewProduct && (
              <ProductQuickView
                product={quickViewProduct}
                isWishlisted={isInWishlist(quickViewProduct.id)}
                onAddToWishlist={() => handleAddToWishlist(quickViewProduct.id)}
                onClose={() => setQuickViewProduct(null)}
              />
            )}
          </SheetContent>
        )}
      </QuickViewComponent>
    </div>
  )
}
