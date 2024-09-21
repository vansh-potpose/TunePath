'use client';
import React, { useEffect, useState } from 'react';
import Image from "next/image";



const SongsWindow = ({ currentplaylist, folderPath }) => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);

    useEffect(() => {
        const fetchSongs = async () => {
            const response = await fetch(`/api/getSongs?path=${encodeURIComponent(folderPath + '/' + currentplaylist.name)}`);
            const data = await response.json();

            if (data.songs) {
                setSongs(data.songs);
            } else {
                console.error(data.error);
            }
        };

        fetchSongs();
    }, [folderPath + '/' + currentplaylist.name]);

    const handlePlaySong = (song) => {
        setCurrentSong(`/api/getSong?path=${encodeURIComponent(`${folderPath + '/' + currentplaylist.name}/${song}`)}`);
    };

    return (
        <>
            <div className=" absolute w-full h-[500px] bg-gradient-to-b from-[#4086dc] to-[#121212] "></div>
            <div className="my-20 py-3 relative z-20 px-6">

                <div className='flex items-center  gap-4 my-4 '>
                    <Image src="/cover.jpg" alt="spotify logo" className='rounded-lg shadow-md shadow-[#2d2d2d]' width={180} height={180} />
                    <div>
                        <h1>Playlist</h1>
                        <h1 className='font-bold text-7xl my-2'>{currentplaylist.name.split('-')[0]}</h1>
                        <p><strong>{currentplaylist.name.split('-')[1]}</strong> - 7 songs, 29 min 51 sec</p>
                    </div>
                </div>
                <div className='options my-10 flex items-center gap-4'>
                    <button className='bg-green-500 text-gray-600 font-black text-2xl rounded-full p-4'>lld</button>
                    <button className='bg-green-500 text-gray-600 font-black text-2xl rounded-full p-4'>lld</button>
                </div>

                <div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-base font-thin">
                            <thead className="border-b-2 border-[#424242]">
                                <tr>
                                    <th className="px-4 py-2 max-w-1 text-center">Sr No.</th>
                                    <th className="px-4 py-2 ">Title</th>
                                    <th className="px-4 py-2 ">Singers</th>
                                    <th className="px-4 py-2 text-center">Duration</th>
                                </tr>
                            </thead>
                            <tbody className="">

                                {songs.map((song, index) => (
                                    <tr key={index} className="group hover:bg-[#1f1f1f] text-slate-300 hover:text-white" onClick={() => handlePlaySong(song)}>
                                        <td className="px-4 py-2 text-center">{index + 1}</td>
                                        <td className="px-4 py-2 flex items-center gap-4">
                                            <div className='relative'>
                                                <div className='absolute bg-stone-800 bg-opacity-40 w-full h-full flex items-center justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible'>
                                                    <svg viewBox="0 0 24 24" className='w-6'>
                                                        <path fill='#ffffff' d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                                                    </svg>
                                                </div>
                                                <img src="/cover.jpg" alt="playlist" className="rounded-md w-[42px]" />
                                            </div>
                                            {song.split('-')[0]}
                                        </td>
                                        <td className="px-4 py-2">{song.split('.')[0].split('-')[1]}</td> {/* Replace with actual artist data */}
                                        <td className="px-4 py-2 text-center">3:45</td> {/* Replace with actual duration */}
                                    </tr>
                                ))}



                            </tbody>
                            
                        </table>
                        {currentSong && (
          <audio controls src={currentSong}>
            Your browser does not support the audio element.
          </audio>
        )}
                    </div>

                </div>
            </div>
        </>
    )
}

export default SongsWindow
