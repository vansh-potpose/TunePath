# Architecture Improvements

## Completed: AudioProvider Context (Priority 1)

### Overview
Implemented a centralized audio management system using React Context to replace scattered audio element handling across components.

### What Changed

#### 1. New Files Created
- **`contexts/AudioContext.js`** - Core audio provider with state management and playback controls
  - Manages single Audio element instance
  - Exposes clean API via `useAudio()` hook
  - Handles all audio events (play, pause, timeupdate, loadedmetadata, ended, error)
  - Provides: `currentSrc`, `currentTime`, `duration`, `isPlaying`, `volume`, `isLoading`, `error`
  - Actions: `play()`, `pause()`, `togglePlayPause()`, `seek()`, `setVolume()`, `stop()`
  - Callbacks: `onEnded()`, `onError()` for external event handlers

#### 2. Modified Files
- **`app/layout.js`** - Wrapped app with `<AudioProvider>`
- **`app/page.js`** - Removed local audio element state, now uses `useAudio()` hook
  - Simplified `setCurrentSong()` to just call `audio.play(url)`
  - Registered `nextSong()` callback via `audio.onEnded()`
  - Removed `currentSong` prop from components
- **`components/Playbar.js`** - Migrated to use `useAudio()` instead of `props.currentSong`
  - Play/pause button now uses `audio.isPlaying` state
  - Seek/drag now calls `audio.seek(time)`
  - Volume control now calls `audio.setVolume(vol)`
  - Progress bar updates from `audio.currentTime` and `audio.duration`
  - Removed all direct audio event listener management
- **`components/PlaylistWindow.js`** - Removed `currentSong` prop passthrough

### Benefits

#### Code Quality
- **Single Source of Truth**: All audio state lives in one place
- **No Prop Drilling**: Components access audio via hook instead of deep props
- **Predictable State**: Centralized event handling prevents race conditions
- **Easier Testing**: Can mock AudioContext in tests

#### Bug Fixes
- ✅ Fixed duration/seeking issues for songs without metadata
- ✅ Fixed race conditions between play/pause state and UI
- ✅ Fixed volume persistence across track changes
- ✅ Proper cleanup of event listeners on unmount
- ✅ Consistent error handling across all audio operations

#### Developer Experience
- Simple API: `const audio = useAudio()` gives full control
- Auto-updated state: Components re-render when audio state changes
- Error boundaries: Centralized error state and logging
- Loading states: Built-in `isLoading` for UI feedback

### Usage Example

```javascript
import { useAudio } from '@/contexts/AudioContext';

function MyComponent() {
  const audio = useAudio();

  const handlePlay = () => {
    audio.play('/api/getSong?path=...');
  };

  const handleSeek = (newTime) => {
    audio.seek(newTime);
  };

  return (
    <div>
      <p>Playing: {audio.isPlaying ? 'Yes' : 'No'}</p>
      <p>Time: {audio.currentTime} / {audio.duration}</p>
      <button onClick={handlePlay}>Play</button>
      <button onClick={audio.pause}>Pause</button>
      <button onClick={() => handleSeek(30)}>Skip to 30s</button>
    </div>
  );
}
```

### Testing Steps

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Add a folder path via profile menu (D icon)
4. Select a playlist and play a song
5. Verify:
   - ✅ Play/pause button works
   - ✅ Progress bar updates in real-time
   - ✅ Seeking by clicking seekbar works
   - ✅ Dragging seekbar works
   - ✅ Volume control works
   - ✅ Next/previous song works
   - ✅ Auto-play next song when current ends
   - ✅ Duration displays correctly (uses audio.duration when available)

### Next Priorities

#### Priority 2: Harden Server APIs
- Validate and sanitize `folderPath` input
- Restrict to configured `MUSIC_ROOT` directory
- Add proper error codes (400, 403, 404, 500)
- Return relative paths only (security)

#### Priority 3: Streaming & Range Requests
- Implement HTTP Range header support in `/api/getSong`
- Enable efficient seeking for large files
- Reduce memory usage for audio playback

#### Priority 4: Centralize App State
- Move `songData`, `playlists`, `folderPath` to Context or React Query
- Reduce prop drilling throughout app
- Add caching for playlist/song data

#### Priority 5: UI/UX Polish
- Make seek circle always visible during playback
- Add touch/mobile support for dragging
- Show loading spinner while metadata loads
- Add keyboard shortcuts (space = play/pause, arrows = seek)
- Error toast notifications

#### Priority 6: Performance
- Virtualize long song lists (react-window)
- Lazy load playlist images
- Debounce search input
- Memoize expensive calculations

#### Priority 7: Testing & CI
- Add unit tests for AudioContext
- Add component tests for Playbar
- Add API tests for server routes
- Set up GitHub Actions for CI/CD
- Add ESLint and Prettier

#### Priority 8: Observability
- Structured logging (Winston or Pino)
- Error boundaries for React components
- Optional Sentry integration
- Performance monitoring

### Migration Notes

If you need to access the raw audio element for advanced use cases:
```javascript
const audio = useAudio();
const audioElement = audio.audioElement; // Use sparingly
```

For external callbacks (like auto-playing next song):
```javascript
useEffect(() => {
  audio.onEnded(() => {
    // Your logic here
    playNextSong();
  });
}, [dependencies]);
```

### Breaking Changes
- Components can no longer receive `currentSong` prop (use `useAudio()` instead)
- Direct audio element manipulation should go through AudioContext methods
- Must wrap app with `<AudioProvider>` in layout/root

### Rollback Plan
If issues arise, you can rollback by:
1. `git revert` the AudioProvider commits
2. Restore `currentSong` state in `page.js`
3. Restore audio event listeners in `Playbar.js`

---

**Status**: ✅ Implemented and tested  
**Date**: November 1, 2025  
**Files Changed**: 5 files (1 new, 4 modified)  
**Lines Changed**: ~300 lines added, ~150 lines removed
