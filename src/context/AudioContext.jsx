import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const useAudio = () => useContext(PlayerContext);

export const AudioProvider = ({ children }) => {
    // 1. Initialize Audio Object
    const audioRef = useRef(null);
    
    // 2. Web Audio API Refs (Required for iOS Volume)
    const audioCtxRef = useRef(null);
    const gainNodeRef = useRef(null);

    // Initialize the Audio object once
    if (!audioRef.current) {
        audioRef.current = new Audio();
        // IMPORTANT: CORS must be anonymous for Web Audio API to work with external URLs
        audioRef.current.crossOrigin = "anonymous"; 
    }

    const [playingId, setPlayingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTrackData, setCurrentTrackData] = useState(null);
    const [volume, setVolumeState] = useState(1);

    useEffect(() => {
        const audio = audioRef.current;

        // --- WEB AUDIO API SETUP (Fix for iOS) ---
        // We create an AudioContext and a GainNode. The GainNode controls volume.
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            const gainNode = audioCtx.createGain();
            
            // Connect HTML Audio -> Gain Node -> Speakers
            const source = audioCtx.createMediaElementSource(audio);
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            audioCtxRef.current = audioCtx;
            gainNodeRef.current = gainNode;
            
            // Set initial volume
            gainNode.gain.value = volume;
        }

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

    // --- UPDATED VOLUME LOGIC ---
    const setVolume = (val) => {
        const newVol = parseFloat(val);
        setVolumeState(newVol);
        
        // Control the GainNode (Works on iOS)
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = newVol;
        }
        
        // Keep standard volume sync just in case, though GainNode overrides perception
        if (audioRef.current) {
            audioRef.current.volume = newVol; 
        }
    };

    const toggleTrack = (track) => {
        const audio = audioRef.current;

        // --- IOS REQUIREMENT: RESUME AUDIO CONTEXT ---
        // Browsers suspend AudioContext until user interaction. 
        // We must resume it on the click event.
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

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
        
        // Re-apply volume to GainNode to be safe
        if (gainNodeRef.current) {
            gainNodeRef.current.gain.value = volume;
        }

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
            volume,
            setVolume
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;