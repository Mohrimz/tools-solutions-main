"use client"

import { useState, useEffect } from "react"

const WISHLIST_KEY = "tools-solutions-wishlist"

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY)
      if (saved) {
        setWishlist(JSON.parse(saved))
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
      } catch (error) {
        console.error("Failed to save wishlist to localStorage:", error)
      }
    }
  }, [wishlist, isLoaded])

  const addToWishlist = (productId: string) => {
    setWishlist((prev) => [...prev, productId])
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId))
  }

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return {
    wishlist,
    isLoaded,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  }
}
