'use client'
import React, { useState, useEffect, useCallback } from 'react'
import Hoverbtn from './Hoverbtn'
import PlaylistBtn from '@/components/PlaylistBtn'
import { useAppState } from '@/contexts/AppStateContext'
import { UserPreferences } from '@/lib/storage'

const Sidebar = () => {
  const { playlists, setCurrentPlaylist, folderPath, setFolderPath } = useAppState();
  const [showingFolderDialog, setShowingFolderDialog] = useState(false);
  const [folderPaths, setFolderPaths] = useState([]);
  const [newPath, setNewPath] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const handlePlaylistClick = (playlist) => {
    setCurrentPlaylist(playlist);
    console.log('Selected Playlist by sidebar:', playlist);
  };

  const handleMouseEnter = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [timeoutId]);

  const handleMouseLeave = useCallback(() => {
    const id = setTimeout(() => {
      setShowingFolderDialog(false);
    }, 1000); 
    setTimeoutId(id);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  useEffect(() => {
    try {
      const storedPaths = UserPreferences.getMusicFolders();
      setFolderPaths(storedPaths);
      // If no folderPath yet, select the default one
      if (!folderPath && storedPaths.length > 0) {
        const defaultPath = UserPreferences.getDefaultMusicFolder() || storedPaths[0];
        setFolderPath(defaultPath);
      }
    } catch (err) {
      console.error('Failed to read music folders', err);
      setFolderPaths([]);
    }
  }, [folderPath, setFolderPath]);

  const toggleFolderDialog = useCallback(() => {
    setShowingFolderDialog(!showingFolderDialog);
    // Load fresh folder paths when opening
    if (!showingFolderDialog) {
      const storedPaths = UserPreferences.getMusicFolders();
      setFolderPaths(storedPaths);
    }
  }, [showingFolderDialog]);

  const addFolderPath = useCallback(() => {
    const trimmed = newPath.trim();
    if (trimmed === "") {
      alert("Please enter a valid folder path");
      return;
    }
    
    // Check if path already exists
    const existingPaths = UserPreferences.getMusicFolders();
    if (existingPaths.includes(trimmed)) {
      alert("This folder path already exists!");
      return;
    }
    
    // Add to storage
    UserPreferences.addMusicFolder(trimmed);
    
    // Update local state
    const updatedPaths = UserPreferences.getMusicFolders();
    setFolderPaths(updatedPaths);
    
    setFolderPath(trimmed); // Set the new path as current folder path
    setNewPath(""); 
    // Keep dialog open to allow adding more folders
  }, [newPath, setFolderPath]);

  const browseFolderPath = useCallback(async () => {
    try {
      // Use the File System Access API (modern browsers)
      if ('showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        setNewPath(dirHandle.name); // This will show the folder name
        // Note: Full path access is restricted in browsers for security
        // You might want to use Electron or a file input for full paths
      } else {
        alert("Your browser doesn't support the directory picker. Please enter the path manually.");
      }
    } catch (err) {
      // User cancelled or error occurred
      if (err.name !== 'AbortError') {
        console.error('Error selecting folder:', err);
      }
    }
  }, []);

  const handlePathChange = useCallback((e) => {
    setNewPath(e.target.value); 
  }, []);

  const deleteFolderPath = useCallback((path, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${path}"?`);
    if (confirmDelete) {
      // Remove from storage
      UserPreferences.removeMusicFolder(path);
      
      // Update local state
      const updatedPaths = UserPreferences.getMusicFolders();
      setFolderPaths(updatedPaths);
      
      // If the deleted path was the current one, set to default or first
      if (folderPath === path) {
        const newPath = UserPreferences.getDefaultMusicFolder() || updatedPaths[0] || '';
        setFolderPath(newPath);
      }
    }
  }, [folderPath, setFolderPath]);
  

  return (
    <div className='min-w-80 relative'>
      <div className='bg-[#121212] p-5 flex flex-col gap-4 m-2 rounded-lg'>
        <div onClick={() => handlePlaylistClick(null)}>
          <Hoverbtn path='M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z' text='Home' />
        </div>
        
        <div className='relative'>
          <div onClick={toggleFolderDialog}>
            <Hoverbtn 
              path='M3.75 3A1.75 1.75 0 0 0 2 4.75v3.5C2 9.216 2.784 10 3.75 10h3.5A1.75 1.75 0 0 0 9 8.25v-3.5A1.75 1.75 0 0 0 7.25 3h-3.5zm0 7A1.75 1.75 0 0 0 2 11.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 9 15.25v-3.5A1.75 1.75 0 0 0 7.25 10h-3.5zm7-7A1.75 1.75 0 0 0 9 4.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 16 8.25v-3.5A1.75 1.75 0 0 0 14.25 3h-3.5zm0 7A1.75 1.75 0 0 0 9 11.75v3.5c0 .966.784 1.75 1.75 1.75h3.5A1.75 1.75 0 0 0 16 15.25v-3.5A1.75 1.75 0 0 0 14.25 10h-3.5z' 
              text='Manage Music Folders' 
            />
          </div>
          
          {showingFolderDialog && (
            <div 
              className="absolute top-0 left-full ml-2 flex flex-col bg-[#282828] border border-stone-600 p-5 rounded-xl w-[420px] z-50 shadow-2xl"
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Music Folders</h3>
                <button 
                  onClick={() => setShowingFolderDialog(false)}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <label className="text-stone-400 text-sm mb-2 block">Add New Folder</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-[#3e3e3e] border border-stone-600 focus:border-green-500 outline-none rounded-lg p-3 px-4 text-white text-sm transition-colors"
                    placeholder="e.g., D:\Music or /home/user/Music"
                    value={newPath}
                    onChange={handlePathChange}
                    onKeyDown={(e) => { if (e.key === 'Enter') { addFolderPath(); } }}
                  />
                  <button 
                    className='bg-stone-600 hover:bg-stone-500 text-white p-3 rounded-lg transition-colors'
                    onClick={browseFolderPath}
                    title="Browse for folder"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z"/>
                    </svg>
                  </button>
                </div>
                <button 
                  className='w-full mt-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-lg transition-colors'
                  onClick={addFolderPath}
                >
                  Add Folder
                </button>
              </div>

              <div className="border-t border-stone-600 pt-4">
                <p className='text-stone-400 text-sm mb-3 flex items-center justify-between'>
                  <span>Saved Folders ({folderPaths.length})</span>
                  {folderPaths.length > 0 && (
                    <span className="text-xs text-stone-500">Click to select</span>
                  )}
                </p>
                {folderPaths.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-stone-600" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
                    </svg>
                    <p className='text-stone-500 text-sm'>No folders added yet</p>
                    <p className='text-stone-600 text-xs mt-1'>Add a folder to get started</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {folderPaths.map((path, index) => (
                      <li
                        key={index}
                        className={`group text-white cursor-pointer flex justify-between items-center p-3 rounded-lg transition-all ${
                          folderPath === path 
                            ? 'bg-green-600 bg-opacity-20 border border-green-600' 
                            : 'bg-[#3e3e3e] hover:bg-[#4a4a4a] border border-transparent'
                        }`}
                        onClick={() => {
                          console.log('Switching to folder path:', path);
                          setFolderPath(path);
                          setShowingFolderDialog(false);
                        }}
                      >
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                          <svg className={`w-5 h-5 flex-shrink-0 ${folderPath === path ? 'text-green-500' : 'text-stone-400'}`} fill="currentColor" viewBox="0 0 16 16">
                            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3z"/>
                          </svg>
                          <div className='min-w-0 flex-1'>
                            <p className='text-sm truncate'>{path}</p>
                            {folderPath === path && (
                              <span className="text-xs text-green-400">● Active</span>
                            )}
                          </div>
                        </div>
                        <button
                          className="ml-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFolderPath(path, e);
                          }}
                          title="Delete this folder"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='bg-[#121212] px-2 py-3 flex flex-col gap-4 m-2 mb-0 rounded-lg h-[calc(100vh-200px)]'>
        <div className="options flex pl-3 justify-between">
          <Hoverbtn path='M4 6h16M4 12h16m-7 6h7' text='Your Library' />
          <button className='rounded-full p-2 hover:text-white text-[#b3b3b3] hover:bg-stone-400 hover:bg-opacity-15'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox="0 0 16 16" fill='none' stroke='currentColor' className='h-4 w-4'><path d="M15.25 8a.75.75 0 0 1-.75.75H8.75v5.75a.75.75 0 0 1-1.5 0V8.75H1.5a.75.75 0 0 1 0-1.5h5.75V1.5a.75.75 0 0 1 1.5 0v5.75h5.75a.75.75 0 0 1 .75.75z"></path></svg>
          </button>
        </div>
        <div className='playlists overflow-y-auto'>
          { !playlists ||playlists.length === 0
           ? <p className='text-[#b3b3b3] text-sm'>No Playlists</p> : 
          playlists.map((playlist, index) => (
            <PlaylistBtn 
              key={index} 
              playlist={playlist}
              cover={playlist.image} 
              name={playlist.name.split("-")[0]} 
              creator={playlist.name.split("-")[1]} 
              onClick={() => handlePlaylistClick(playlist)} 
            />
          ))
          }
        </div>

      </div>
    </div>
  )
}

export default Sidebar
  