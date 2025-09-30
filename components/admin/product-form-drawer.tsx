"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Upload, ArrowUp, ArrowDown } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { generateSlug } from "@/lib/utils"
import { FormSchema as ProductFormSchema, type ProductFormData } from "@/lib/schemas/product-schema"
import { uploadProductImage, getProductImageUrl } from "@/lib/image-upload"
import { type Product } from "@/lib/types"



interface ProductFormDialogProps {
  mode: "create" | "edit"
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Product
  onSubmitSuccess?: (data: ProductFormData) => void
}

export function ProductFormDrawer({ mode, open, onOpenChange, initial, onSubmitSuccess }: ProductFormDialogProps) {
  const [specs, setSpecs] = useState<Record<string, string>>({})
  const [images, setImages] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Debug logging
  useEffect(() => {
    console.log("[ProductFormDrawer] State changed:", { mode, open, initialId: initial?.id, initialName: initial?.name })
  }, [mode, open, initial])

  const form = useForm<ProductFormData>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: initial?.name || "",
      sku: initial?.sku || "",
      category: initial?.category || "Hammers",
      priceLKR: initial?.priceLKR || 0,
      stock: initial?.stock || 0,
      isActive: initial?.isActive ?? true,
      description: initial?.description || "",
      specs: initial?.specs || {},
      images: initial?.images || [],
      rating: initial?.rating || 4,
    },
  })

  const watchName = form.watch("name")
  const slugPreview = generateSlug(watchName)

  useEffect(() => {
    if (open) {
      if (mode === "create") {
        form.reset({
          name: "",
          sku: "",
          category: "Hammers",
          priceLKR: 0,
          stock: 0,
          isActive: true,
          description: "",
          specs: {},
          images: [],
          rating: 4,
        })
        setSpecs({})
        setImages([])
      } else if (mode === "edit" && initial) {
        form.reset({
          name: initial.name,
          sku: initial.sku,
          category: initial.category,
          priceLKR: initial.priceLKR,
          stock: initial.stock,
          isActive: initial.isActive,
          description: initial.description || "",
          specs: initial.specs || {},
          images: initial.images || [],
          rating: initial.rating || 4,
        })
        setSpecs(initial.specs || {})
        setImages(initial.images || [])
      }
    }
  }, [mode, initial, form, open])

  const addSpec = () => {
    const newSpecs = { ...specs, "": "" }
    setSpecs(newSpecs)
  }

  const updateSpecKey = (oldKey: string, newKey: string) => {
    if (oldKey === newKey) return
    const newSpecs = { ...specs }
    const value = newSpecs[oldKey]
    delete newSpecs[oldKey]
    newSpecs[newKey] = value
    setSpecs(newSpecs)
  }

  const updateSpecValue = (key: string, value: string) => {
    setSpecs((prev) => ({ ...prev, [key]: value }))
  }

  const removeSpec = (key: string) => {
    const newSpecs = { ...specs }
    delete newSpecs[key]
    setSpecs(newSpecs)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)

    try {
      const uploadPromises = files.map(async (file) => {
        const result = await uploadProductImage(file)
        if (result.success && result.filePath) {
          return result.filePath
        } else {
          toast({
            title: "Upload failed",
            description: result.error || `Failed to upload ${file.name}`,
            variant: "destructive",
          })
          return null
        }
      })

      const uploadedPaths = await Promise.all(uploadPromises)
      const validPaths = uploadedPaths.filter((path): path is string => path !== null)

      if (validPaths.length > 0) {
        setImages((prev) => [...prev, ...validPaths])
        toast({
          title: "Images uploaded",
          description: `Successfully uploaded ${validPaths.length} image(s).`,
        })
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const moveImageUp = (index: number) => {
    if (index === 0) return
    setImages((prev) => {
      const newImages = [...prev]
      ;[newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]
      return newImages
    })
  }

  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return
    setImages((prev) => {
      const newImages = [...prev]
      ;[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
      return newImages
    })
  }

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const cleanSpecs = Object.fromEntries(Object.entries(specs).filter(([key, value]) => key.trim() && value.trim()))

      const formData: ProductFormData = {
        ...data,
        specs: cleanSpecs,
        images: images.filter((img) => img.trim()),
      }

      // Validate form data
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Product name is required.",
          variant: "destructive",
        })
        return
      }

      if (!formData.sku.trim()) {
        toast({
          title: "Validation Error",
          description: "Product SKU is required.",
          variant: "destructive",
        })
        return
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(formData)
      }

      // Don't close the drawer here - let the parent handle it
      // onOpenChange(false)
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      toast({
        title: "Error saving product",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Product" : "Edit Product"}</DialogTitle>
        </DialogHeader>

        <div className="px-4 pb-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} aria-describedby="name-help" />
                    </FormControl>
                    {slugPreview && <FormDescription id="name-help">Slug: {slugPreview}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product SKU" {...field} aria-describedby="sku-help" />
                    </FormControl>
                    <FormDescription id="sku-help">Unique product identifier</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger aria-describedby="category-help">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Hammers">Hammers</SelectItem>
                        <SelectItem value="Screwdrivers">Screwdrivers</SelectItem>
                        <SelectItem value="Wrenches">Wrenches</SelectItem>
                        <SelectItem value="Saws">Saws</SelectItem>
                        <SelectItem value="Pliers">Pliers</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription id="category-help">Product category for organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priceLKR"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (LKR) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          aria-describedby="price-help"
                        />
                      </FormControl>
                      <FormDescription id="price-help">Price in Sri Lankan Rupees</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                          aria-describedby="stock-help"
                        />
                      </FormControl>
                      <FormDescription id="stock-help">Available quantity</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>Product is visible to customers when active</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} aria-describedby="active-help" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="resize-none"
                        rows={3}
                        {...field}
                        aria-describedby="description-help"
                      />
                    </FormControl>
                    <FormDescription id="description-help">Optional product description</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Specifications</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSpec} aria-label="Add specification">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Spec
                  </Button>
                </div>

                {Object.entries(specs).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No specifications added yet</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(specs).map(([key, value], index) => (
                      <div key={`${key}-${index}`} className="flex gap-2 items-center">
                        <Input
                          placeholder="Property name"
                          value={key}
                          onChange={(e) => updateSpecKey(key, e.target.value)}
                          className="flex-1"
                          aria-label="Specification key"
                        />
                        <Input
                          placeholder="Property value"
                          value={value}
                          onChange={(e) => updateSpecValue(key, e.target.value)}
                          className="flex-1"
                          aria-label="Specification value"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSpec(key)}
                          aria-label="Remove specification"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Images</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImages}
                    aria-label="Add images"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingImages ? "Uploading..." : "Add Images"}
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />

                {images.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No images added yet</p>
                ) : (
                  <div className="space-y-2">
                    {images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-lg">
                        <img
                          src={getProductImageUrl(image)}
                          alt={`Image ${index + 1} preview for ${form.getValues("name") || "product"}`}
                          className="h-12 w-12 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg'
                          }}
                        />
                        <div className="flex-1 text-sm text-muted-foreground">Image {index + 1}</div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveImageUp(index)}
                            disabled={index === 0}
                            aria-label="Move image up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => moveImageDown(index)}
                            disabled={index === images.length - 1}
                            aria-label="Move image down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(index)}
                            aria-label="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : mode === "create" ? "Save" : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
