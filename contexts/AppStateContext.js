'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserPreferences, PlaybackState, Library } from '@/lib/storage';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [folderPath, setFolderPathState] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [songData, setSongData] = useState({});
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);

  // Load folder path from new storage structure on mount
  useEffect(() => {
    try {
      const defaultFolder = UserPreferences.getDefaultMusicFolder();
      if (defaultFolder) {
        setFolderPathState(defaultFolder);
        console.log('Loaded folder path:', defaultFolder);
      } else {
        console.log('No default music folder configured.');
      }
    } catch (error) {
      console.error('Error loading folder path:', error);
      setFolderPathState('');
    }
  }, []);

  // Load last playback state
  useEffect(() => {
    try {
      const playbackState = PlaybackState.getAll();
      if (playbackState.currentPlaylist) {
        setCurrentPlaylist(playbackState.currentPlaylist);
      }
    } catch (error) {
      console.error('Error loading playback state:', error);
    }
  }, []);

  // Fetch playlists when folder path changes
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!folderPath) {
        console.log('No folder path available, skipping playlist fetch');
        setPlaylists([]);
        return;
      }

      try {
        console.log('Fetching playlists for path:', folderPath);
        const res = await fetch(`/api/getFolders?folderPath=${encodeURIComponent(folderPath)}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch playlists: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Fetched playlists:', data.folders);
        setPlaylists(data.folders || []);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setPlaylists([]);
      }
    };

    fetchPlaylists();
  }, [folderPath]);

  const setFolderPath = useCallback((path) => {
    console.log('Setting folder path:', path);
    setFolderPathState(path);
    
    // Save as default folder
    UserPreferences.setDefaultMusicFolder(path);
    
    // Add to music folders if not already there
    UserPreferences.addMusicFolder(path);
  }, []);

  const setCurrentSongWithTracking = useCallback((songUrl, songName, playlistName) => {
    setCurrentSong(songUrl);
    
    // Track in recently played
    if (songUrl && songName) {
      Library.addRecentlyPlayed(songUrl, songName, playlistName || 'Unknown');
    }
    
    // Save playback state
    PlaybackState.save({
      currentSong: songUrl,
      currentPlaylist: currentPlaylist?.name || playlistName,
    });
  }, [currentPlaylist]);

  const value = {
    // State
    folderPath,
    playlists,
    songs,
    songData,
    currentPlaylist,
    currentSong,
    
    // Setters
    setFolderPath,
    setPlaylists,
    setSongs,
    setSongData,
    setCurrentPlaylist,
    setCurrentSong: setCurrentSongWithTracking,
    
    // Storage utilities (exposed for components)
    storage: {
      favorites: {
        get: Library.getFavorites,
        add: Library.addFavorite,
        remove: Library.removeFavorite,
        isFavorite: Library.isFavorite,
      },
      recentlyPlayed: Library.getRecentlyPlayed,
      musicFolders: {
        getAll: UserPreferences.getMusicFolders,
        add: UserPreferences.addMusicFolder,
        remove: UserPreferences.removeMusicFolder,
      },
    },
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
