"use client"

import { Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { formatPriceLKR } from "@/lib/utils"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { StockBadge } from "@/components/ui/stock-badge"
import { RatingStars } from "@/components/ui/rating-stars"

interface ProductCardProps {
  product: Product
  isWishlisted: boolean
  onAddToWishlist: () => void
  onQuickView: () => void
  onProductClick?: () => void
}

export function ProductCard({ product, isWishlisted, onAddToWishlist, onQuickView, onProductClick }: ProductCardProps) {
  const isOutOfStock = product.stock === 0

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    if (onProductClick) {
      onProductClick()
    } else {
      onQuickView() // Fallback to quick view if no product click handler
    }
  }

  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <ImagePlaceholder
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          className="transition-transform group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={onQuickView}
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={isWishlisted ? "default" : "secondary"}
            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={onAddToWishlist}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
            {product.category}
          </Badge>
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm font-medium">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="font-semibold line-clamp-2 text-balance">{product.name}</h3>
          <div className="flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-xs text-muted-foreground">({product.rating})</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{formatPriceLKR(product.priceLKR)}</span>
          <StockBadge stock={product.stock} />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={onQuickView}
            disabled={isOutOfStock}
          >
            <Eye className="mr-2 h-4 w-4" />
            Quick View
          </Button>
          <Button
            variant={isWishlisted ? "default" : "outline"}
            size="sm"
            onClick={onAddToWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
