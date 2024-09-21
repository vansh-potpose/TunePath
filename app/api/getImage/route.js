import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const imagePath = new URL(req.url).searchParams.get('path'); // Path to the image

  if (!imagePath) {
    return NextResponse.json({ error: 'Image path is required' }, { status: 400 });
  }

  try {
    const fullImagePath = path.resolve(imagePath); // Resolves the absolute path on the local system
    const imageExists = fs.existsSync(fullImagePath);

    if (!imageExists) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(fullImagePath);
    const imageExt = path.extname(fullImagePath).substring(1); // e.g., 'jpg', 'png'

    // Return the image file with the correct content type
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': `image/${imageExt}`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading image' }, { status: 500 });
  }
}
