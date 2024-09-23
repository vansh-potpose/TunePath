'use client'
import React from 'react'
import Hoverbtn from './Hoverbtn'
import PlaylistBtn from '@/components/PlaylistBtn'
import { useState } from 'react'
const Sidebar = ({playlists ,setCurrentPlaylist,currentPlaylist}) => {

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist);
    console.log('Selected Playlist by sidebar:', playlist);
  };
  

  return (
    <div className='min-w-80 '>
      <div className='bg-[#121212] p-5 flex flex-col gap-4 m-2 rounded-lg'>
        <div onClick={() => handlePlaylistClick(null)}>

        <Hoverbtn path='M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z' text='Home' />
        </ div>
        <Hoverbtn path='M10.533 1.27893C5.35215 1.27893 1.12598 5.41887 1.12598 10.5579C1.12598 15.697 5.35215 19.8369 10.533 19.8369C12.767 19.8369 14.8235 19.0671 16.4402 17.7794L20.7929 22.132C21.1834 22.5226 21.8166 22.5226 22.2071 22.132C22.5976 21.7415 22.5976 21.1083 22.2071 20.7178L17.8634 16.3741C19.1616 14.7849 19.94 12.7634 19.94 10.5579C19.94 5.41887 15.7138 1.27893 10.533 1.27893ZM3.12598 10.5579C3.12598 6.55226 6.42768 3.27893 10.533 3.27893C14.6383 3.27893 17.94 6.55226 17.94 10.5579C17.94 14.5636 14.6383 17.8369 10.533 17.8369C6.42768 17.8369 3.12598 14.5636 3.12598 10.5579Z' text='Search' />
        
      </div>
      <div className='bg-[#121212] px-2 py-3 flex flex-col gap-4 m-2 mb-0 rounded-lg h-[calc(100vh-200px)]'>
        <div className="options flex pl-3 justify-between">
          <Hoverbtn path='M4 6h16M4 12h16m-7 6h7' text='Your Library' />
          <button className='rounded-full p-2 hover:text-white text-[#b3b3b3] hover:bg-stone-400 hover:bg-opacity-15'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 16 16" fill='none' stroke='currentColor' className='h-4 w-4'><path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path></svg>
          </button>
        </div>
        <div className='playlists overflow-y-auto'>
          {playlists.map((playlist, index) => (
            <PlaylistBtn key={index} cover={playlist.image} name={playlist.name.split("-")[0]} creator={playlist.name.split("-")[1] } onClick={() => handlePlaylistClick(playlist)} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default Sidebar
