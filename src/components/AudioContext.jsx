import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Ref for the HTML Audio Element
  const audioRef = useRef(new Audio());

  // Function to Play a Track
  const playTrack = (track) => {
    const audio = audioRef.current;

    // 1. If we are clicking the song that is ALREADY loaded
    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    // 2. New Song: Load and Play
    // IMPORTANT: We removed 'crossOrigin' to fix the playback issue
    audio.src = track.audio_url; 
    audio.load(); // Force reload
    
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error("Playback Error:", error);
          // Auto-pause if browser blocks it
          setIsPlaying(false);
        });
    }
      
    setCurrentTrack(track);
  };

  // Function to Toggle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  // Cleanup & Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    // When song finishes, update state to "Paused"
    const handleEnded = () => setIsPlaying(false);
    
    // Error listener to help debug
    const handleError = (e) => console.error("Audio Error Event:", e);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <AudioContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay }}>
      {children}
    </AudioContext.Provider>
  );
};