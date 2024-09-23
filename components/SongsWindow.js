import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { parseBlob } from 'music-metadata-browser'; 

// Utility function to format the duration in mm:ss
const formatTime = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

// Function to format total time in hh:mm:ss
const formatTotalTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');

    return hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}` 
        : `${minutes}:${seconds}`;
};


const transformSecondsToReadableFormat = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60); // Ensure seconds are whole numbers

    const parts = [];
    if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} sec${seconds > 1 ? 's' : ''}`);

    return parts.join(' ');
};

const colors = [
    '#1E3A8A',
    '#6B21A8',
    '#DC2626',
    '#10B981',
    '#FBBF24'
];

const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};




const SongsWindow = ({ currentplaylist, folderPath }) => {
    const [songs, setSongs] = useState([]);
    const [songData, setSongData] = useState({});
    const [currentSong, setCurrentSong] = useState(null);
    const [totalDuration, setTotalDuration] = useState(0); // Track total duration in seconds
    const [bgColor, setBgColor] = useState(getRandomColor());

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
    }, [folderPath, currentplaylist.name]);

    useEffect(() => {
        const fetchSongData = async () => {
            const songDataMap = {};
            let totalTime = 0; // Initialize total time in seconds

            for (const song of songs) {
                const audioUrl = `/api/getSong?path=${encodeURIComponent(`${folderPath + '/' + currentplaylist.name}/${song}`)}`;
                try {
                    const response = await fetch(audioUrl);
                    const blob = await response.blob();
                    const metadata = await parseBlob(blob);

                    // Extract picture (if any)
                    const picture = metadata.common.picture?.[0];
                    let imageUrl = "/music.svg"; // Default image
                    if (picture) {
                        const base64String = btoa(
                            new Uint8Array(picture.data)
                                .reduce((data, byte) => data + String.fromCharCode(byte), '')
                        );
                        imageUrl = `data:${picture.format};base64,${base64String}`;
                    }

                    const duration = metadata.format.duration || 0;
                    totalTime += duration; // Add to total time

                    songDataMap[song] = {
                        imageUrl,
                        duration: formatTime(duration), // Call the utility function here
                    };
                } catch (error) {
                    console.error('Error fetching or parsing audio file:', error);
                    songDataMap[song] = { imageUrl: "/music.svg", duration: formatTime(0) }; // Default values
                }
            }

            setSongData(songDataMap);
            setTotalDuration(totalTime); // Set the total duration
        };

        if (songs.length > 0) {
            fetchSongData();
        }
        setBgColor(getRandomColor())
    }, [songs, folderPath, currentplaylist.name]);

    const handlePlaySong = (song) => {
        setCurrentSong(`/api/getSong?path=${encodeURIComponent(`${folderPath + '/' + currentplaylist.name}/${song}`)}`);
    };

    return (
        <>
            <div className="absolute w-full h-[500px] " style={{backgroundImage:`linear-gradient(to bottom,${bgColor},#121212)`}}></div>
            <div className="my-20 py-3 relative z-20 px-6">

                <div className='flex items-center gap-4 my-4'>
                    <Image src={`/api/getImage?path=${encodeURIComponent(currentplaylist.image)}`} alt="spotify logo" className='rounded-lg shadow-md shadow-[#2d2d2d]' width={180} height={180} />
                    <div>
                        <h1>Playlist</h1>
                        <h1 className='font-bold text-7xl my-2'>{currentplaylist.name.split('-')[0]}</h1>
                        <p><strong>{currentplaylist.name.split('-')[1]}</strong> - {songs.length} songs, {transformSecondsToReadableFormat(totalDuration)}</p> {/* Display total time */}
                    </div>
                </div>

                <div className='options my-10 flex items-center gap-4'>
                    <button className='bg-green-500 text-gray-600 font-black text-2xl rounded-full object-scale-down w-16 h-16'><Image src={'play.svg'} width={100} height={100}/></button>
                    <button className='bg-green-500 text-gray-600 font-black text-2xl rounded-full object-scale-down w-16 h-16 flex items-center justify-center' ><Image src={'suffle.svg'} width={30} height={30}/></button>
                </div>

                <div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-base font-thin">
                            <thead className="border-b-2 border-[#424242]">
                                <tr>
                                    <th className="px-4 py-2 text-center w-20">Sr No.</th>
                                    <th className="px-4 py-2 w-[480px]">Title</th>
                                    <th className="px-4 py-2 w-[300px]">Singers</th>
                                    <th className="px-4 py-2 text-center">Duration</th>
                                </tr> 
                            </thead>
                            <tbody>

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
                                                <img src={songData[song]?.imageUrl || "/music.svg"} alt="playlist" className="rounded-md w-[42px]" />
                                            </div>
                                            {song.split('-')[0]}
                                        </td>
                                        <td className="px-4 py-2">{song.split('.')[0].split('-')[1]}</td> {/* Replace with actual artist data */}
                                        <td className="px-4 py-2 text-center">{songData[song]?.duration || '00:00'}</td> {/* Display duration */}
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
    );
};

export default SongsWindow;
