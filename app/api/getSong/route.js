import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { 
  sanitizePath, 
  hasValidExtension, 
  getMimeType, 
  ALLOWED_AUDIO_EXTENSIONS,
  MAX_AUDIO_FILE_SIZE 
} from '@/lib/config';

export async function GET(req) {
  const songPath = new URL(req.url).searchParams.get('path');

  // Validate input
  if (!songPath) {
    return NextResponse.json({ 
      error: 'Song path is required' 
    }, { status: 400 });
  }

  // Sanitize path to prevent path traversal
  const sanitized = sanitizePath(songPath);
  if (!sanitized) {
    return NextResponse.json({ 
      error: 'Invalid path provided' 
    }, { status: 400 });
  }

  try {
    const fullSongPath = path.resolve(sanitized);

    // Validate file extension
    if (!hasValidExtension(fullSongPath, ALLOWED_AUDIO_EXTENSIONS)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only audio files are allowed.' 
      }, { status: 400 });
    }

    // Check if file exists
    if (!fs.existsSync(fullSongPath)) {
      return NextResponse.json({ 
        error: 'Song not found' 
      }, { status: 404 });
    }

    // Check if it's a file (not a directory)
    const stats = fs.statSync(fullSongPath);
    if (!stats.isFile()) {
      return NextResponse.json({ 
        error: 'Invalid resource' 
      }, { status: 400 });
    }

    // Check file size
    if (stats.size > MAX_AUDIO_FILE_SIZE) {
      return NextResponse.json({ 
        error: 'File too large' 
      }, { status: 413 });
    }

    const fileSize = stats.size;
    const mimeType = getMimeType(fullSongPath);

    // Parse Range header for partial content support
    const range = req.headers.get('range');
    
    if (range) {
      // Parse range header (format: "bytes=start-end")
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range
      if (start >= fileSize || end >= fileSize || start > end) {
        return new NextResponse(null, {
          status: 416, // Range Not Satisfiable
          headers: {
            'Content-Range': `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;

      // Read partial content
      const fileStream = fs.createReadStream(fullSongPath, { start, end });
      const chunks = [];
      
      for await (const chunk of fileStream) {
        chunks.push(chunk);
      }
      
      const buffer = Buffer.concat(chunks);

      // Return partial content (206)
      return new NextResponse(buffer, {
        status: 206,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': chunkSize.toString(),
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=31536000',
        },
      });
    }

    // No range header - return full file
    const songBuffer = fs.readFileSync(fullSongPath);

    return new NextResponse(songBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error reading song:', error);
    return NextResponse.json({ 
      error: 'Error reading song' 
    }, { status: 500 });
  }
}
