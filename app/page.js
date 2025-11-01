'use client';

import React, { useEffect } from 'react';
import Playbar from "@/components/Playbar";
import Sidebar from "@/components/Sidebar";
import PlaylistWindow from '@/components/PlaylistWindow';
import { useAudio } from '@/contexts/AudioContext';
import { useAppState } from '@/contexts/AppStateContext';

export default function Home() {
  const audio = useAudio();
  const appState = useAppState();

  const { 
    folderPath, 
    playlists, 
    songs, 
    songData, 
    currentPlaylist, 
    currentSong,
    setFolderPath,
    setSongs,
    setSongData,
    setCurrentPlaylist,
    setCurrentSong
  } = appState;

  // Register next song handler for when track ends
  useEffect(() => {
    audio.onEnded(() => {
      nextSong();
    });
  }, [songs, currentSong, currentPlaylist, folderPath]);

  const playSong = (songUrl, songName) => {
    console.log('Playing song:', songUrl);
    audio.play(songUrl);
    setCurrentSong(songName);
  };

  const prevSong = () => {
    if (!songs.length || !currentPlaylist || !currentSong) return;
    const currentIndex = songs.indexOf(currentSong);
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = songs.length - 1;
    }
    
    // Handle special case: songs in parent folder
    const playlistPath = currentPlaylist.name.startsWith('🎵 Songs in this folder')
      ? folderPath
      : `${folderPath}/${currentPlaylist.name}`;
    
    const songUrl = `/api/getSong?path=${encodeURIComponent(playlistPath + '/' + songs[newIndex])}`;
    playSong(songUrl, songs[newIndex]);
  };

  const nextSong = () => {
    if (!songs.length || !currentPlaylist || !currentSong) return;
    const currentIndex = songs.indexOf(currentSong);
    let newIndex = currentIndex + 1;
    if (newIndex >= songs.length) {
      newIndex = 0;
    }
    
    // Handle special case: songs in parent folder
    const playlistPath = currentPlaylist.name.startsWith('🎵 Songs in this folder')
      ? folderPath
      : `${folderPath}/${currentPlaylist.name}`;
    
    const songUrl = `/api/getSong?path=${encodeURIComponent(playlistPath + '/' + songs[newIndex])}`;
    playSong(songUrl, songs[newIndex]);
  };

  return (
    <main>
      <div className="flex ">
        <Sidebar />

        <div className="relative maincontent bg-[#121212] mt-2 w-[calc(100vw-328px)] rounded-lg h-[calc(100vh-87px)] overflow-hidden overflow-y-auto">
          <PlaylistWindow 
            playSong={playSong}
          />
        </div>
      </div>

      <Playbar
        song={currentSong}
        songData={songData}
          currentSong={audio.audioElement}
        prevSong={prevSong}
        nextSong={nextSong}
        />
    </main>  
  );
}
