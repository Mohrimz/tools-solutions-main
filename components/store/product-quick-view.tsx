"use client"

import { useState } from "react"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Product } from "@/lib/types"
import { formatPriceLKR, openWhatsAppForProduct } from "@/lib/utils"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { StockBadge } from "@/components/ui/stock-badge"
import { RatingStars } from "@/components/ui/rating-stars"

interface ProductQuickViewProps {
  product: Product
  isWishlisted: boolean
  onAddToWishlist: () => void
  onClose: () => void
}

export function ProductQuickView({ product, isWishlisted, onAddToWishlist, onClose }: ProductQuickViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleBuy = () => {
    // Open WhatsApp with product details
    openWhatsAppForProduct(product.name, product.priceLKR)
    onClose()
  }

  return (
    <ScrollArea className="h-full max-h-[85vh] md:max-h-[80vh] px-4 overflow-y-auto">
      <div className="space-y-6 py-4 pb-8">
        {/* Image Carousel */}
        <div className="space-y-3">
          <ImagePlaceholder
            src={product.images[currentImageIndex] || "/placeholder.svg"}
            alt={product.name}
            className="w-full"
            aspectRatio="square"
          />
          {product.images.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? "border-primary" : "border-muted"
                  }`}
                >
                  <ImagePlaceholder
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-bold text-balance">{product.name}</h2>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <RatingStars rating={product.rating} size="md" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{formatPriceLKR(product.priceLKR)}</span>
            <StockBadge stock={product.stock} />
          </div>

          {product.description && <p className="text-muted-foreground text-pretty">{product.description}</p>}

          {/* Specifications */}
          {Object.keys(product.specs).length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Specifications</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    {Object.entries(product.specs).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell className="font-medium py-3 text-sm">{key}</TableCell>
                        <TableCell className="py-3 text-sm">{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 sticky bottom-0 bg-background pb-4">
            <Button onClick={handleBuy} className="flex-1" disabled={product.stock === 0}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock === 0 ? "Out of Stock" : "Buy"}
            </Button>
            <Button
              variant={isWishlisted ? "default" : "outline"}
              onClick={onAddToWishlist}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
