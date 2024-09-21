'use client'
import React, { useEffect, useState } from 'react'
import BWbtn from "@/components/BWbtn";
import Playbar from "@/components/Playbar";
import Sidebar from "@/components/Sidebar";
import SvgBtn from "@/components/SvgBtn";
import Image from "next/image";
import PlaylistWindow from '@/components/PlaylistWindow';

export default function Home() {
  const [folderPath, setFolderPath] = useState('D:/Pracice/htlm/clones/Sportify-project/songs');
  const [playlists, setPlaylists] = useState([]);

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

        <Sidebar playlists={playlists} folderPath={folderPath}/>

        <div className="relative maincontent bg-[#121212] mt-2 w-[calc(100vw-328px)] rounded-lg h-[calc(100vh-87px)] overflow-hidden overflow-y-auto">

          <PlaylistWindow playlists={playlists} folderPath={folderPath}/>
        
        </div>
      </div>

      <Playbar />
    </main>  
  );
}
