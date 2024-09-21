'use client'
import React, { useState } from 'react'

export default function Home() {
  const [folderPath, setFolderPath] = useState('');
  const [playlists, setPlaylists] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/getFolders?folderPath=${encodeURIComponent(folderPath)}`);
    const data = await res.json();
    setPlaylists(data.folders);
  };

  return (
    <div>
      <h1>Enter Folder Path</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          placeholder="Enter folder path"
          required
        />
        <button type="submit">Fetch Playlists</button>
      </form>

      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.name}>
            <h2>{playlist.name}</h2>
            {playlist.image && <img src={`/api/getImage?path=${encodeURIComponent(playlist.image)}`} alt={playlist.name} />}
            {/* Implement your music player UI */}
          </li>
        ))}
      </ul>
    </div>
  );
}
