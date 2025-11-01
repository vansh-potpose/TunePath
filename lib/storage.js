/**
 * Local Storage Manager for Single User
 * Provides a centralized, structured approach to storing user preferences and app state
 */

const STORAGE_VERSION = '1.0.0';
const STORAGE_KEY_PREFIX = 'spotify_clone_';

// Storage keys
const KEYS = {
  USER_PREFERENCES: `${STORAGE_KEY_PREFIX}user_preferences`,
  PLAYBACK_STATE: `${STORAGE_KEY_PREFIX}playback_state`,
  LIBRARY: `${STORAGE_KEY_PREFIX}library`,
  RECENT_ACTIVITY: `${STORAGE_KEY_PREFIX}recent_activity`,
  APP_SETTINGS: `${STORAGE_KEY_PREFIX}app_settings`,
};

/**
 * Safe localStorage wrapper with error handling
 */
class StorageManager {
  constructor() {
    this.isAvailable = this._checkAvailability();
  }

  _checkAvailability() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.error('localStorage is not available:', e);
      return false;
    }
  }

  get(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  set(key, value) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  }

  remove(key) {
    if (!this.isAvailable) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  clear() {
    if (!this.isAvailable) return;
    
    try {
      // Only clear app-specific keys
      Object.values(KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

const storage = new StorageManager();

/**
 * User Preferences Manager
 */
export const UserPreferences = {
  getAll() {
    return storage.get(KEYS.USER_PREFERENCES, {
      version: STORAGE_VERSION,
      musicFolderPaths: [],
      defaultMusicFolder: null,
      theme: 'dark',
      language: 'en',
    });
  },

  save(preferences) {
    const current = this.getAll();
    const updated = { ...current, ...preferences, version: STORAGE_VERSION };
    return storage.set(KEYS.USER_PREFERENCES, updated);
  },

  getMusicFolders() {
    const prefs = this.getAll();
    return prefs.musicFolderPaths || [];
  },

  addMusicFolder(path) {
    const prefs = this.getAll();
    const folders = prefs.musicFolderPaths || [];
    
    if (!folders.includes(path)) {
      folders.push(path);
      prefs.musicFolderPaths = folders;
      
      // Set as default if it's the first folder
      if (!prefs.defaultMusicFolder) {
        prefs.defaultMusicFolder = path;
      }
      
      return this.save(prefs);
    }
    return false;
  },

  removeMusicFolder(path) {
    const prefs = this.getAll();
    const folders = prefs.musicFolderPaths || [];
    const index = folders.indexOf(path);
    
    if (index > -1) {
      folders.splice(index, 1);
      prefs.musicFolderPaths = folders;
      
      // Update default if removed
      if (prefs.defaultMusicFolder === path) {
        prefs.defaultMusicFolder = folders[0] || null;
      }
      
      return this.save(prefs);
    }
    return false;
  },

  getDefaultMusicFolder() {
    const prefs = this.getAll();
    return prefs.defaultMusicFolder || prefs.musicFolderPaths?.[0] || null;
  },

  setDefaultMusicFolder(path) {
    const prefs = this.getAll();
    prefs.defaultMusicFolder = path;
    return this.save(prefs);
  },
};

/**
 * Playback State Manager
 */
export const PlaybackState = {
  getAll() {
    return storage.get(KEYS.PLAYBACK_STATE, {
      currentSong: null,
      currentPlaylist: null,
      volume: 0.5,
      isShuffle: false,
      repeatMode: 'off', // 'off', 'all', 'one'
      position: 0,
      queue: [],
    });
  },

  save(state) {
    const current = this.getAll();
    const updated = { ...current, ...state };
    return storage.set(KEYS.PLAYBACK_STATE, updated);
  },

  savePosition(songUrl, position) {
    const state = this.getAll();
    state.currentSong = songUrl;
    state.position = position;
    return this.save(state);
  },

  saveVolume(volume) {
    const state = this.getAll();
    state.volume = volume;
    return this.save(state);
  },

  clear() {
    storage.remove(KEYS.PLAYBACK_STATE);
  },
};

/**
 * Library Manager (Playlists & Favorites)
 */
export const Library = {
  getAll() {
    return storage.get(KEYS.LIBRARY, {
      playlists: [],
      favorites: [],
      recentlyPlayed: [],
    });
  },

  save(library) {
    const current = this.getAll();
    const updated = { ...current, ...library };
    return storage.set(KEYS.LIBRARY, updated);
  },

  // Favorites
  getFavorites() {
    const library = this.getAll();
    return library.favorites || [];
  },

  addFavorite(songUrl, songName, playlistName) {
    const library = this.getAll();
    const favorites = library.favorites || [];
    
    const exists = favorites.find(fav => fav.songUrl === songUrl);
    if (!exists) {
      favorites.unshift({
        songUrl,
        songName,
        playlistName,
        addedAt: new Date().toISOString(),
      });
      
      // Keep only last 100 favorites
      library.favorites = favorites.slice(0, 100);
      return this.save(library);
    }
    return false;
  },

  removeFavorite(songUrl) {
    const library = this.getAll();
    const favorites = library.favorites || [];
    library.favorites = favorites.filter(fav => fav.songUrl !== songUrl);
    return this.save(library);
  },

  isFavorite(songUrl) {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.songUrl === songUrl);
  },

  // Recently Played
  getRecentlyPlayed() {
    const library = this.getAll();
    return library.recentlyPlayed || [];
  },

  addRecentlyPlayed(songUrl, songName, playlistName) {
    const library = this.getAll();
    const recent = library.recentlyPlayed || [];
    
    // Remove if already exists
    const filtered = recent.filter(item => item.songUrl !== songUrl);
    
    // Add to front
    filtered.unshift({
      songUrl,
      songName,
      playlistName,
      playedAt: new Date().toISOString(),
    });
    
    // Keep only last 50
    library.recentlyPlayed = filtered.slice(0, 50);
    return this.save(library);
  },
};

/**
 * App Settings Manager
 */
export const AppSettings = {
  getAll() {
    return storage.get(KEYS.APP_SETTINGS, {
      enableKeyboardShortcuts: true,
      enableNotifications: false,
      autoPlay: false,
      crossfadeDuration: 0,
      normalizeVolume: false,
      showVisualizer: false,
    });
  },

  save(settings) {
    const current = this.getAll();
    const updated = { ...current, ...settings };
    return storage.set(KEYS.APP_SETTINGS, updated);
  },

  get(key, defaultValue = null) {
    const settings = this.getAll();
    return settings[key] !== undefined ? settings[key] : defaultValue;
  },

  set(key, value) {
    const settings = this.getAll();
    settings[key] = value;
    return this.save(settings);
  },
};

/**
 * Migration helper for old storage format
 */
export const Migration = {
  migrateOldFormat() {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
      // Migrate old folderPaths to new structure
      const oldPaths = JSON.parse(localStorage.getItem('folderPaths') || '[]');
      if (oldPaths.length > 0) {
        const prefs = UserPreferences.getAll();
        if (prefs.musicFolderPaths.length === 0) {
          prefs.musicFolderPaths = oldPaths;
          prefs.defaultMusicFolder = oldPaths[0];
          UserPreferences.save(prefs);
          
          // Remove old key
          localStorage.removeItem('folderPaths');
          console.log('Migrated old folder paths to new storage structure');
        }
      }
    } catch (error) {
      console.error('Error during storage migration:', error);
    }
  },
};

// Run migration on module load only in browser
if (typeof window !== 'undefined') {
  Migration.migrateOldFormat();
}

export default {
  UserPreferences,
  PlaybackState,
  Library,
  AppSettings,
  KEYS,
  storage,
};
