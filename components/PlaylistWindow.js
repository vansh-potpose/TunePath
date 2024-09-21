'use client'
import React from 'react'
import BWbtn from "@/components/BWbtn";
import SvgBtn from "@/components/SvgBtn";
import Songcard from '@/components/Songcard';
import Image from 'next/image';
import SongsWindow from './SongsWindow';
import { useState } from 'react';
import Searchbar from './Searchbar';


const PlaylistWindow = ({playlists,folderPath}) => {
  const [currentplaylist, setCurrentPlaylist] = useState(playlists[0] || null);

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist);
    console.log('Selected Playlist:', playlist);
  };

  return (
    <>
          <Searchbar/>
    
    { currentplaylist === null ?<><div className=" absolute w-full h-72 bg-gradient-to-b from-[#222222] to-[#121212] "></div>
           </>:<SongsWindow currentplaylist={currentplaylist} folderPath={folderPath}/>}
          <div className="plylists mt-20 relative overflow-y-auto">
            <h1 className="font-bold text-2xl mx-5 my-3">Your playlists</h1>
            <div  className="m-3 flex flex-wrap gap-1">
          
              {playlists.map((playlist, index) => (
                <Songcard key={index} img={playlist.image} name={playlist.name.split('-')[0]}  creator={playlist.name.split('-')[1]} onClick={() => handlePlaylistClick(playlist)}/>
              ))}
            </div>
          </div>
    </>
  )
}

export default PlaylistWindow
