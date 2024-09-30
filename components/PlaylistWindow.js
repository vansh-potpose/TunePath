'use client'
import React from 'react'
import BWbtn from "@/components/BWbtn";
import SvgBtn from "@/components/SvgBtn";
import Songcard from '@/components/Songcard';
import Image from 'next/image';
import SongsWindow from './SongsWindow';
import { useState } from 'react';
import Searchbar from './Searchbar';


const PlaylistWindow = (props) => {
  

  const handlePlaylistClick = (playlist) => {
    props.setCurrentPlaylist(playlist);
  };

  return (
    <>
          <Searchbar folderPath={props.folderPath} setFolderPath={props.setFolderPath}/>
    
    { props.currentplaylist === null ?<><div className=" absolute w-full h-72 bg-gradient-to-b from-[#222222] to-[#121212] "></div>
           </>:<SongsWindow currentplaylist={props.currentplaylist} folderPath={props.folderPath} currentSong={props.currentSong} setCurrentSong={props.setCurrentSong} songs={props.songs} setSongs={props.setSongs} setSongData={props.setSongData} songData={props.songData} song={props.song} setSong={props.setSong}/>}
          <div className="plylists mt-20 relative overflow-y-auto">
            <h1 className="font-bold text-2xl mx-5 my-3">Your Playlists</h1>
            <div  className="m-3 flex flex-wrap gap-1">
          
            { !props.playlists ||props.playlists.length === 0
             ? <p className='text-[#b3b3b3] text-sm'>No Playlists</p> :
              props.playlists.map((playlist, index) => (
                <Songcard key={index} img={playlist.image} name={playlist.name.split('-')[0]}  creator={playlist.name.split('-')[1]} onClick={() => handlePlaylistClick(playlist)}/>
              ))}
            </div>
          </div>
    </>
  )
}

export default PlaylistWindow
