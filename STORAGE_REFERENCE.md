# Storage System Quick Reference

## Overview
The storage system provides structured, type-safe localStorage management for single-user usage. All data is versioned and includes automatic migration from legacy formats.

## Storage Managers

### 1. UserPreferences
**Purpose**: User settings and music folder management

#### Methods
```javascript
import { UserPreferences } from '@/lib/storage';

// Music Folders
UserPreferences.getMusicFolders()          // Returns: string[]
UserPreferences.addMusicFolder(path)       // Add new folder
UserPreferences.removeMusicFolder(path)    // Remove folder
UserPreferences.setMusicFolders(paths)     // Replace all folders

// Default Folder
UserPreferences.getDefaultMusicFolder()    // Returns: string
UserPreferences.setDefaultMusicFolder(path) // Set default

// UI Preferences
UserPreferences.getTheme()                 // Returns: 'light' | 'dark' | 'system'
UserPreferences.setTheme(theme)
UserPreferences.getLanguage()              // Returns: string (e.g., 'en', 'es')
UserPreferences.setLanguage(lang)
```

#### Example Usage
```javascript
// Add a music folder
UserPreferences.addMusicFolder('D:/Music/Rock');

// Get all folders
const folders = UserPreferences.getMusicFolders();
// ['D:/Music/Rock', 'D:/Music/Jazz']

// Set default folder
UserPreferences.setDefaultMusicFolder('D:/Music/Rock');
```

---

### 2. PlaybackState
**Purpose**: Current playback state for resume functionality

#### Methods
```javascript
import { PlaybackState } from '@/lib/storage';

// Get All State
PlaybackState.getAll()                     // Returns entire state object

// Individual Properties
PlaybackState.getCurrentSong()             // Returns: string
PlaybackState.setCurrentSong(song)

PlaybackState.getPosition()                // Returns: number (seconds)
PlaybackState.setPosition(seconds)

PlaybackState.getVolume()                  // Returns: number (0-1)
PlaybackState.setVolume(volume)

PlaybackState.isShuffle()                  // Returns: boolean
PlaybackState.setShuffle(enabled)

PlaybackState.getRepeatMode()              // Returns: 'none' | 'all' | 'one'
PlaybackState.setRepeatMode(mode)

PlaybackState.getQueue()                   // Returns: string[]
PlaybackState.setQueue(songs)
PlaybackState.addToQueue(song)
PlaybackState.clearQueue()

PlaybackState.reset()                      // Clear all playback state
```

#### Example Usage
```javascript
// Save playback state
PlaybackState.setCurrentSong('Song.mp3');
PlaybackState.setPosition(45.2);
PlaybackState.setVolume(0.75);

// Resume playback
const state = PlaybackState.getAll();
audio.src = state.currentSong;
audio.currentTime = state.position;
audio.volume = state.volume;
```

---

### 3. Library
**Purpose**: User's music library (favorites, history)

#### Methods
```javascript
import { Library } from '@/lib/storage';

// Favorites (max 100)
Library.getFavorites()                     // Returns: Array<{song, addedAt}>
Library.addFavorite(song)                  // Add to favorites
Library.removeFavorite(song)               // Remove from favorites
Library.isFavorite(song)                   // Returns: boolean
Library.clearFavorites()

// Recently Played (max 50)
Library.getRecentlyPlayed()                // Returns: Array<{song, playedAt, playCount}>
Library.addRecentlyPlayed(song)            // Add/update play count
Library.clearRecentlyPlayed()
```

#### Example Usage
```javascript
// Add to favorites
Library.addFavorite('Amazing Song.mp3');

// Check if favorite
if (Library.isFavorite('Amazing Song.mp3')) {
  console.log('This song is a favorite!');
}

// Get all favorites
const favorites = Library.getFavorites();
// [{song: 'Amazing Song.mp3', addedAt: '2024-01-15T...'}]

// Track recently played
Library.addRecentlyPlayed('Song.mp3');

// Get history
const recent = Library.getRecentlyPlayed();
// [{song: 'Song.mp3', playedAt: '2024-01-15T...', playCount: 3}]
```

---

### 4. AppSettings
**Purpose**: Application configuration

#### Methods
```javascript
import { AppSettings } from '@/lib/storage';

// Get All Settings
AppSettings.getAll()                       // Returns entire settings object

// Individual Settings
AppSettings.isKeyboardShortcutsEnabled()   // Returns: boolean
AppSettings.setKeyboardShortcuts(enabled)

AppSettings.isNotificationsEnabled()
AppSettings.setNotifications(enabled)

AppSettings.isAutoPlayEnabled()
AppSettings.setAutoPlay(enabled)

AppSettings.getCrossfadeDuration()         // Returns: number (seconds)
AppSettings.setCrossfadeDuration(seconds)

AppSettings.isNormalizationEnabled()
AppSettings.setNormalization(enabled)

AppSettings.getQuality()                   // Returns: 'low' | 'normal' | 'high'
AppSettings.setQuality(quality)

AppSettings.reset()                        // Reset to defaults
```

#### Example Usage
```javascript
// Enable keyboard shortcuts
AppSettings.setKeyboardShortcuts(true);

// Set crossfade
AppSettings.setCrossfadeDuration(3);

// Get all settings
const settings = AppSettings.getAll();
```

---

### 5. Migration
**Purpose**: Automatic migration from old storage formats

#### Methods
```javascript
import { Migration } from '@/lib/storage';

Migration.migrateOldFormat()               // Auto-migrates old 'folderPaths' array
```

**Note**: Migration runs automatically when importing storage managers. You don't need to call it manually.

---

## Storage Keys

All data is stored in localStorage with these keys:

- `spotify_userPreferences` - User settings
- `spotify_playbackState` - Playback state
- `spotify_library` - Favorites/history
- `spotify_appSettings` - App configuration
- `spotify_storageVersion` - Version tracker

## Data Versioning

**Current Version**: `1.0.0`

Version is stored in `spotify_storageVersion` key. Future updates can check this version and run appropriate migrations.

## Data Limits

To prevent localStorage bloat:

- **Favorites**: 100 songs max
- **Recently Played**: 50 songs max

Oldest entries are automatically removed when limits are exceeded.

## Error Handling

All storage operations include try-catch blocks and return sensible defaults on error:

```javascript
// If error occurs, returns empty array
const folders = UserPreferences.getMusicFolders(); // [] on error

// If error occurs, returns null
const defaultFolder = UserPreferences.getDefaultMusicFolder(); // null on error
```

## Integration with React Context

### AppStateContext Integration

```javascript
// contexts/AppStateContext.js
import { UserPreferences, PlaybackState, Library } from '@/lib/storage';

// Load on mount
useEffect(() => {
  const defaultFolder = UserPreferences.getDefaultMusicFolder();
  setFolderPath(defaultFolder);
  
  const state = PlaybackState.getAll();
  // Resume playback with state.currentSong, state.position, etc.
}, []);

// Track song plays
const setCurrentSongWithTracking = (song) => {
  setCurrentSong(song);
  Library.addRecentlyPlayed(song);
};

// Expose in context value
return (
  <AppStateContext.Provider value={{
    // ... other state
    storage: {
      favorites: {
        get: Library.getFavorites,
        add: Library.addFavorite,
        remove: Library.removeFavorite,
        isFavorite: Library.isFavorite,
      },
      recentlyPlayed: {
        get: Library.getRecentlyPlayed,
      },
      musicFolders: {
        get: UserPreferences.getMusicFolders,
        add: UserPreferences.addMusicFolder,
        remove: UserPreferences.removeMusicFolder,
      }
    }
  }}>
    {children}
  </AppStateContext.Provider>
);
```

### Component Usage

```javascript
// components/SongCard.js
import { useAppState } from '@/contexts/AppStateContext';

function SongCard({ song }) {
  const { storage } = useAppState();
  
  const isFavorite = storage.favorites.isFavorite(song);
  
  const toggleFavorite = () => {
    if (isFavorite) {
      storage.favorites.remove(song);
    } else {
      storage.favorites.add(song);
    }
  };
  
  return (
    <div>
      <button onClick={toggleFavorite}>
        {isFavorite ? '❤️' : '🤍'}
      </button>
      {song}
    </div>
  );
}
```

## Best Practices

### ✅ DO
- Use storage managers instead of direct localStorage
- Check return values (may be null on error)
- Let migration handle old formats automatically
- Use the context API for component access

### ❌ DON'T
- Don't use `localStorage.getItem()` directly
- Don't store sensitive data (it's unencrypted)
- Don't exceed storage limits (100 favorites, 50 recent)
- Don't bypass the storage managers

## Migration from Old Code

### Before (Old Way)
```javascript
// ❌ Don't do this
const folders = JSON.parse(localStorage.getItem('folderPaths')) || [];
folders.push(newPath);
localStorage.setItem('folderPaths', JSON.stringify(folders));
```

### After (New Way)
```javascript
// ✅ Do this instead
import { UserPreferences } from '@/lib/storage';

UserPreferences.addMusicFolder(newPath);
```

## Troubleshooting

### "My old folder paths disappeared"
The migration should handle this automatically. Check:
1. Old data in localStorage key `folderPaths`
2. Migration runs on first import
3. New data in `spotify_userPreferences`

### "Favorites not saving"
Check if you've exceeded the 100 favorite limit. Oldest entries will be removed automatically.

### "Can't read storage"
Clear localStorage and refresh:
```javascript
localStorage.clear();
location.reload();
```

## Future Enhancements

Potential additions for v2.0.0:

- Import/export functionality
- Playlists management
- Custom metadata editing
- Storage encryption
- Cloud sync option
- Multiple user profiles

---

**Last Updated**: January 2024
**Version**: 1.0.0
