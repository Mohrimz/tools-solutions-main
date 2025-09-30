/**
 * Alternative implementation using Vercel Blob Storage
 * Only use this if you prefer Vercel Blob over Cloudinary
 * 
 * To use this approach:
 * 1. Install: npm install @vercel/blob
 * 2. Uncomment the code below
 * 3. Replace the current upload implementation
 * 
 * Benefits of Vercel Blob:
 * - Integrated with Vercel platform
 * - Simple API
 * - Good for Vercel deployments
 * 
 * Benefits of Cloudinary:
 * - More features (transformations, optimization)
 * - Works with any hosting platform
 * - Better free tier limits
 */

export const VERCEL_BLOB_EXAMPLE = `
// Install first: npm install @vercel/blob

import { put, del } from '@vercel/blob'

export interface BlobUploadResult {
  url: string
  pathname: string
  contentType: string
  contentDisposition: string
}

// Upload image to Vercel Blob Storage
export async function uploadToVercelBlob(
  file: File,
  filename: string
): Promise<BlobUploadResult> {
  const blob = await put(filename, file, {
    access: 'public',
  })
  return blob
}

// Delete image from Vercel Blob Storage
export async function deleteFromVercelBlob(url: string): Promise<void> {
  await del(url)
}

// API Route example (/api/upload/product-image/route.ts):
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('filename')

  if (!filename) {
    return NextResponse.json({ error: 'No filename provided' }, { status: 400 })
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  })

  return NextResponse.json({
    success: true,
    filePath: blob.url,
    filename
  })
}
`