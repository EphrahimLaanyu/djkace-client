import React, { createContext, useContext, useState, useRef, useEffect } from 'react';


// RENAME: Use 'PlayerContext' to avoid clashing with the browser's native 'AudioContext'
const PlayerContext = createContext();


export const useAudio = () => useContext(PlayerContext);


export const AudioProvider = ({ children }) => {
    const audioRef = useRef(new Audio());
    const [playingId, setPlayingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTrackData, setCurrentTrackData] = useState(null);
   
    // --- ADDED: Volume State (Default 1.0 = 100%) ---
    const [volume, setVolumeState] = useState(1);


    useEffect(() => {
        const audio = audioRef.current;
       
        // Ensure volume is set on mount
        audio.volume = volume;


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
    }, []); // Empty dependency array is fine here


    // --- ADDED: Volume Control Function ---
    const setVolume = (val) => {
        const newVol = parseFloat(val);
        setVolumeState(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };


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


        // --- NEW TRACK LOGIC ---
        audio.pause();
        audio.src = track.audio;
        audio.load();
        audio.volume = volume; // Ensure volume persists on track change
       
        // --- ADDED: TRACK PLAY COUNT ---
        fetch(`https://djkace-api.elaanyu.workers.dev/tracks/${track.id}/play`, {
            method: 'POST'
        }).catch(err => console.error("Analytics Error:", err));
       
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


    return (
        <PlayerContext.Provider value={{
            playingId,
            isPlaying,
            currentTime,
            duration,
            toggleTrack,
            seek,
            currentTrackData,
            // --- EXPORT NEW PROPS ---
            volume,
            setVolume
        }}>
            {children}
        </PlayerContext.Provider>
    );
};


export default PlayerContext;

