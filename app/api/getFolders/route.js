import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  sanitizePath, 
  hasValidExtension, 
  ALLOWED_IMAGE_EXTENSIONS 
} from '@/lib/config';

export async function GET(req) {
  const folderPath = new URL(req.url).searchParams.get('folderPath');

  // Validate input
  if (!folderPath) {
    return NextResponse.json({ 
      error: 'Folder path is required' 
    }, { status: 400 });
  }

  // Sanitize path to prevent path traversal
  const sanitized = sanitizePath(folderPath);
  if (!sanitized) {
    return NextResponse.json({ 
      error: 'Invalid path provided' 
    }, { status: 400 });
  }

  try {
    const folderAbsolutePath = path.resolve(sanitized);

    // Check if folder exists
    if (!fs.existsSync(folderAbsolutePath)) {
      return NextResponse.json({ 
        error: 'Folder not found' 
      }, { status: 404 });
    }

    // Check if it's a directory
    const stats = fs.statSync(folderAbsolutePath);
    if (!stats.isDirectory()) {
      return NextResponse.json({ 
        error: 'Path is not a directory' 
      }, { status: 400 });
    }

    const files = fs.readdirSync(folderAbsolutePath);

    const folders = files
      .map((file) => {
        try {
          const filePath = path.join(folderAbsolutePath, file);
          const stat = fs.statSync(filePath);
          
          return {
            name: file,
            isDirectory: stat.isDirectory(),
            image: stat.isDirectory() ? getImageFromFolder(filePath) : null,
          };
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);

    return NextResponse.json({ folders }, { status: 200 });
  } catch (error) {
    console.error('Error reading folder:', error);
    
    if (error.code === 'EACCES') {
      return NextResponse.json({ 
        error: 'Permission denied' 
      }, { status: 403 });
    }
    
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

function getImageFromFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFile = files.find((file) => 
      hasValidExtension(file, ALLOWED_IMAGE_EXTENSIONS)
    );
    return imageFile ? path.join(folderPath, imageFile) : null;
  } catch (error) {
    console.error('Error reading folder images:', error);
    return null;
  }
}
