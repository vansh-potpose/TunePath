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

    // Check if there are audio files directly in the parent folder
    const audioFilesInParent = files.filter((file) => {
      const filePath = path.join(folderAbsolutePath, file);
      try {
        const stat = fs.statSync(filePath);
        return !stat.isDirectory() && (
          file.toLowerCase().endsWith('.mp3') || 
          file.toLowerCase().endsWith('.m4a') ||
          file.toLowerCase().endsWith('.flac') ||
          file.toLowerCase().endsWith('.wav')
        );
      } catch (error) {
        return false;
      }
    });

    const folders = [];

    // If there are audio files in the parent folder, create a virtual playlist
    if (audioFilesInParent.length > 0) {
      const firstAudioFile = audioFilesInParent[0];
      const audioPath = path.join(folderAbsolutePath, firstAudioFile);
      folders.push({
        name: '🎵 Songs in this folder-Mixed',
        isDirectory: false,
        image: `AUDIO:${audioPath}`,
      });
    }

    // Process subdirectories
    const subfolders = files
      .map((file) => {
        try {
          const filePath = path.join(folderAbsolutePath, file);
          const stat = fs.statSync(filePath);
          
          // Only process directories
          if (!stat.isDirectory()) {
            return null;
          }
          
          return {
            name: file,
            isDirectory: true,
            image: getImageFromFolder(filePath),
          };
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
          return null;
        }
      })
      .filter(item => item !== null);

    folders.push(...subfolders);

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
    
    // Find the first audio file
    const audioFile = files.find((file) => 
      file.toLowerCase().endsWith('.mp3') || 
      file.toLowerCase().endsWith('.m4a') ||
      file.toLowerCase().endsWith('.flac') ||
      file.toLowerCase().endsWith('.wav')
    );
    
    if (audioFile) {
      // Return a special marker that indicates we should extract from audio
      const audioPath = path.join(folderPath, audioFile);
      return `AUDIO:${audioPath}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading folder images:', error);
    return null;
  }
}
