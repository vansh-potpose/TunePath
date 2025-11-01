<<<<<<< HEAD
# Spotify Clone - Local Music Player

A full-featured local music player built with Next.js that mimics Spotify's UI/UX. Play your local music files with a beautiful, responsive interface optimized for single-user desktop usage.

## Features

### Core Functionality
- 🎵 **Local Music Playback** - Play MP3/audio files from your computer
- 📁 **Multi-Folder Support** - Manage multiple music library folders
- 🎨 **Spotify-like UI** - Familiar, polished interface
- ⚡ **Fast Performance** - Optimized with memoization and lazy loading
- 💾 **Persistent State** - Resume playback, remember preferences
- 📊 **Activity Tracking** - Recently played songs and favorites

### Playback Controls
- ▶️ Play/Pause, Next/Previous track
- 🔊 Volume control
- ⏩ Seekbar with progress indicator
- 🔁 Repeat modes
- 🔀 Shuffle mode
- 📋 Queue management

### Library Management
- 📂 Browse playlists/folders
- 🔍 Search functionality
- ⭐ Favorites system (100 song limit)
- 🕒 Recently played (50 song limit)
- 🖼️ Album art display with lazy loading

## Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **React**: 18.3.1
- **Styling**: Tailwind CSS
- **Audio Metadata**: music-metadata-browser
- **State Management**: React Context API
- **Storage**: localStorage (structured with managers)
=======
# TunePath

TunePath is a lightweight music player built with Next.js that allows users to easily play offline songs. By specifying a folder path, TunePath fetches the songs and provides an intuitive user interface for seamless audio playback from local files.

## Features

- **Offline Playback**: Play songs directly from your local folders without needing an internet connection.
- **Folder Path Input**: Easily select a folder, and TunePath will fetch all the audio files within it.
- **User-Friendly Interface**: Intuitive UI for playing, pausing, and skipping tracks.
- **Playlist Image Support**: Display a playlist image if an image file is present in the folder containing the songs.
- **Next.js Powered**: Built with Next.js for fast rendering and efficient performance.
- **Web Audio API**: Uses the Web Audio API for smooth playback and control of songs.

## Technologies Used

- **Next.js**: For server-side rendering and overall framework.
- **React.js**: For building the user interface components.
- **JavaScript (ES6+)**: For handling the logic and interactions.
- **File System (fs)**: For accessing and reading files from local directories.
- **HTML/CSS**: For designing and styling the user interface.
- **Web Audio API**: For handling audio playback directly in the browser.
>>>>>>> b1998bf260a6842dfbb10cb1be53231cc3dd3c91

## Getting Started

### Prerequisites
<<<<<<< HEAD
- Node.js 18+ 
- npm/yarn/pnpm/bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd spotify-clone

# Install dependencies
npm install

# Run development server

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Initial Setup

1. Click the user icon (top right)
2. Add your music folder path(s)
3. Browse and play your music!

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design decisions
- [PERFORMANCE_OPTIMIZATIONS.md](./PERFORMANCE_OPTIMIZATIONS.md) - Performance improvements guide

## Improvement Roadmap

### Completed ✅ (8/9)
1. ✅ Event propagation fixes
2. ✅ AudioProvider implementation
3. ✅ AppStateContext creation
4. ✅ API route hardening
5. ✅ HTTP streaming & range requests
6. ✅ UI/UX improvements
7. ✅ Observability (logging, error boundaries)
8. ✅ Performance optimizations

### In Progress ⏳ (1/9)
9. ⏳ Testing & CI
=======

Make sure you have the following:
- Node.js (version 12 or higher)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/tunepath.git
    cd tunepath
    ```
>>>>>>> b1998bf260a6842dfbb10cb1be53231cc3dd3c91

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

4. Access the app in your browser at `http://localhost:3000`.

### Usage

1. Input a folder path containing your songs.
2. Ensure that the folder includes an image file (e.g., `cover.jpg`) if you want to display a playlist image.
3. The app will fetch all audio files from the folder and allow you to play, pause, and skip tracks using the UI.

## License

This project is licensed under the MIT License.
