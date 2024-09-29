'use client';

import React, { useEffect, useState } from 'react';
import BWbtn from "@/components/BWbtn";
import Playbar from "@/components/Playbar";
import Sidebar from "@/components/Sidebar";
import SvgBtn from "@/components/SvgBtn";
import Image from "next/image";
import PlaylistWindow from '@/components/PlaylistWindow';

export default function Home() {
  const [folderPath, setFolderPath] = useState('D:/Pracice/htlm/clones/Sportify-project/songs');
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [songData, setSongData] = useState({});
  const [currentSong, setCurrentSongState] = useState(null); // Store the current audio element in state
  const [currentplaylist, setCurrentPlaylist] = useState(null);
  const [song,setSong]= useState();

  const setCurrentSong = (song) => {
    if (currentSong) {
      if (currentSong.src.replace("http://localhost:3000", "") !== song) {
        currentSong.pause();
        currentSong.currentTime = 0;
        currentSong.src = song;
        currentSong.play();
      } else {
        if (currentSong.paused) {
          currentSong.play();
        } else {
          currentSong.pause();
        }
      }
    } else {
      const newAudio = new Audio(song);
      newAudio.play();
      setCurrentSongState(newAudio);
    }
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await fetch(`/api/getFolders?folderPath=${encodeURIComponent(folderPath)}`);
      const data = await res.json();
      setPlaylists(data.folders);
    };

    fetchPlaylists();
  }, [folderPath]);

  return (
    <main>
      <div className="flex ">
        <Sidebar 
          playlists={playlists} 
          folderPath={folderPath}  
          setCurrentPlaylist={setCurrentPlaylist} 
          currentplaylist={currentplaylist} 
        />

        <div className="relative maincontent bg-[#121212] mt-2 w-[calc(100vw-328px)] rounded-lg h-[calc(100vh-87px)] overflow-hidden overflow-y-auto">
          <PlaylistWindow 
            playlists={playlists} 
            folderPath={folderPath} 
            currentSong={currentSong} 
            setCurrentPlaylist={setCurrentPlaylist} 
            setCurrentSong={setCurrentSong}  
            currentplaylist={currentplaylist}  
            songs={songs} 
            setSongs={setSongs} 
            setSongData={setSongData} 
            songData={songData}
            song={song}
            setSong={setSong}
          />
        </div>
      </div>

      <Playbar currentSong={currentSong} setCurrentSong={setCurrentSong} folderPath={folderPath} currentplaylist={currentplaylist} songs={songs} setSongs={setSongs} setSongData={setSongData} songData={songData} song={song} setSong={setSong}/>
    </main>  
  );
}
