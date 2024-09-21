import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const folderPath = new URL(req.url).searchParams.get('path'); // Full path to the folder

  if (!folderPath) {
    return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
  }

  try {
    const files = fs.readdirSync(folderPath); // Read all files in the folder
    const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav')); // Filter for audio files

    return NextResponse.json({ songs: audioFiles }); // Return the list of songs
  } catch (error) {
    return NextResponse.json({ error: 'Could not read folder or find songs' }, { status: 500 });
  }
}
