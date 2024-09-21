import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const songPath = new URL(req.url).searchParams.get('path'); // Full path to the song

  if (!songPath) {
    return NextResponse.json({ error: 'Song path is required' }, { status: 400 });
  }

  try {
    const fullSongPath = path.resolve(songPath); // Resolve the absolute path
    const songExists = fs.existsSync(fullSongPath);

    if (!songExists) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    // Read the song file
    const songBuffer = fs.readFileSync(fullSongPath);
    const songExt = path.extname(fullSongPath).substring(1); // e.g., 'mp3', 'wav'

    // Return the song file with the correct content type
    return new NextResponse(songBuffer, {
      headers: {
        'Content-Type': `audio/${songExt}`, // Set content type based on file extension
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading song' }, { status: 500 });
  }
}
