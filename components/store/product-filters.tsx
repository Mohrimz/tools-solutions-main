"use client"

import { Filter, Star, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ProductFilters } from "@/lib/types"
import { categories } from "@/lib/mock-data"

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function ProductFiltersComponent({ filters, onFiltersChange }: ProductFiltersProps) {
  const updateFilter = (key: keyof ProductFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({ search: filters.search }) // Keep search when clearing other filters
  }

  const hasActiveFilters =
    filters.category || filters.rating || filters.stock || (filters.sortBy && filters.sortBy !== "newest")

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Category
            {filters.category && filters.category !== "all" && (
              <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                {filters.category}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={!filters.category || filters.category === "all"}
            onCheckedChange={() => updateFilter("category", "all")}
          >
            All Categories
          </DropdownMenuCheckboxItem>
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={filters.category === category}
              onCheckedChange={(checked) => updateFilter("category", checked ? category : "all")}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Stock Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Package className="mr-2 h-4 w-4" />
            Stock
            {filters.stock && (
              <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                {filters.stock === "in" ? "In" : filters.stock === "low" ? "Low" : "Out"}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Stock Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={!filters.stock} onCheckedChange={() => updateFilter("stock", undefined)}>
            All Stock Levels
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.stock === "in"}
            onCheckedChange={(checked) => updateFilter("stock", checked ? "in" : undefined)}
          >
            In Stock
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.stock === "low"}
            onCheckedChange={(checked) => updateFilter("stock", checked ? "low" : undefined)}
          >
            Low Stock
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.stock === "out"}
            onCheckedChange={(checked) => updateFilter("stock", checked ? "out" : undefined)}
          >
            Out of Stock
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rating Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Star className="mr-2 h-4 w-4" />
            Rating
            {filters.rating && (
              <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                {filters.rating}★+
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Minimum Rating</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={!filters.rating} onCheckedChange={() => updateFilter("rating", undefined)}>
            All Ratings
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.rating === 4.5}
            onCheckedChange={(checked) => updateFilter("rating", checked ? 4.5 : undefined)}
          >
            4.5★ & above
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.rating === 4}
            onCheckedChange={(checked) => updateFilter("rating", checked ? 4 : undefined)}
          >
            4★ & above
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.rating === 3}
            onCheckedChange={(checked) => updateFilter("rating", checked ? 3 : undefined)}
          >
            3★ & above
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
