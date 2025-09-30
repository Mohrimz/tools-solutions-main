"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { mockProducts } from "@/lib/mock-data"
import { formatPriceLKR, getStockStatus } from "@/lib/utils"
import { useWishlist } from "@/hooks/use-wishlist"
import { ProductGrid } from "@/components/store/product-grid"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { StockBadge } from "@/components/ui/stock-badge"
import { RatingStars } from "@/components/ui/rating-stars"

export default function WishlistPage() {
  const { wishlist, isLoaded, removeFromWishlist } = useWishlist()

  const wishlistProducts = useMemo(() => {
    return mockProducts.filter((product) => wishlist.includes(product.id))
  }, [wishlist])

  const handleRemoveFromWishlist = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId)
    removeFromWishlist(productId)
    toast({
      title: "Removed from wishlist",
      description: `${product?.name} has been removed from your wishlist.`,
    })
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
            <h1 className="text-4xl font-bold tracking-tight text-balance">My Wishlist</h1>
          </div>
          <p className="text-lg text-muted-foreground text-pretty">
            {wishlistProducts.length === 0
              ? "Your wishlist is empty. Start adding products you love!"
              : `${wishlistProducts.length} ${wishlistProducts.length === 1 ? "item" : "items"} saved for later`}
          </p>
        </div>
      </header>

      {/* Wishlist Content */}
      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
          <div className="p-6 rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Your wishlist is empty</h3>
            <p className="text-muted-foreground max-w-md">
              Browse our catalog and save your favorite tools for later. Click the heart icon on any product to add it
              here.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <main>
          <ProductGrid>
            {wishlistProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-muted">
                    <ImagePlaceholder
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-base line-clamp-2 text-balance">{product.name}</h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">{formatPriceLKR(product.priceLKR)}</span>
                      <StockBadge stock={product.stock} />
                    </div>

                    <div className="flex items-center gap-2">
                      <RatingStars rating={product.rating} />
                      <span className="text-sm text-muted-foreground">({product.rating})</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1" disabled={product.stock === 0} asChild>
                        <Link href={`/products?search=${encodeURIComponent(product.name)}`}>View Details</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ProductGrid>
        </main>
      )}
    </div>
  )
}
