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
const ReceiptPlayer = ({ isPlaying, currentTime, duration, totalDuration, onToggle, onSeek }) => {
    const displayDuration = isPlaying ? duration : totalDuration;
    
    return (
        <div className="receipt-player" style={styles.playerWrapper}>
            <div style={styles.waveformLine}>
                {Array(20).fill(0).map((_, i) => (
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

// --- MAIN PAGE ---
const DJsPicks = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]); 
    const navigate = useNavigate();
    const { playingId, isPlaying, currentTime, duration, toggleTrack, seek } = useAudio();
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
                    bpm: Math.floor(Math.random() * (128 - 90) + 90),
                    audio: t.audio_url,
                    cover: t.image_url 
                }));
                setTracks(formatted);
                setLoading(false);

                formatted.forEach(track => {
                    const audio = new Audio(track.audio);
                    audio.preload = 'metadata'; 
                    audio.onloadedmetadata = () => {
                        setTrackDurations(prev => ({
                            ...prev,
                            [track.id]: audio.duration
                        }));
                    };
                });
            } catch (e) { console.error(e); setLoading(false); }
        };
        fetchTracks();
    }, []);

    // 2. REFRESH SCROLLTRIGGER AFTER DATA LOADS
    useEffect(() => {
        if (!loading && tracks.length > 0) {
            const timer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [loading, tracks]);

    // 3. ANIMATIONS
    useGSAP(() => {
        if (loading || tracks.length === 0) return;
        itemsRef.current = itemsRef.current.slice(0, tracks.length);

        itemsRef.current.forEach((item) => {
            if (!item) return;
            ScrollTrigger.create({
                trigger: item,
                start: "top 60%", 
                end: "bottom 40%", 
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
                artwork: [
                    { src: currentTrack.cover, sizes: '96x96' },
                    { src: currentTrack.cover, sizes: '128x128' },
                    { src: currentTrack.cover, sizes: '192x192' },
                    { src: currentTrack.cover, sizes: '256x256' },
                    { src: currentTrack.cover, sizes: '384x384' },
                    { src: currentTrack.cover, sizes: '512x512' },
                ]
            });
        }
    }, [playingId, tracks]);

    const animateRow = (element, isActive) => {
        gsap.to(element, {
            scale: isActive ? 1.02 : 1,
            opacity: isActive ? 1 : 0.6,
            color: isActive ? "#E60000" : "#111",
            borderBottomColor: isActive ? "#E60000" : "#ccc",
            duration: 0.3,
            overwrite: 'auto',
            ease: "power1.out"
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

    // --- SEO: GENERATE MUSIC SCHEMA ---
    // This tells Google exactly what tracks are on this list
    const musicSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": tracks.map((track, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "MusicRecording",
                "name": track.title,
                "byArtist": {
                    "@type": "Person",
                    "name": "DJ Kace"
                },
                "duration": trackDurations[track.id] ? `PT${Math.floor(trackDurations[track.id])}S` : undefined,
                "url": "https://djkace.com/mixes" // Replace with actual URL
            }
        }))
    };

    if (loading) return <div style={styles.loader}>PRINTING RECEIPT...</div>;

    return (
        <div ref={containerRef} style={styles.pageWrapper}>
            {/* INJECT SCHEMA */}
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
                    <span>BPM</span>
                </div>
                <div style={styles.divider}>--------------------------------</div>
            </div>

            <div style={styles.rollContainer}>
                {tracks.map((track) => {
                    return (
                        <div 
                            key={track.id} 
                            ref={addToRefs}
                            className="track-row"
                            style={styles.row}
                            onClick={() => toggleTrack(track)}
                        >
                            <div style={styles.rowData}>
                                <div style={styles.coverWrapper}>
                                    <img 
                                        src={track.cover} 
                                        alt={`Cover Art for ${track.title}`} // Improved SEO Alt
                                        className="track-cover"
                                        style={styles.coverImage} 
                                    />
                                    <span style={styles.qty}>0{track.index}</span>
                                </div>

                                <div style={styles.meta}>
                                    <div className="track-title" style={styles.title}>{track.title}</div>
                                    <div className="track-artist" style={styles.artist}>{track.artist}</div>
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
                            />
                        </div>
                    );
                })}
            </div>

            <div style={styles.receiptFooter}>
                <div style={styles.divider}>--------------------------------</div>
                <div style={styles.totalRow}>
                    <span>TOTAL ITEMS:</span>
                    <span>05</span>
                </div>
                <button onClick={() => navigate('/mixes')} style={styles.viewAllBtn} className="view-all-btn">
                    VIEW & DOWNLOAD ALL MIXES →
                </button>
                <div className="barcode" style={styles.barcode}>||| || ||| | |||| ||| || |||||</div>
                <div style={styles.thankYou}>THANK YOU FOR LISTENING</div>
            </div>

            <style>{`
                * { box-sizing: border-box; }
                .active-row .track-title { 
                    font-weight: 900 !important; 
                    letter-spacing: 1px; 
                    white-space: normal !important; 
                    overflow: visible !important;
                }
                .active-row .track-artist {
                    white-space: normal !important;
                    overflow: visible !important;
                }
                .view-all-btn:hover { background-color: #E60000 !important; color: #fff !important; }
                @media (max-width: 600px) {
                    .brand-title { font-size: 1.5rem !important; }
                    .track-title { font-size: 1rem !important; }
                    .controls-row { gap: 10px !important; }
                    .barcode { font-size: 1.5rem !important; }
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
    loader: {
        height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: '#E60000', fontFamily: 'monospace', letterSpacing: '2px'
    },
    receiptHeader: {
        textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '500px'
    },
    brandTitle: { fontSize: '2rem', fontWeight: '900', marginBottom: '5px', lineHeight: 1 },
    brandSub: { fontSize: '0.8rem', opacity: 0.6 },
    divider: { width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.3, margin: '15px 0' },
    colHeaders: {
        display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, padding: '0 5px'
    },
    rollContainer: {
        width: '100%', maxWidth: '500px', 
        paddingBottom: '20px',
        display: 'flex', flexDirection: 'column', 
        gap: '0px'
    },
    row: {
        display: 'flex', flexDirection: 'column',
        padding: '20px 5px', 
        borderBottom: '1px dashed #ccc', 
        boxShadow: 'none', 
        cursor: 'pointer',
        transformOrigin: 'center center',
        width: '100%',
        willChange: 'transform, opacity',
        position: 'relative'
    },
    rowData: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'
    },
    coverWrapper: {
        display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0
    },
    coverImage: {
        width: '55px', height: '55px', objectFit: 'cover',
        border: '1px solid #111', 
        filter: 'grayscale(100%)', 
        transition: 'filter 0.3s',
        borderRadius: '2px'
    },
    qty: { opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' },
    meta: { 
        flexGrow: 1, 
        paddingLeft: '15px', 
        paddingRight: '10px', 
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    title: { 
        fontSize: '1.2rem', 
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        marginBottom: '4px', 
        lineHeight: '1.2',
        whiteSpace: 'nowrap',         
        overflow: 'hidden',           
        textOverflow: 'ellipsis',     
        transition: 'all 0.3s ease'   
    },
    artist: { 
        fontSize: '0.8rem', 
        opacity: 0.7,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        transition: 'all 0.3s ease'
    },
    bpm: { fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    playerWrapper: {
        overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px',
        marginTop: '15px', height: 'auto', opacity: 1
    },
    waveformLine: {
        display: 'flex', alignItems: 'center', gap: '3px', height: '30px', marginTop: '10px',
        width: '100%', overflow: 'hidden'
    },
    waveBar: { flex: 1, borderRadius: '2px', transition: 'height 0.1s ease', minWidth: '2px' },
    controlsRow: { display: 'flex', alignItems: 'center', gap: '15px', width: '100%' },
    playBtn: {
        background: '#111', color: '#fff', border: 'none', padding: '8px 12px',
        fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0
    },
    scrubberContainer: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    rangeInput: { width: '100%', accentColor: '#E60000', cursor: 'pointer', height: '4px' },
    timeDisplay: { fontSize: '0.75rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
    receiptFooter: {
        textAlign: 'center', width: '100%', maxWidth: '500px', marginTop: '20px', opacity: 0.6,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    totalRow: {
        width: '100%', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '30px', padding: '0 5px'
    },
    viewAllBtn: {
        background: 'transparent', border: '2px solid #111', color: '#111', padding: '15px 30px',
        fontFamily: 'inherit', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer',
        marginBottom: '30px', transition: 'all 0.3s ease', textTransform: 'uppercase'
    },
    barcode: {
        fontFamily: '"Libre Barcode 39 Text", cursive',
        fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px'
    },
    thankYou: { fontSize: '0.8rem' }
};

export default DJsPicks;