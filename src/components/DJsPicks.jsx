import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAudio } from '../context/AudioContext';
// SEO IMPORT
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

// --- UTILS ---
const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00"; 
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- COMPONENT: INLINE PLAYER ---
const ReceiptPlayer = ({ isPlaying, currentTime, duration, totalDuration, volume, onToggle, onSeek, onVolumeChange }) => {
    const displayDuration = isPlaying ? duration : totalDuration;
    
    return (
        <div className="receipt-player" style={styles.playerWrapper}>
            {/* 1. WAVEFORM ROW */}
            <div style={styles.waveformLine}>
                {Array(20).fill(0).map((_, i) => (
                    <div key={i} style={{
                        ...styles.waveBar,
                        height: isPlaying ? `${Math.random() * 20 + 5}px` : '4px', 
                        backgroundColor: isPlaying ? '#E60000' : '#333'
                    }} />
                ))}
            </div>

            {/* 2. CONTROLS ROW (Play, Scrubber, Time) */}
            <div className="controls-row" style={styles.controlsRow}>
                <button onClick={(e) => { e.stopPropagation(); onToggle(); }} style={styles.playBtn}>
                    {isPlaying ? "PAUSE" : "PLAY"}
                </button>
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

            {/* 3. VOLUME ROW (New separate row below controls) */}
            <div style={styles.volumeRow} onClick={(e) => e.stopPropagation()}>
                <span style={styles.volLabel}>VOLUME</span>
                <input 
                    type="range" 
                    min="0" max="1" step="0.05"
                    value={volume !== undefined ? volume : 1}
                    onChange={(e) => onVolumeChange && onVolumeChange(parseFloat(e.target.value))}
                    style={styles.volumeInput}
                />
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const DJsPicks = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]); 
    const navigate = useNavigate();
    const { playingId, isPlaying, currentTime, duration, volume, setVolume, toggleTrack, seek } = useAudio();
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackDurations, setTrackDurations] = useState({});

    // 1. FETCH DATA
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch('https://djkace-api.elaanyu.workers.dev');
                const data = await response.json();
                const limitedData = data.slice(0, 5);
                
                const formatted = limitedData.map((t, i) => ({
                    id: t.id,
                    index: i + 1,
                    title: t.title,
                    artist: t.description?.substring(0, 100) || "Deejay Kace",
                    genre: t.genre,
                    audio: t.audio_url,
                    cover: t.image_url 
                }));
                setTracks(formatted);
                setLoading(false);
                formatted.forEach(track => {
                    const audio = new Audio(track.audio);
                    audio.preload = 'metadata'; 
                    audio.onloadedmetadata = () => {
                        setTrackDurations(prev => ({...prev, [track.id]: audio.duration }));
                    };
                });
            } catch (e) { console.error(e); setLoading(false); }
        };
        fetchTracks();
    }, []);

    // 2. REFRESH SCROLLTRIGGER
    useEffect(() => {
        if (!loading && tracks.length > 0) {
            const timer = setTimeout(() => ScrollTrigger.refresh(), 200);
            return () => clearTimeout(timer);
        }
    }, [loading, tracks]);

    // 3. ANIMATIONS (GLASSMORPHISM)
    useGSAP(() => {
        if (loading || tracks.length === 0) return;
        itemsRef.current = itemsRef.current.slice(0, tracks.length);

        itemsRef.current.forEach((item) => {
            if (!item) return;
            ScrollTrigger.create({
                trigger: item,
                start: "top 65%", end: "bottom 35%", 
                toggleClass: { targets: item, className: "active-row" },
                onEnter: () => animateRow(item, true),
                onLeave: () => animateRow(item, false),
                onEnterBack: () => animateRow(item, true),
                onLeaveBack: () => animateRow(item, false),
            });
        });
    }, { scope: containerRef, dependencies: [loading, tracks] });

    // 4. MEDIA SESSION API
    useEffect(() => {
        if (!playingId || tracks.length === 0) return;
        const currentTrack = tracks.find(t => t.id === playingId);
        if (currentTrack && 'mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist,
                album: "DJ Kace Latest Mixes",
                artwork: [{ src: currentTrack.cover, sizes: '512x512' }]
            });
        }
    }, [playingId, tracks]);

    const animateRow = (element, isActive) => {
        gsap.to(element, {
            backgroundColor: isActive ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0)",
            backdropFilter: isActive ? "blur(12px)" : "blur(0px)",
            webkitBackdropFilter: isActive ? "blur(12px)" : "blur(0px)",
            borderColor: isActive ? "rgba(255, 255, 255, 0.6)" : "transparent",
            boxShadow: isActive ? "0 8px 32px 0 rgba(0, 0, 0, 0.1)" : "none",
            scale: isActive ? 1.02 : 1,
            y: isActive ? -5 : 0,
            color: isActive ? "#E60000" : "#111",
            duration: 0.5,
            ease: "power2.out"
        });

        const img = element.querySelector('.track-cover');
        if(img) {
            gsap.to(img, {
                filter: isActive ? 'grayscale(0%)' : 'grayscale(100%)', 
                scale: isActive ? 1.05 : 1,
                duration: 0.3
            });
        }
    };

    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
    };

    const musicSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": tracks.map((track, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "MusicRecording",
                "name": track.title,
                "byArtist": { "@type": "Person", "name": "DJ Kace" },
                "duration": trackDurations[track.id] ? `PT${Math.floor(trackDurations[track.id])}S` : undefined,
                "url": "https://djkace.com/mixes"
            }
        }))
    };

    if (loading) return <div style={styles.loader}>PRINTING RECEIPT...</div>;

    return (
        <div ref={containerRef} style={styles.pageWrapper}>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(musicSchema)}
                </script>
            </Helmet>

            <div style={styles.receiptHeader}>
                <div className="brand-title" style={styles.brandTitle}>DJ KACE //LATEST MIXES</div>
                <div style={styles.brandSub}>NAIROBI, KENYA • EST 2025</div>
                <div style={styles.divider}>================================</div>
                <div style={styles.colHeaders}>
                    <span>ITEM</span>
                    <span>DESCRIPTION</span>
                    <span>LENGTH</span>
                </div>
                <div style={styles.divider}>--------------------------------</div>
            </div>

            <div style={styles.rollContainer}>
                {tracks.map((track) => {
                    const isCurrentPlaying = playingId === track.id && isPlaying;
                    return (
                        <div 
                            key={track.id} 
                            ref={addToRefs}
                            className="track-row glass-row"
                            style={styles.row}
                            onClick={() => toggleTrack(track)}
                        >
                            <div style={styles.rowData}>
                                <div style={styles.coverWrapper}>
                                    <img 
                                        src={track.cover} 
                                        alt={`Cover Art for ${track.title}`} 
                                        className="track-cover"
                                        style={styles.coverImage} 
                                    />
                                    <span style={styles.qty}>0{track.index}</span>
                                </div>

                                <div style={styles.meta}>
                                    <div className="track-title" style={styles.title}>{track.title}</div>
                                    <div className="track-artist" style={styles.artist}>{track.artist}</div>
                                    <div style={styles.genre}>{track.genre}</div>
                                </div>
                                
                                <span style={styles.durationDisplay}>
                                    {formatTime(trackDurations[track.id])}
                                </span>
                            </div>

                            <ReceiptPlayer 
                                isPlaying={isCurrentPlaying}
                                currentTime={playingId === track.id ? currentTime : 0}
                                duration={playingId === track.id ? duration : 0}
                                totalDuration={trackDurations[track.id]} 
                                volume={volume}
                                onToggle={() => toggleTrack(track)}
                                onSeek={seek}
                                onVolumeChange={setVolume}
                            />
                        </div>
                    );
                })}
            </div>

            <div style={styles.receiptFooter}>
                <div style={styles.divider}>--------------------------------</div>
                <button onClick={() => navigate('/mixes')} style={styles.viewAllBtn} className="view-all-btn">
                    Download & Other mixes here →
                </button>
                <div className="barcode" style={styles.barcode}>||| || ||| | |||| ||| || |||||</div>
                <div style={styles.thankYou}>THANK YOU FOR LISTENING</div>
            </div>

            <style>{`
                * { box-sizing: border-box; }
                .track-title { 
                    white-space: nowrap; 
                    overflow: hidden; 
                    text-overflow: ellipsis; 
                }
                .active-row .track-title {
                    white-space: normal !important;
                    overflow: visible !important;
                    font-weight: 900;
                }
                .view-all-btn:hover { background-color: #E60000 !important; color: #fff !important; }
                .glass-row {
                    border: 1px solid transparent; 
                    transition: backdrop-filter 0.5s ease;
                }

                @media (max-width: 600px) {
                    .brand-title { font-size: 1.5rem !important; }
                    .track-title { font-size: 1rem !important; }
                    .receipt-player { padding: 0 5px; }
                    .track-cover { width: 50px !important; height: 50px !important; }
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const styles = {
    pageWrapper: {
        minHeight: '100vh', width: '100%', backgroundColor: '#F1E9DB', color: '#111',
        fontFamily: '"Space Mono", "Courier New", monospace',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '100px 15px', overflowX: 'hidden' 
    },
    loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#E60000' },
    receiptHeader: { textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '500px' },
    brandTitle: { fontSize: '2rem', fontWeight: '900', marginBottom: '5px', lineHeight: 1 },
    brandSub: { fontSize: '0.8rem', opacity: 0.6 },
    divider: { width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.3, margin: '15px 0' },
    colHeaders: {
        display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, padding: '0 20px'
    },
    rollContainer: {
        width: '100%', maxWidth: '500px', 
        paddingBottom: '20px',
        display: 'flex', flexDirection: 'column', 
        gap: '20px'
    },
    row: {
        display: 'flex', flexDirection: 'column',
        padding: '25px',
        backgroundColor: 'rgba(255,255,255,0)', 
        backdropFilter: 'blur(0px)',
        border: '1px solid transparent',
        boxShadow: 'none',
        borderRadius: '16px',
        cursor: 'pointer',
        width: '100%',
        willChange: 'transform, backdrop-filter, background-color',
        position: 'relative'
    },
    rowData: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    coverWrapper: { display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 },
    coverImage: {
        width: '55px', height: '55px', objectFit: 'cover',
        border: '1px solid #111', 
        filter: 'grayscale(100%)', 
        borderRadius: '4px'
    },
    qty: { opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' },
    meta: { flexGrow: 1, paddingLeft: '15px', paddingRight: '10px', minWidth: 0 },
    title: { fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', lineHeight: '1.2' },
    artist: { fontSize: '0.8rem', opacity: 0.7 },
    genre: {
        fontSize: '0.6rem',
        fontWeight: 'bold',
        marginTop: '3px',
        textTransform: 'uppercase',
        color: '#E60000',
        letterSpacing: '1px'
    },
    durationDisplay: { fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    playerWrapper: { overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
    waveformLine: { display: 'flex', alignItems: 'center', gap: '3px', height: '30px', marginTop: '10px', width: '100%', overflow: 'hidden' },
    waveBar: { flex: 1, borderRadius: '2px', transition: 'height 0.1s ease', minWidth: '2px' },
    
    controlsRow: { display: 'flex', alignItems: 'center', gap: '15px', width: '100%' },
    playBtn: { background: '#111', color: '#fff', border: 'none', padding: '8px 12px', fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0, borderRadius: '4px' },
    scrubberContainer: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    rangeInput: { width: '100%', accentColor: '#E60000', cursor: 'pointer', height: '4px' },
    timeDisplay: { fontSize: '0.75rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
    
    // --- UPDATED VOLUME ROW STYLES ---
    volumeRow: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', // Center it nicely
        gap: '10px', 
        width: '100%',
        marginTop: '5px',
        paddingTop: '10px',
        borderTop: '1px dashed rgba(0,0,0,0.1)' // Adds a nice receipt separator line
    },
    volLabel: { fontSize: '0.65rem', fontWeight: 'bold', opacity: 0.8 },
    volumeInput: { width: '150px', accentColor: '#333', cursor: 'pointer', height: '3px' },

    receiptFooter: { textAlign: 'center', width: '100%', maxWidth: '500px', marginTop: '20px', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    totalRow: { width: '100%', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '30px', padding: '0 5px' },
    viewAllBtn: { background: 'transparent', border: '2px solid #111', color: '#111', padding: '15px 30px', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '30px', transition: 'all 0.3s ease', textTransform: 'uppercase' },
    barcode: { fontFamily: '"Libre Barcode 39 Text", cursive', fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px' },
    thankYou: { fontSize: '0.8rem' }
};

export default DJsPicks;