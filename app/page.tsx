"use client"

import Link from "next/link"
import { ArrowRight, Package, Shield, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/mock-data"
import { formatPriceLKR } from "@/lib/utils"
import { StockBadge } from "@/components/ui/stock-badge"
import { RatingStars } from "@/components/ui/rating-stars"
import { ImagePlaceholder } from "@/components/ui/image-placeholder"
import { useProductStore } from "@/lib/stores/product-store"

export default function HomePage() {
  const { products } = useProductStore()
  // Get best sellers (active products with high ratings)
  const bestSellers = products.filter((product) => product.isActive && product.rating >= 4.5).slice(0, 4)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-background py-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-24 h-24 bg-blue-500/10 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-500/10 rounded-full animate-ping"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-purple-500/10 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance animate-fade-in-up">
              Tools Solutions
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto animate-fade-in-up delay-300">
              Pro-grade hand tools at honest Sri Lankan prices
            </p>
          </div>

          <div className="animate-fade-in-up delay-500">
            <Button size="lg" asChild className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-balance">Shop by Category</h2>
            <p className="text-lg text-muted-foreground text-pretty">Find the perfect tools for your specific needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <Link href={`/products?category=${encodeURIComponent(category)}`}>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Professional {category.toLowerCase()} for every project
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-balance">Why Choose Tools Solutions</h2>
            <p className="text-lg text-muted-foreground text-pretty">Your trusted partner for quality hand tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Free Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">30-day hassle-free returns on all products</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Expert assistance whenever you need it</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Quality Warranty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Comprehensive warranty on all tools</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-orange-100 dark:bg-orange-900/20">
                  <CreditCard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Cash on Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-balance">Best Sellers</h2>
            <p className="text-lg text-muted-foreground text-pretty">Our most popular and highly-rated tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-muted">
                    <ImagePlaceholder
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <CardTitle className="text-base line-clamp-2 text-balance">{product.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatPriceLKR(product.priceLKR)}</span>
                    <StockBadge stock={product.stock} />
                  </div>

                  <div className="flex items-center gap-2">
                    <RatingStars rating={product.rating} />
                    <span className="text-sm text-muted-foreground">({product.rating})</span>
                  </div>

                  <Button size="sm" className="w-full" asChild disabled={product.stock === 0}>
                    <Link href={`/products?search=${encodeURIComponent(product.name)}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
