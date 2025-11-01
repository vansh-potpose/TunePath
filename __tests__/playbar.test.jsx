import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Playbar from '@/components/Playbar';

class AudioMock {
  constructor() {
    this.volume = 0.5;
    this.currentTime = 0;
    this.paused = true;
    this._listeners = {};
  }
  addEventListener(event, cb) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(cb);
  }
  removeEventListener(event, cb) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter((f) => f !== cb);
  }
  play() {
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
}

describe('Playbar', () => {
  const song = 'song1.mp3';
  const songData = {
    [song]: {
      title: 'Test Title',
      artist: 'Test Artist',
      duration: '3:15',
      imageUrl: '/music.svg',
    },
  };

  test('renders title, artist and duration from metadata', () => {
    const audio = new AudioMock();
    render(
      <Playbar
        song={song}
        songData={songData}
        currentSong={audio}
        nextSong={jest.fn()}
        prevSong={jest.fn()}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('3:15')).toBeInTheDocument();
  });

  test('play/pause toggles paused state', async () => {
    const audio = new AudioMock();
    render(
      <Playbar
        song={song}
        songData={songData}
        currentSong={audio}
        nextSong={jest.fn()}
        prevSong={jest.fn()}
      />
    );

    // second button is the play/pause toggle in the control group
    const buttons = screen.getAllByRole('button');
    const playPause = buttons[1];

    expect(audio.paused).toBe(true);
    fireEvent.click(playPause);
    expect(audio.paused).toBe(false);
    fireEvent.click(playPause);
    expect(audio.paused).toBe(true);
  });
});
