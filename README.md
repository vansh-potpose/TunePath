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

## Getting Started

### Prerequisites
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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
