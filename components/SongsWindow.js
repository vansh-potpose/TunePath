'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Image from "next/image";
import { parseBlob } from 'music-metadata-browser';
import { useAppState } from '@/contexts/AppStateContext';
import LazyImage from '@/components/LazyImage';
import PlaylistImage from '@/components/PlaylistImage';

const formatTime = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const transformSecondsToReadableFormat = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} sec${seconds > 1 ? 's' : ''}`);
  const text = parts.join(' ');
  return text || '0 sec';
};

const colors = ['#10B981', '#217980', '#c71543', '#49358d', '#71bdc4', '#d9b086'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const SongsWindow = ({ playSong }) => {
  const { 
    folderPath, 
    currentPlaylist, 
    songs, 
    setSongs, 
    songData, 
    setSongData 
  } = useAppState();
  
  const [totalDuration, setTotalDuration] = useState(0);
  const [bgColor, setBgColor] = useState(getRandomColor());
  const [playlistCoverImage, setPlaylistCoverImage] = useState(null);

  // Memoize the full path to avoid recalculation (with guards)
  const playlistPath = useMemo(() => {
    const name = currentPlaylist?.name || '';
    const root = folderPath || '';
    
    // Handle special case: songs directly in parent folder
    if (name && name.startsWith('🎵 Songs in this folder')) {
      return root; // Return parent folder path
    }
    
    return name && root ? `${root}/${name}` : '';
  }, [folderPath, currentPlaylist?.name]);

  // Memoize formatted duration
  const formattedDuration = useMemo(() => 
    transformSecondsToReadableFormat(totalDuration),
    [totalDuration]
  );

  // Memoize playlist info splits with safe fallbacks
  const { playlistName, playlistAuthor } = useMemo(() => {
    const raw = currentPlaylist?.name || '';
    const parts = raw.split('-');
    return {
      playlistName: (parts[0] || raw).trim(),
      playlistAuthor: (parts[1] || '').trim(),
    };
  }, [currentPlaylist?.name]);

  useEffect(() => {
    if (!playlistPath) return;
    const fetchSongs = async () => {
      const response = await fetch(`/api/getSongs?path=${encodeURIComponent(playlistPath)}`);
      const data = await response.json();

      if (data.songs) {
        setSongs(data.songs);
      } else {
        console.error(data.error);
      }
    };

    fetchSongs();
  }, [playlistPath, setSongs]);

  useEffect(() => {
    const getDurationFromBlob = (blob) => {
      return new Promise((resolve) => {
        try {
          const url = URL.createObjectURL(blob);
          const audio = new Audio();
          audio.preload = 'metadata';
          const cleanup = () => {
            URL.revokeObjectURL(url);
          };
          const onLoaded = () => {
            const d = isFinite(audio.duration) ? audio.duration : 0;
            cleanup();
            resolve(d || 0);
          };
          const onError = () => {
            cleanup();
            resolve(0);
          };
          audio.addEventListener('loadedmetadata', onLoaded, { once: true });
          audio.addEventListener('error', onError, { once: true });
          // safety timeout
          setTimeout(() => {
            audio.removeEventListener('loadedmetadata', onLoaded);
            audio.removeEventListener('error', onError);
            cleanup();
            resolve(0);
          }, 3000);
          audio.src = url;
        } catch (e) {
          resolve(0);
        }
      });
    };

    const fetchSongData = async () => {
      const results = await Promise.all(
        songs.map(async (song) => {
          const audioUrl = `/api/getSong?path=${encodeURIComponent(`${playlistPath}/${song}`)}`;
          try {
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            const metadata = await parseBlob(blob);

            const picture = metadata.common.picture?.[0];
            let imageUrl = "/music.svg";
            if (picture) {
              const base64String = btoa(
                new Uint8Array(picture.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
              );
              imageUrl = `data:${picture.format};base64,${base64String}`;
            }

            let duration = metadata.format.duration || 0;
            if (!duration) {
              duration = await getDurationFromBlob(blob);
            }

            const baseName = song.replace(/\.[^/.]+$/, '');
            const parts = baseName.split('-');
            const fallbackTitle = (parts[0] || baseName).trim();
            const fallbackArtist = (parts[1] ? parts[1] : '').replace(/\.[^/.]+$/, '').trim();

            const metaTitle = (metadata.common.title || '').trim();
            const metaArtist = (metadata.common.artists && metadata.common.artists.length)
              ? metadata.common.artists.join(', ')
              : (metadata.common.artist || '').trim();

            return {
              song,
              data: {
                imageUrl,
                duration: formatTime(duration),
                title: metaTitle || fallbackTitle,
                artist: metaArtist || fallbackArtist,
              },
              rawDuration: duration,
            };
          } catch (error) {
            console.error('Error fetching or parsing audio file:', error);
            const baseName = song.replace(/\.[^/.]+$/, '');
            const parts = baseName.split('-');
            return {
              song,
              data: {
                imageUrl: "/music.svg",
                duration: formatTime(0),
                title: (parts[0] || baseName).trim(),
                artist: (parts[1] ? parts[1] : '').trim(),
              },
              rawDuration: 0,
            };
          }
        })
      );

      const map = {};
      let total = 0;
      let coverImage = null;
      
      results.forEach(({ song, data, rawDuration }, index) => {
        map[song] = data;
        total += rawDuration || 0;
        
        // Use the first song's image as playlist cover if no dedicated cover exists
        if (index === 0 && data.imageUrl && data.imageUrl !== "/music.svg") {
          coverImage = data.imageUrl;
        }
      });

      setSongData(map);
      setTotalDuration(total);
      
      // Set playlist cover from first song if available
      if (coverImage && !currentPlaylist?.image) {
        setPlaylistCoverImage(coverImage);
      }
    };

    if (playlistPath && songs.length > 0) {
      fetchSongData();
    }

    setBgColor(getRandomColor());
  }, [songs, playlistPath, setSongData]);

  const handlePlaySong = useCallback((song) => {
    if (!playlistPath) return;
    const songUrl = `/api/getSong?path=${encodeURIComponent(`${playlistPath}/${song}`)}`;
    playSong(songUrl, song);
  }, [playlistPath, playSong]);

  return (
    <>
      <div className="absolute w-full h-[500px]" style={{ backgroundImage: `linear-gradient(to bottom,${bgColor},#121212)` }}></div>
      <div className="my-20 py-3 relative z-20 px-6">
        <div className='flex items-center gap-4 my-4'>
          <PlaylistImage 
            playlist={currentPlaylist}
            width={180}
            height={180}
            className="rounded-lg shadow-md shadow-[#2d2d2d] flex-shrink-0"
          />
          <div className='flex-1 min-w-0'>
            <h1 className='text-sm'>Playlist</h1>
            <h1 className='font-bold text-7xl my-2 break-words' style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{playlistName}</h1>
            <p className='truncate' title={`${playlistAuthor} - ${songs.length} songs, ${formattedDuration}`}>
              <strong>{playlistAuthor}</strong> - {songs.length} songs, {formattedDuration}
            </p>
          </div>
        </div>

        <div className='options my-10 flex items-center gap-4'>
          <button className='bg-green-500 text-gray-600 font-black text-2xl rounded-full object-scale-down w-16 h-16'>
            <Image src={'play.svg'} width={100} height={100} />
          </button>
          <button className='bg-green-500 text-gray-600 font-black text-2xl rounded-full object-scale-down w-16 h-16 flex items-center justify-center'>
            <Image src={'suffle.svg'} width={30} height={30} />
          </button>
        </div>

        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-base font-thin table-fixed">
              <thead className="border-b-2 border-[#424242]">
                <tr>
                  <th className="px-4 py-2 text-center w-16">#</th>
                  <th className="px-4 py-2 w-[40%]">Title</th>
                  <th className="px-4 py-2 w-[30%]">Singers</th>
                  <th className="px-4 py-2 text-center w-[100px]">Duration</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, index) => {
                  const title = songData[song]?.title || song.replace(/\.[^/.]+$/, '').split('-')[0];
                  const artist = songData[song]?.artist || (song.replace(/\.[^/.]+$/, '').split('-')[1] || '');
                  return (
                    <tr key={index} className="group hover:bg-[#1f1f1f] text-slate-300 hover:text-white" onClick={() => handlePlaySong(song)}>
                      <td className="px-4 py-2 text-center">{index + 1}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className='relative flex-shrink-0'>
                            <div className='absolute bg-stone-800 bg-opacity-40 w-full h-full flex items-center justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible'>
                              <svg viewBox="0 0 24 24" className='w-6'>
                                <path fill='#ffffff' d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                              </svg>
                            </div>
                            <LazyImage
                              src={songData[song]?.imageUrl || "/music.svg"}
                              alt="playlist"
                              width={42}
                              height={42}
                              className="rounded-md w-[42px] h-[42px]"
                              placeholder="/music.svg"
                              rootMargin="150px"
                            />
                          </div>
                          <span className="truncate" title={title}>{title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <div className="truncate" title={artist}>{artist}</div>
                      </td>
                      <td className="px-4 py-2 text-center">{songData[song]?.duration || '00:00'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default SongsWindow;
