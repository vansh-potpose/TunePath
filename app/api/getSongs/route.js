import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { 
  sanitizePath, 
  hasValidExtension, 
  ALLOWED_AUDIO_EXTENSIONS 
} from '@/lib/config';

export async function GET(req) {
  const folderPath = new URL(req.url).searchParams.get('path');

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
    const fullFolderPath = path.resolve(sanitized);

    // Check if folder exists
    if (!fs.existsSync(fullFolderPath)) {
      return NextResponse.json({ 
        error: 'Folder not found' 
      }, { status: 404 });
    }

    // Check if it's a directory
    const stats = fs.statSync(fullFolderPath);
    if (!stats.isDirectory()) {
      return NextResponse.json({ 
        error: 'Path is not a directory' 
      }, { status: 400 });
    }

    // Read all files in the folder
    const files = fs.readdirSync(fullFolderPath);
    
    // Filter for valid audio files
    const audioFiles = files.filter(file => {
      const filePath = path.join(fullFolderPath, file);
      try {
        const fileStats = fs.statSync(filePath);
        return fileStats.isFile() && hasValidExtension(file, ALLOWED_AUDIO_EXTENSIONS);
      } catch (error) {
        console.error(`Error checking file ${file}:`, error);
        return false;
      }
    });

    return NextResponse.json({ 
      songs: audioFiles 
    }, { status: 200 });
  } catch (error) {
    console.error('Error reading folder:', error);
    
    if (error.code === 'EACCES') {
      return NextResponse.json({ 
        error: 'Permission denied' 
      }, { status: 403 });
    }
    
    return NextResponse.json({ 
      error: 'Could not read folder or find songs' 
    }, { status: 500 });
  }
}
