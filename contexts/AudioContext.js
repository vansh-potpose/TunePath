'use client';
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Callback refs for external handlers
  const onEndedCallbackRef = useRef(null);
  const onErrorCallbackRef = useRef(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Attach event listeners
      const audio = audioRef.current;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime || 0);
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0);
        setIsLoading(false);
        setError(null);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        if (onEndedCallbackRef.current) {
          onEndedCallbackRef.current();
        }
      };

      const handlePlay = () => {
        setIsPlaying(true);
        setError(null);
      };

      const handlePause = () => {
        setIsPlaying(false);
      };

      const handleError = (e) => {
        setIsLoading(false);
        setIsPlaying(false);
        const errorMsg = `Audio error: ${audio.error?.message || 'Unknown error'}`;
        setError(errorMsg);
        console.error(errorMsg, e);
        if (onErrorCallbackRef.current) {
          onErrorCallbackRef.current(errorMsg);
        }
      };

      const handleLoadStart = () => {
        setIsLoading(true);
      };

      const handleCanPlay = () => {
        setIsLoading(false);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('error', handleError);
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [volume]);

  // Play a new track or resume
  const play = useCallback(async (src) => {
    if (!audioRef.current) return;

    try {
      // If src is provided and different, load new track
      if (src && src !== currentSrc) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = src;
        setCurrentSrc(src);
        setCurrentTime(0);
        setDuration(0);
        setIsLoading(true);
        setError(null);
      }

      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Play error:', err);
      setError(`Play failed: ${err.message}`);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [currentSrc]);

  // Pause playback
  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current) return;
    
    if (audioRef.current.paused) {
      await play();
    } else {
      pause();
    }
  }, [play, pause]);

  // Seek to specific time
  const seek = useCallback((time) => {
    if (!audioRef.current) return;
    const clampedTime = Math.max(0, Math.min(time, audioRef.current.duration || 0));
    audioRef.current.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, []);

  // Set volume (0 to 1)
  const setVolume = useCallback((vol) => {
    if (!audioRef.current) return;
    const clampedVol = Math.max(0, Math.min(1, vol));
    audioRef.current.volume = clampedVol;
    setVolumeState(clampedVol);
  }, []);

  // Stop and clear
  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Register callback for track ended
  const onEnded = useCallback((callback) => {
    onEndedCallbackRef.current = callback;
  }, []);

  // Register callback for errors
  const onError = useCallback((callback) => {
    onErrorCallbackRef.current = callback;
  }, []);

  const value = {
    // State
    currentSrc,
    currentTime,
    duration,
    isPlaying,
    volume,
    isLoading,
    error,
    
    // Actions
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    stop,
    onEnded,
    onError,

    // Direct audio ref for advanced use cases
    audioElement: audioRef.current,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
