'use client';
import React, { useState, useEffect } from 'react';
import { parseBlob } from 'music-metadata-browser';

const PlaylistImage = ({ playlist, width = 180, height = 180, className = '' }) => {
  const [imageSrc, setImageSrc] = useState('/music.svg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!playlist?.image || typeof playlist.image !== 'string') {
        setImageSrc('/music.svg');
        setIsLoading(false);
        return;
      }

      // If it's an AUDIO: marker, extract from audio file
      if (playlist.image.startsWith('AUDIO:')) {
        const audioPath = playlist.image.substring(6);
        try {
          const songRes = await fetch(`/api/getSong?path=${encodeURIComponent(audioPath)}`);
          if (songRes.ok) {
            const blob = await songRes.blob();
            const metadata = await parseBlob(blob);
            
            if (metadata.common.picture && metadata.common.picture.length > 0) {
              const picture = metadata.common.picture[0];
              const base64String = btoa(
                new Uint8Array(picture.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
              );
              const dataUrl = `data:${picture.format};base64,${base64String}`;
              setImageSrc(dataUrl);
            } else {
              setImageSrc('/music.svg');
            }
          } else {
            console.error('Failed to fetch audio file:', songRes.status);
            setImageSrc('/music.svg');
          }
        } catch (err) {
          console.error('Error extracting image from audio:', err);
          setImageSrc('/music.svg');
        }
      } else {
        // Regular image file
        setImageSrc(`/api/getImage?path=${encodeURIComponent(playlist.image)}`);
      }
      
      setIsLoading(false);
    };

    loadImage();
  }, [playlist?.image]);

  if (isLoading) {
    return (
      <div 
        className={`${className} bg-stone-800 animate-pulse rounded-lg`}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      alt="playlist cover"
      width={width}
      height={height}
      className={className}
      style={{ width: `${width}px`, height: `${height}px`, objectFit: 'cover' }}
    />
  );
};

export default PlaylistImage;
