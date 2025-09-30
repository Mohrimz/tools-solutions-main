/**
 * Image upload utility for handling product images
 */

export interface UploadResult {
  success: boolean
  filePath?: string
  error?: string
}

/**
 * Upload an image file to the public/images/products directory
 */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
    
    // Validate file type
    const allowedTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload JPG, PNG, WEBP, or GIF files.'
      }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      }
    }

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', filename)

    // Upload to API endpoint
    const response = await fetch('/api/upload/product-image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      return {
        success: false,
        error: error || 'Upload failed'
      }
    }

    const result = await response.json()
    return {
      success: true,
      filePath: result.filePath
    }

  } catch (error) {
    console.error('Image upload error:', error)
    return {
      success: false,
      error: 'Upload failed. Please try again.'
    }
  }
}

/**
 * Delete an image from the public/images/products directory
 */
export async function deleteProductImage(filePath: string): Promise<boolean> {
  try {
    const response = await fetch('/api/upload/delete-product-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filePath }),
    })

    return response.ok
  } catch (error) {
    console.error('Image delete error:', error)
    return false
  }
}

/**
 * Get the full URL for a product image
 */
export function getProductImageUrl(filePath: string): string {
  if (!filePath) return '/placeholder.svg'
  
  // If it's already a full URL or starts with /, return as is
  if (filePath.startsWith('http') || filePath.startsWith('/')) {
    return filePath
  }
  
  // Otherwise, construct the path
  return `/images/products/${filePath}`
}