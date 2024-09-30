'use client';

import React, { useEffect, useState } from 'react';
import BWbtn from "@/components/BWbtn";
import Playbar from "@/components/Playbar";
import Sidebar from "@/components/Sidebar";
import SvgBtn from "@/components/SvgBtn";
import Image from "next/image";
import PlaylistWindow from '@/components/PlaylistWindow';

export default function Home() {

  const [folderPath, setFolderPath] = useState(JSON.parse(localStorage.getItem('folderPaths'))[0]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [songData, setSongData] = useState({});
  const [currentSong, setCurrentSongState] = useState(null); // Store the current audio element in state
  const [currentplaylist, setCurrentPlaylist] = useState(null);
  const [song,setSong]= useState();

  // useEffect(() => {
  //   const storedPaths = JSON.parse(localStorage.getItem('folderPaths')) || [];
    
  //   // Check if there are any stored paths
  //   if (storedPaths.length > 0) {
  //     setFolderPath(storedPaths[0]);
  //   } else {
  //     console.log('No folder paths found in local storage.');
  //   }
  // }, []);
    

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

  const prevSong = () => {
    const currentIndex = songs.indexOf(song);
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = songs.length - 1;
    }
    setCurrentSong(`/api/getSong?path=${encodeURIComponent(folderPath + '/' + currentplaylist.name + '/' + songs[newIndex])}`);
    setSong(songs[newIndex]);
  }

  const nextSong = () => {
    const currentIndex = songs.indexOf(song);
    let newIndex = currentIndex + 1;
    if (newIndex >= songs.length) {
      newIndex = 0;
    }
    setCurrentSong(`/api/getSong?path=${encodeURIComponent(folderPath + '/' + currentplaylist.name + '/' + songs[newIndex])}`);
    setSong(songs[newIndex]);
  }

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
            setFolderPath={setFolderPath}
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

      <Playbar currentSong={currentSong}
       setCurrentSong={setCurrentSong}
        folderPath={folderPath}
        currentplaylist={currentplaylist}
        songs={songs}
        setSongs={setSongs}
        setSongData={setSongData}
        songData={songData}
        song={song}
        setSong={setSong} 
        prevSong={prevSong}
        nextSong={nextSong}
        />
    </main>  
  );
}
