import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAudio } from '../context/AudioContext'; 

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: TIME FORMAT ---
const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- SUB-COMPONENT: PLAYER ---
const ReceiptPlayer = ({ isPlaying, currentTime, duration, totalDuration, onToggle, onSeek, audioUrl }) => {
    const displayDuration = isPlaying ? duration : totalDuration;

    return (
        <div className="receipt-player" style={styles.playerWrapper}>
            <div style={styles.waveformLine}>
                {Array(25).fill(0).map((_, i) => (
                    <div key={i} style={{
                        ...styles.waveBar,
                        height: isPlaying ? `${Math.random() * 20 + 5}px` : '4px',
                        backgroundColor: isPlaying ? '#E60000' : '#333'
                    }} />
                ))}
            </div>
            
            <div className="controls-row" style={styles.controlsRow}>
                <button onClick={(e) => { e.stopPropagation(); onToggle(); }} style={styles.playBtn}>
                    {isPlaying ? "PAUSE" : "PLAY"}
                </button>

                {/* Download Button */}
                <a 
                    href={audioUrl} 
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.downloadBtn}
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </a>
                
                <div style={styles.scrubberContainer}>
                    <input 
                        type="range" min="0" max={displayDuration || 0} value={currentTime}
                        onChange={(e) => onSeek(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={styles.rangeInput}
                    />
                </div>
                
                <span style={styles.timeDisplay}>
                    {formatTime(currentTime)} / {formatTime(displayDuration)}
                </span>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT: TRACK LIST ---
const ReceiptTracks = ({ limit = null }) => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]); 
    const { playingId, isPlaying, currentTime, duration, toggleTrack, seek } = useAudio();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackDurations, setTrackDurations] = useState({});

    // 1. FETCH & DATA SETUP
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch('https://djkace-api.elaanyu.workers.dev');
                const data = await response.json();
                
                // --- LIMIT LOGIC ---
                const dataToUse = limit ? data.slice(0, limit) : data;

                const formatted = dataToUse.map((t, i) => ({
                    id: t.id,
                    index: i + 1,
                    title: t.title,
                    artist: t.description || "Deejay Kace",
                    bpm: Math.floor(Math.random() * (128 - 90) + 90),
                    audio: t.audio_url,
                    cover: t.image_url
                }));
                
                setTracks(formatted);
                setLoading(false);

                // Preload Metadata
                formatted.forEach(track => {
                    const audio = new Audio(track.audio);
                    audio.preload = 'metadata';
                    audio.onloadedmetadata = () => {
                        setTrackDurations(prev => ({ ...prev, [track.id]: audio.duration }));
                    };
                });
            } catch (e) { console.error(e); setLoading(false); }
        };
        fetchTracks();
    }, [limit]);

    // 2. ANIMATIONS
    useGSAP(() => {
        if (loading || tracks.length === 0) return;
        itemsRef.current = itemsRef.current.slice(0, tracks.length);

        itemsRef.current.forEach((item) => {
            if (!item) return;
            ScrollTrigger.create({
                trigger: item,
                start: "top 85%", 
                end: "bottom 15%", 
                toggleClass: { targets: item, className: "active-row" },
                onEnter: () => animateRow(item, true),
                onLeave: () => animateRow(item, false),
                onEnterBack: () => animateRow(item, true),
                onLeaveBack: () => animateRow(item, false),
            });
        });
        ScrollTrigger.refresh();
    }, { scope: containerRef, dependencies: [loading, tracks] });

    // 3. MEDIA SESSION
    useEffect(() => {
        if (!playingId || tracks.length === 0) return;
        const currentTrack = tracks.find(t => t.id === playingId);
        if (currentTrack && 'mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: "DJ Kace Archive",
                artwork: [{ src: currentTrack.cover, sizes: '512x512' }]
            });
        }
    }, [playingId, tracks]);

    const animateRow = (element, isActive) => {
        gsap.to(element, {
            scale: isActive ? 1.02 : 0.98,
            opacity: isActive ? 1 : 0.6,
            color: isActive ? "#E60000" : "#111",
            borderBottomColor: isActive ? "#E60000" : "#ccc",
            duration: 0.3,
            overwrite: 'auto',
            ease: "power2.out"
        });
        const img = element.querySelector('.track-cover');
        if(img) gsap.to(img, { filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)', scale: isActive ? 1.05 : 1, duration: 0.3 });
    };

    const addToRefs = (el) => { if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el); };

    if (loading) return <div style={styles.loader}>LOADING CRATES...</div>;

    return (
        <div ref={containerRef} style={styles.rollContainer}>
            {tracks.map((track) => (
                <div 
                    key={track.id} 
                    ref={addToRefs}
                    className="track-row"
                    style={styles.row}
                    onClick={() => toggleTrack(track)}
                >
                    <div style={styles.rowData}>
                        <div style={styles.coverWrapper}>
                            <img src={track.cover} alt={track.title} className="track-cover" style={styles.coverImage} />
                            <span style={styles.qty}>{track.index < 10 ? `0${track.index}` : track.index}</span>
                        </div>
                        <div style={styles.meta}>
                            <div className="track-title" style={styles.title}>{track.title}</div>
                            <div style={styles.artist}>{track.artist}</div>
                        </div>
                        <span style={styles.bpm}>{track.bpm}</span>
                    </div>

                    <ReceiptPlayer 
                        isPlaying={playingId === track.id && isPlaying}
                        currentTime={playingId === track.id ? currentTime : 0}
                        duration={playingId === track.id ? duration : 0}
                        totalDuration={trackDurations[track.id]} 
                        onToggle={() => toggleTrack(track)}
                        onSeek={seek}
                        audioUrl={track.audio}
                    />
                </div>
            ))}
             <style>{`
                .active-row .track-title { font-weight: 900 !important; letter-spacing: 1px; }
            `}</style>
        </div>
    );
};

// --- HARD CODED STYLES FOR LIST/PLAYER ---
const styles = {
    loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#E60000', fontFamily: 'monospace', letterSpacing: '2px' },
    rollContainer: { width: '100%', maxWidth: '600px', paddingBottom: '20px', display: 'flex', flexDirection: 'column' },
    row: { 
        display: 'flex', flexDirection: 'column', padding: '20px 5px', 
        borderBottom: '1px dashed #ccc', cursor: 'pointer', 
        transformOrigin: 'center center', width: '100%', willChange: 'transform, opacity' 
    },
    rowData: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    coverWrapper: { display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 },
    coverImage: { width: '55px', height: '55px', objectFit: 'cover', border: '1px solid #111', filter: 'grayscale(100%)', transition: 'filter 0.3s', borderRadius: '2px' },
    qty: { opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' },
    meta: { flexGrow: 1, paddingLeft: '15px', paddingRight: '10px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    title: { fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', lineHeight: '1.2' },
    artist: { fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' },
    bpm: { fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    playerWrapper: { overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px', height: 'auto' },
    waveformLine: { display: 'flex', alignItems: 'center', gap: '3px', height: '30px', marginTop: '10px', width: '100%', overflow: 'hidden' },
    waveBar: { flex: 1, borderRadius: '2px', transition: 'height 0.1s ease', minWidth: '2px' },
    controlsRow: { display: 'flex', alignItems: 'center', gap: '15px', width: '100%' },
    playBtn: { background: '#111', color: '#fff', border: 'none', padding: '8px 12px', fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 },
    downloadBtn: { background: 'transparent', border: '1px solid #111', color: '#111', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
    scrubberContainer: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    rangeInput: { width: '100%', accentColor: '#E60000', cursor: 'pointer', height: '4px' },
    timeDisplay: { fontSize: '0.75rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
};

export default ReceiptTracks;