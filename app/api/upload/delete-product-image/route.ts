import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const { filePath } = await request.json()

    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 })
    }

    // Extract filename from path
    const filename = path.basename(filePath)
    
    // Construct full path
    const fullPath = path.join(process.cwd(), 'public', 'images', 'products', filename)

    try {
      await unlink(fullPath)
      return NextResponse.json({ success: true })
    } catch (error) {
      // File might not exist, that's okay
      return NextResponse.json({ success: true })
    }

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}