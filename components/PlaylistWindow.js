'use client'
import React from 'react'
import BWbtn from "@/components/BWbtn";
import SvgBtn from "@/components/SvgBtn";
import Songcard from '@/components/Songcard';
import Image from 'next/image';
import SongsWindow from './SongsWindow';
import { useState } from 'react';
import Searchbar from './Searchbar';
import { useAppState } from '@/contexts/AppStateContext';


const PlaylistWindow = ({ playSong }) => {
  const { playlists, currentPlaylist, setCurrentPlaylist, folderPath, setFolderPath } = useAppState();

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist);
  };

  return (
    <>
      <Searchbar folderPath={folderPath} setFolderPath={setFolderPath}/>
    
      { currentPlaylist === null ? (
        <>
          <div className="absolute w-full h-72 bg-gradient-to-b from-[#222222] to-[#121212]"></div>
        </>
      ) : (
        <SongsWindow playSong={playSong} />
      )}
      
      <div className="plylists mt-20 relative overflow-y-auto">
        <h1 className="font-bold text-2xl mx-5 my-3">Your Playlists</h1>
        <div className="m-3 flex flex-wrap gap-1">
          { !playlists || playlists.length === 0
            ? <p className='text-[#b3b3b3] text-sm'>No Playlists</p>
            : playlists.map((playlist, index) => (
                <Songcard 
                  key={index} 
                  img={playlist.image} 
                  name={playlist.name.split('-')[0]}  
                  creator={playlist.name.split('-')[1]} 
                  onClick={() => handlePlaylistClick(playlist)}
                />
              ))
          }
        </div>
      </div>
    </>
  )
}

export default PlaylistWindow
