"use client"

import { useState, useEffect } from "react"
import { getAuthState, setAuthState } from "@/lib/storage"
import { useToast } from "@/hooks/use-toast"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setIsAuthenticated(getAuthState())
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === "admin" && password === "muiez") {
      setAuthState(true)
      setIsAuthenticated(true)
      toast({
        title: "Signed in as admin",
        description: "Welcome to Tools Solutions admin panel",
      })
      return true
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your username and password",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    setAuthState(false)
    setIsAuthenticated(false)
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    })
  }

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
