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

## Getting Started

### Prerequisites

Make sure you have the following:
- Node.js (version 12 or higher)
- npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/tunepath.git
    cd tunepath
    ```

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
