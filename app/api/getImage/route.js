import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { 
  sanitizePath, 
  hasValidExtension, 
  getMimeType, 
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_IMAGE_FILE_SIZE 
} from '@/lib/config';

export async function GET(req) {
  const imagePath = new URL(req.url).searchParams.get('path');

  // Validate input
  if (!imagePath) {
    return NextResponse.json({ 
      error: 'Image path is required' 
    }, { status: 400 });
  }

  // Sanitize path to prevent path traversal
  const sanitized = sanitizePath(imagePath);
  if (!sanitized) {
    return NextResponse.json({ 
      error: 'Invalid path provided' 
    }, { status: 400 });
  }

  try {
    const fullImagePath = path.resolve(sanitized);

    // Validate file extension
    if (!hasValidExtension(fullImagePath, ALLOWED_IMAGE_EXTENSIONS)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only image files are allowed.' 
      }, { status: 400 });
    }

    // Check if file exists
    if (!fs.existsSync(fullImagePath)) {
      return NextResponse.json({ 
        error: 'Image not found' 
      }, { status: 404 });
    }

    // Check if it's a file (not a directory)
    const stats = fs.statSync(fullImagePath);
    if (!stats.isFile()) {
      return NextResponse.json({ 
        error: 'Invalid resource' 
      }, { status: 400 });
    }

    // Check file size
    if (stats.size > MAX_IMAGE_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large' 
      }, { status: 413 });
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(fullImagePath);
    const mimeType = getMimeType(fullImagePath);

    // Return the image file with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error reading image:', error);
    return NextResponse.json({ 
      error: 'Error reading image' 
    }, { status: 500 });
  }
}
