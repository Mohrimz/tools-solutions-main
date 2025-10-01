"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MainNav } from "./main-nav"
import { UserNav } from "./user-nav"
import { Wrench, Search, Menu, Heart, Home, Package, Info, Phone, User, LogIn } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { wishlist } = useWishlist()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <img src="/log.jpg" alt="Tools Solutions" className="h-12 w-12 rounded-md object-cover" />
          <span className="font-bold text-lg">Tools Solutions</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <MainNav />
        </div>

        {/* Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Wishlist */}
          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <Link href="/wishlist">
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Wishlist</span>
            </Link>
          </Button>

          {/* Desktop Auth - Always Visible */}
          <div className="flex items-center space-x-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8"
                  }
                }}
              />
            </SignedIn>
          </div>

          <UserNav />

          {/* Mobile Menu */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Logo */}
                <div className="flex items-center justify-center mb-6 p-4">
                  <img src="/log.jpg" alt="Tools Solutions" className="h-20 w-20 rounded-lg object-cover" />
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-accent"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/products"
                    className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-accent"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    <span>Products</span>
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-accent"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-accent"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Phone className="h-4 w-4" />
                    <span>Contact</span>
                  </Link>
                </nav>

                {/* Mobile Actions */}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button variant="outline" className="justify-start bg-transparent" asChild>
                    <Link href="/wishlist" onClick={() => setIsSheetOpen(false)}>
                      <Heart className="h-4 w-4 mr-2" />
                      Wishlist
                    </Link>
                  </Button>
                  
                  {/* Mobile Auth */}
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="justify-start bg-transparent">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In with Google
                      </Button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex items-center space-x-3 p-2 rounded-md border">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "h-8 w-8"
                          }
                        }}
                      />
                      <span className="text-sm font-medium">Account</span>
                    </div>
                  </SignedIn>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
