import { NextRequest, NextResponse } from 'next/server'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(request: NextRequest) {
  try {
    const { filePath, publicId } = await request.json()

    if (!filePath && !publicId) {
      return NextResponse.json({ error: 'No file path or public ID provided' }, { status: 400 })
    }

    let deleteSuccess = false

    if (publicId) {
      // Delete using Cloudinary public ID (preferred method)
      deleteSuccess = await deleteFromCloudinary(publicId)
    } else if (filePath) {
      // Extract public ID from Cloudinary URL
      const urlParts = filePath.split('/')
      const fileWithExt = urlParts[urlParts.length - 1]
      const extractedPublicId = `tools-solutions/products/${fileWithExt.split('.')[0]}`
      deleteSuccess = await deleteFromCloudinary(extractedPublicId)
    }

    if (deleteSuccess) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
    }

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}