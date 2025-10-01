"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductFilters } from "@/lib/types"
import { categories } from "@/lib/mock-data"

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function ProductFiltersComponent({ filters, onFiltersChange }: ProductFiltersProps) {
  const updateFilter = (key: keyof ProductFilters, value: string | number | undefined) => {
    let filterValue: any = value === "all" ? undefined : value
    
    // Convert rating to number
    if (key === "rating" && filterValue) {
      filterValue = Number(filterValue)
    }
    
    onFiltersChange({
      ...filters,
      [key]: filterValue,
    })
  }

  const clearFilters = () => {
    onFiltersChange({ 
      search: filters.search, 
      category: undefined,
      rating: undefined,
      sortBy: "newest",
      stock: undefined
    })
  }

  const hasActiveFilters =
    filters.category || filters.rating || filters.stock || (filters.sortBy && filters.sortBy !== "newest")

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Category Filter */}
      <Select value={filters.category || "all"} onValueChange={(value) => updateFilter("category", value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Stock Filter */}
      <Select value={filters.stock || "all"} onValueChange={(value) => updateFilter("stock", value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Stock" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stock</SelectItem>
          <SelectItem value="in-stock">In Stock</SelectItem>
          <SelectItem value="low-stock">Low Stock</SelectItem>
          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>

      {/* Rating Filter */}
      <Select value={filters.rating?.toString() || "all"} onValueChange={(value) => updateFilter("rating", value === "all" ? undefined : value)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ratings</SelectItem>
          <SelectItem value="5">5 Stars</SelectItem>
          <SelectItem value="4">4+ Stars</SelectItem>
          <SelectItem value="3">3+ Stars</SelectItem>
          <SelectItem value="2">2+ Stars</SelectItem>
          <SelectItem value="1">1+ Stars</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={filters.sortBy || "newest"} onValueChange={(value) => updateFilter("sortBy", value)}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
          <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  )
}
