"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus, X, Upload } from "lucide-react"
import type { Product } from "@/lib/types"
import { categories } from "@/lib/mock-data"
import { generateSlug } from "@/lib/utils"
import { FormSchema, type ProductFormData } from "@/lib/schemas/product-schema"
import { uploadProductImage, getProductImageUrl } from "@/lib/image-upload"
import { toast } from "@/hooks/use-toast"

interface ProductFormProps {
  product?: Product | null
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [specs, setSpecs] = useState<Record<string, string>>(product?.specs || {})
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set())

  const form = useForm<ProductFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: product?.name || "",
      sku: product?.sku || "",
      category: product?.category || "Hammers",
      priceLKR: product?.priceLKR || 0,
      stock: product?.stock || 0,
      isActive: product?.isActive ?? true,
      description: product?.description || "",
      specs: product?.specs || {},
      images: product?.images || [],
      rating: product?.rating || 4,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        sku: product.sku,
        category: product.category,
        priceLKR: product.priceLKR,
        stock: product.stock,
        isActive: product.isActive,
        description: product.description || "",
        specs: product.specs || {},
        images: product.images || [],
        rating: product.rating || 4,
      })
      setSpecs(product.specs || {})
      setImages(product.images || [])
    } else {
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
    }
  }, [product, form])

  const watchName = form.watch("name")
  const slugPreview = generateSlug(watchName)

  const addSpec = () => {
    const newKey = `spec-${Date.now()}`
    setSpecs((prev) => ({ ...prev, [newKey]: "" }))
  }

  const updateSpec = (oldKey: string, newKey: string, value: string) => {
    setSpecs((prev) => {
      const updated = { ...prev }
      if (oldKey !== newKey) {
        delete updated[oldKey]
      }
      updated[newKey] = value
      return updated
    })
  }

  const removeSpec = (key: string) => {
    setSpecs((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const addImage = () => {
    setImages((prev) => [...prev, "/placeholder.svg"])
  }

  const updateImage = (index: number, url: string) => {
    setImages((prev) => prev.map((img, i) => (i === index ? url : img)))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Set loading state for this image
    setUploadingImages(prev => new Set(prev).add(index))

    try {
      const result = await uploadProductImage(file)
      
      if (result.success && result.filePath) {
        updateImage(index, result.filePath)
        toast({
          title: "Image uploaded",
          description: "Product image has been uploaded successfully.",
        })
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload image. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    } finally {
      // Remove loading state
      setUploadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    }
  }

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const formData: ProductFormData = {
        ...data,
        specs,
        images: images.filter((img) => img.trim() !== ""),
      }

      onSubmit(formData)

      toast({
        title: product ? "Product updated" : "Product created",
        description: `${formData.name} has been ${product ? "updated" : "created"} successfully.`,
      })
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                {slugPreview && <p className="text-xs text-muted-foreground">Slug: {slugPreview}</p>}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Product SKU" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <FormLabel>Price (LKR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? 0 : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={field.value?.toString() || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === "" ? 0 : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating (1-5)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="4"
                    value={field.value?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === "" ? 4 : Number(value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <div className="text-sm text-muted-foreground">Product is visible to customers</div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                  <Textarea placeholder="Product description" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Specifications</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSpec}>
                <Plus className="h-4 w-4 mr-1" />
                Add Spec
              </Button>
            </div>
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <Input
                  placeholder="Property"
                  value={key.startsWith("spec-") ? "" : key}
                  onChange={(e) => updateSpec(key, e.target.value, value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={value}
                  onChange={(e) => updateSpec(key, key, e.target.value)}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => removeSpec(key)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Images</Label>
              <Button type="button" variant="outline" size="sm" onClick={addImage}>
                <Plus className="h-4 w-4 mr-1" />
                Add Image
              </Button>
            </div>
            {images.map((image, index) => (
              <div key={index} className="flex gap-2 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Image URL or upload an image"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="mb-2"
                  />
                  {image && (
                    <div className="w-20 h-20 border rounded overflow-hidden">
                      <img 
                        src={getProductImageUrl(image)} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(index, e)}
                    style={{ display: "none" }}
                    id={`image-upload-${index}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.getElementById(`image-upload-${index}`) as HTMLInputElement
                      input?.click()
                    }}
                    disabled={uploadingImages.has(index)}
                  >
                    {uploadingImages.has(index) ? "Uploading..." : <Upload className="h-4 w-4" />}
                  </Button>
                  {images.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeImage(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {product ? "Update Product" : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
