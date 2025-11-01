'use client';
import React from 'react';

const DebugPlaylist = ({ playlists }) => {
  if (!playlists || playlists.length === 0) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '10px', 
        background: 'black', 
        color: 'lime', 
        padding: '10px', 
        zIndex: 9999,
        maxWidth: '400px',
        maxHeight: '300px',
        overflow: 'auto',
        fontSize: '10px',
        border: '2px solid lime'
      }}>
        <strong>DEBUG: No playlists found</strong>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'black', 
      color: 'lime', 
      padding: '10px', 
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '300px',
      overflow: 'auto',
      fontSize: '10px',
      border: '2px solid lime',
      fontFamily: 'monospace'
    }}>
      <strong>DEBUG: Playlists ({playlists.length})</strong>
      {playlists.slice(0, 3).map((p, i) => (
        <div key={i} style={{ marginTop: '10px', borderTop: '1px solid lime', paddingTop: '5px' }}>
          <div><strong>#{i}</strong></div>
          <div>name: {p.name}</div>
          <div>isDirectory: {String(p.isDirectory)}</div>
          <div>image type: {typeof p.image}</div>
          <div>image value: {p.image ? String(p.image).substring(0, 80) : 'null'}</div>
          <div>starts with AUDIO: {p.image && typeof p.image === 'string' ? String(p.image.startsWith('AUDIO:')) : 'N/A'}</div>
        </div>
      ))}
    </div>
  );
};

export default DebugPlaylist;
