import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

// RENAME: Use 'PlayerContext' to avoid clashing with the browser's native 'AudioContext'
const PlayerContext = createContext();

export const useAudio = () => useContext(PlayerContext);

export const AudioProvider = ({ children }) => {
    // We keep the logic the same, just wrapped safely
    const audioRef = useRef(new Audio());
    const [playingId, setPlayingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTrackData, setCurrentTrackData] = useState(null);

    useEffect(() => {
        const audio = audioRef.current;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const onEnded = () => {
            setIsPlaying(false);
            setPlayingId(null);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, []);

    const toggleTrack = (track) => {
        const audio = audioRef.current;

        if (playingId === track.id) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio.play();
                setIsPlaying(true);
            }
            return;
        }

        audio.pause();
        audio.src = track.audio;
        audio.load();
        
        audio.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.error("Playback failed", e));
            
        setPlayingId(track.id);
        setCurrentTrackData(track);
    };

    const seek = (time) => {
        const audio = audioRef.current;
        audio.currentTime = time;
        setCurrentTime(time);
    };

    // RENDER THE PROVIDER
    return (
        <PlayerContext.Provider value={{ 
            playingId, 
            isPlaying, 
            currentTime, 
            duration, 
            toggleTrack, 
            seek,
            currentTrackData 
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;