import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  const folderPath = new URL(req.url).searchParams.get('folderPath');

  if (!folderPath) {
    return NextResponse.json({ error: 'Folder path is required' }, { status: 400 });
  }

  try {
    const folderAbsolutePath = path.resolve(folderPath);
    const files = fs.readdirSync(folderAbsolutePath);

    const folders = files.map((file) => {
      const filePath = path.join(folderAbsolutePath, file);
      const stat = fs.statSync(filePath);
      return {
        name: file,
        isDirectory: stat.isDirectory(),
        image: stat.isDirectory() ? getImageFromFolder(filePath) : null,
      };
    });

    return NextResponse.json({ folders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function getImageFromFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  const imageFile = files.find((file) => file.match(/\.(jpg|jpeg|png|gif)$/i));
  return imageFile ? path.join(folderPath, imageFile) : null; // Return absolute image path
}
