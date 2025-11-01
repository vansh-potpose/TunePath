'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import LazyImage from '@/components/LazyImage';
import { rafThrottle } from '@/lib/performance';

function Playbar(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [volume, setVolume] = useState(0.5);
  const seekbarRef = useRef(null);
  const circleref = useRef(null);
  const timecompleted= useRef(null);
  const playbarref = useRef(null);

  // Memoize parsed song info from metadata with fallbacks to filename
  const songInfo = useMemo(() => {
    if (!props.song) return { name: "", creator: "" };
    const meta = props.songData?.[props.song] || {};
    const base = props.song.replace(/\.[^/.]+$/, '');
    const parts = base.split('-');
    const fallbackName = (parts[0] || base).trim();
    const fallbackCreator = (parts[1] ? parts[1] : '').trim();
    return {
      name: (meta.title || fallbackName) || "",
      creator: (meta.artist || fallbackCreator) || "",
    };
  }, [props.song, props.songData]);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  const convertToSeconds = useCallback((timeString) => {
    if (!timeString) return 0;
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
  }, []);

  // Memoize song duration in seconds
  const songDuration = useMemo(() => {
    if (!props.songData || !props.song) return 0;
    return convertToSeconds(props.songData[props.song]?.duration);
  }, [props.songData, props.song, convertToSeconds]);

  useEffect(() => {
    setName(songInfo.name);
    setCreator(songInfo.creator);
  }, [songInfo]);

  useEffect(() => {
    if (props.currentSong) {
      props.currentSong.volume = volume;
      
      const handleSongEnd = () => {
        props.nextSong(); 
      };
  
      props.currentSong.addEventListener('ended', handleSongEnd);
  
      return () => {
        props.currentSong.removeEventListener('ended', handleSongEnd);
      };
    }
  }, [props.currentSong, volume, props.nextSong]);



  const handleVolumeChange = useCallback((e) => {
    const newVolume = e.target.value; 
    setVolume(newVolume);
  }, []);

  const Playcurrentsong = useCallback(() => {
    if (!props.currentSong) return;
    if (props.currentSong.paused) {
      props.currentSong.play();
      setIsPlaying(true); 
    } else {
      props.currentSong.pause();
      setIsPlaying(false); 
    }
  }, [props.currentSong]);

  // Use RAF throttling for smooth seekbar updates
  const updateSeekBar = useCallback(rafThrottle(() => {
    if (props.currentSong && seekbarRef.current && circleref.current) {
      if (songDuration > 0) {
        const progress = (props.currentSong.currentTime / songDuration) * 100;
        seekbarRef.current.style.width = `${progress}%`;
        if (timecompleted.current) {
          timecompleted.current.innerHTML = formatTime(props.currentSong.currentTime);
        }
        circleref.current.style.left = `calc(${progress}% - 8px)`; 
      }
    }
  }), [props.currentSong, songDuration, formatTime]);

  // Register timeupdate listener AFTER updateSeekBar is defined
  useEffect(() => {
    if (props.currentSong) {
      props.currentSong.addEventListener('timeupdate', updateSeekBar);
      return () => {
        props.currentSong.removeEventListener('timeupdate', updateSeekBar);
      };
    }
  }, [props.currentSong, updateSeekBar]);

  const handleSeekbarClick = useCallback((e) => {
    const seekbarWidth = playbarref.current.offsetWidth;
    const clickPositionX = e.nativeEvent.offsetX;  
    const percentage = (clickPositionX / seekbarWidth) * 100;
    if(props.currentSong && songDuration > 0){
      props.currentSong.currentTime = (songDuration * percentage) / 100;
    }
  }, [props.currentSong, songDuration]);

  return (
    <div className='songdetails mx-2 my-1 flex items-center'>
      <div className='group flex flex-row gap-3 items-center p-2 rounded-lg w-[400px]'>
        <LazyImage
          src={props.songData?.[props.song]?.imageUrl || "/music.svg"}
          alt="Song cover"
          width={55}
          height={55}
          className="rounded-md w-[55px] h-[55px]"
          placeholder="/music.svg"
          rootMargin="150px"
        />
        <div className='flex flex-col'>
          <h3 className='text-white font-medium text-base mb-1'>{name || "Song Name"}</h3>
          <p className='text-[#b3b3b3] text-sm'>{creator || "Creator Name"}</p>
        </div>
      </div>

      <div className="options flex items-center justify-between w-[calc(100vw-500px)] pl-14 mx-auto">
        <div className='songcontrol flex flex-col justify-center items-center'>
          <div className="upper flex items-center gap-4">
            <button className='rounded-full h-8 w-8 object-cover object-center' onClick={props.prevSong}>
              <svg xmlns="http://www.w3.org/2000/svg" className='fill-current w-5' viewBox="0 0 16 16">
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
              </svg>
            </button>

            <button onClick={Playcurrentsong} className='bg-white rounded-full h-8 w-8 object-cover object-center'>
              <Image src={!isPlaying ? "/pause.svg" : "/play.svg"} className={`p-1 ${!isPlaying ? "object-scale-down" : "scale-150"}`} width={50} height={50} />
            </button>

            <button className='rounded-full ml-2 h-8 w-8 object-cover object-center text-white' onClick={props.nextSong}>
              <svg xmlns="http://www.w3.org/2000/svg" className='fill-current w-5' viewBox="0 0 16 16">
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
              </svg>
            </button>
          </div>

          <div className="lower flex gap-2 text-sm items-center">
            <div ref={timecompleted} className="timecompleted">0:00</div>

            <div onClick={(e)=>{handleSeekbarClick(e)}} ref={playbarref} className="playbar-scroll relative group flex items-center overflow-visible playscroll bg-stone-900 h-[5px] rounded-full w-[550px]">
              <div id='seekbar_val' ref={seekbarRef} className="seekbar w-full h-full rounded-full group-hover:rounded-e-none bg-white group-hover:bg-green-600"></div>
              <div ref={circleref} className='circle absolute -top-full z-50 group-hover:opacity-100 hover:opacity-100 opacity-0 bg-white h-4 w-4 rounded-full'></div>
            </div>
            <div className="timetocomplete">{props.songData?.[props.song]?.duration || "0:00"}</div>
          </div>
        </div>

        <div className="sound flex items-center gap-1">
          <button>
            <img src="/volume.svg" alt="volume" />
          </button>
          <input type="range" 
            name="volume" 
            id="volume" 
            className='bg-transparent text-white h-1' 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange} />
        </div>
      </div>
    </div>
  );
}

export default Playbar;
