import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAudio } from '../context/AudioContext'; 
// IMPORT FOOTER & NAVBAR
import Footer from './Footer';
import Navbar from '../components/Navbar';
// IMPORT SEO
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

// --- UTILS ---
const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- COMPONENT: INLINE PLAYER ---
const ReceiptPlayer = ({ id, isPlaying, currentTime, duration, totalDuration, onToggle, onSeek, audioUrl, title }) => {
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

                <a 
                    href={audioUrl} 
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.downloadBtn}
                    title="Download Mix"
                    onClick={async (e) => {
                        e.stopPropagation();
                        
                        // --- TRACK DOWNLOAD COUNT ---
                        fetch(`https://djkace-api.elaanyu.workers.dev/tracks/${id}/download`, { 
                            method: 'POST' 
                        }).catch(err => console.error("Analytics Error:", err));
                        // ----------------------------

                        e.preventDefault();
                        try {
                            const response = await fetch(audioUrl);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            
                            const safeTitle = title ? title.replace(/[^a-z0-9 ]/gi, '') : `Mix_${Date.now()}`;
                            link.download = `DJ Kace - ${safeTitle}.mp3`;
                            
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                        } catch (err) {
                            console.error("Download failed", err);
                            window.open(audioUrl, '_blank');
                        }
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

// --- COMPONENT: INFINITE MARQUEE ---
const MarqueeBand = () => {
    const marqueeRef = useRef(null);

    useGSAP(() => {
        const marqueeTween = gsap.to(".marquee-content", {
            xPercent: -100, 
            repeat: -1,
            duration: 20, 
            ease: "none",
        });
    
        const marqueeContainer = marqueeRef.current;
        if (marqueeContainer) {
            marqueeContainer.addEventListener("mouseenter", () => gsap.to(marqueeTween, { timeScale: 0.2, duration: 0.5 }));
            marqueeContainer.addEventListener("mouseleave", () => gsap.to(marqueeTween, { timeScale: 1, duration: 0.5 }));
        }
    }, { scope: marqueeRef });

    return (
        <div style={styles.marqueeBand} ref={marqueeRef}>
            <div style={styles.marqueeTrack}>
                <span className="marquee-content" style={styles.marqueeText}>
                    THANKS FOR VIBING • KEEP THE MUSIC LOUD • DEEJAY KACE • NAIROBI'S FINEST • ENJOY THE SITE • ALL RIGHTS RESERVED •&nbsp;
                </span>
                <span className="marquee-content" style={styles.marqueeText}>
                    THANKS FOR VIBING • KEEP THE MUSIC LOUD • DEEJAY KACE • NAIROBI'S FINEST • ENJOY THE SITE • ALL RIGHTS RESERVED •&nbsp;
                </span>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const Mixes = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]); 
    const navigate = useNavigate();
    
    const { playingId, isPlaying, currentTime, duration, toggleTrack, seek } = useAudio();
    
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackDurations, setTrackDurations] = useState({});

    // --- SCROLL TO TOP ON MOUNT ---
    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // --- FETCH ---
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch('https://djkace-api.elaanyu.workers.dev');
                const data = await response.json();
                
                const formatted = data.map((t, i) => ({
                    id: t.id,
                    index: i + 1,
                    title: t.title,
                    artist: t.description || "Deejay Kace",
                    genre: t.genre, // ADDED GENRE HERE
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

    // --- SCROLL ANIMATION (GLASSMORPHISM) ---
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
    }, { scope: containerRef, dependencies: [loading, tracks] });

    // MEDIA SESSION API (Lock Screen)
    useEffect(() => {
        if (!playingId || tracks.length === 0) return;

        const currentTrack = tracks.find(t => t.id === playingId);
        
        if (currentTrack && 'mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.artist.length > 50 ? currentTrack.artist.substring(0, 50) + "..." : currentTrack.artist,
                album: "DJ Kace Archive",
                artwork: [
                    { src: currentTrack.cover, sizes: '512x512' },
                ]
            });
        }
    }, [playingId, tracks]);

    const animateRow = (element, isActive) => {
        gsap.to(element, {
            // Glassmorphism logic
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

    if (loading) return <div style={styles.loader}>LOADING ARCHIVE...</div>;

    return (
        <div style={styles.mainContainer}>
            {/* --- ADDED NAVBAR HERE --- */}
            {/* <Navbar /> */}

            {/* SEO TAGS */}
            <SEO 
                title="Mixes" 
                description="Stream and download the hottest DJ Kace mixes. Featuring the best of Afrobeat, Dancehall, and Hip Hop in Kenya." 
                url="https://deejaykace.co.ke/mixes"
            />

            {/* MIXES CONTENT */}
            <div ref={containerRef} style={styles.pageWrapper}>
                <div style={styles.receiptHeader}>
                    <button onClick={() => navigate('/')} style={styles.backBtn}>
                        ← RETURN TO HOME
                    </button>
                    <div className="brand-title" style={styles.brandTitle}>FULL ARCHIVE</div>
                    <div style={styles.brandSub}>COMPLETE MIX DATABASE</div>
                    <div style={styles.divider}>================================</div>
                    <div style={styles.colHeaders}>
                        <span>ID</span>
                        <span>TITLE // ARTIST</span>
                        <span>LENGTH</span>
                    </div>
                    <div style={styles.divider}>--------------------------------</div>
                </div>

                <div style={styles.rollContainer}>
                    {tracks.map((track) => (
                        <div 
                            key={track.id} 
                            ref={addToRefs}
                            className="track-row glass-row"
                            style={styles.row}
                            onClick={() => toggleTrack(track)}
                        >
                            <div style={styles.rowData}>
                                {/* IMAGE STAMP */}
                                <div style={styles.coverWrapper}>
                                    <img 
                                        src={track.cover} 
                                        alt={track.title} 
                                        className="track-cover" 
                                        style={styles.coverImage} 
                                    />
                                    <span style={styles.qty}>
                                        {track.index < 10 ? `0${track.index}` : track.index}
                                    </span>
                                </div>

                                <div style={styles.meta}>
                                    <div className="track-title" style={styles.title}>{track.title}</div>
                                    <div style={styles.artist}>{track.artist}</div>
                                    {/* ADDED GENRE DISPLAY */}
                                    <div style={styles.genre}>{track.genre}</div>
                                </div>
                                
                                <span style={styles.durationDisplay}>
                                    {formatTime(trackDurations[track.id])}
                                </span>
                            </div>

                            <ReceiptPlayer 
                                id={track.id} 
                                isPlaying={playingId === track.id && isPlaying}
                                currentTime={playingId === track.id ? currentTime : 0}
                                duration={playingId === track.id ? duration : 0}
                                totalDuration={trackDurations[track.id]} 
                                onToggle={() => toggleTrack(track)}
                                onSeek={seek}
                                audioUrl={track.audio} 
                                title={track.title} 
                            />
                        </div>
                    ))}
                </div>

                <div style={styles.receiptFooter}>
                    <div style={styles.divider}>--------------------------------</div>
                    <div style={styles.totalRow}>
                        <span>TOTAL RECORDS:</span>
                        <span>{tracks.length}</span>
                    </div>
                    <div className="barcode" style={styles.barcode}>|| ||| |||| || ||| || |||||</div>
                    <div style={styles.thankYou}>END OF TRANSMISSION</div>
                </div>
            </div>

            {/* MARQUEE BAND */}
            <MarqueeBand />

            {/* FOOTER */}
            <Footer />

            <style>{`
                .active-row .track-title { font-weight: 900 !important; letter-spacing: 1px; }
                * { box-sizing: border-box; }
                
                /* Glassmorphism CSS Transition */
                .glass-row {
                    border: 1px solid transparent; 
                    transition: backdrop-filter 0.5s ease;
                }

                @media (max-width: 600px) {
                    .brand-title { font-size: 1.5rem !important; }
                    .track-title { font-size: 1rem !important; }
                    .controls-row { gap: 10px !important; }
                    .receipt-player { padding: 0 5px; }
                    .track-cover { width: 50px !important; height: 50px !important; }
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const styles = {
    mainContainer: {
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#F1E9DB',
        display: 'flex',
        flexDirection: 'column',
    },
    pageWrapper: { 
        minHeight: '100vh', 
        width: '100vw', 
        color: '#111', 
        fontFamily: '"Space Mono", "Courier New", monospace', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '100px 15px 40px', 
        overflowX: 'hidden' 
    },
    loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#E60000', fontFamily: 'monospace', letterSpacing: '2px' },
    receiptHeader: { textAlign: 'center', marginBottom: '40px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    backBtn: { background: 'transparent', border: '1px solid #111', padding: '10px 20px', marginBottom: '30px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.2s', ':hover': { background: '#111', color: '#fff' } },
    brandTitle: { fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px', lineHeight: 1 },
    brandSub: { fontSize: '0.9rem', opacity: 0.6, letterSpacing: '2px' },
    divider: { width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.3, margin: '15px 0' },
    colHeaders: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, padding: '0 20px', width: '100%' },
    
    // UPDATED CONTAINER with GAP
    rollContainer: { 
        width: '100%', 
        maxWidth: '600px', 
        paddingBottom: '80px',
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px' // Critical for glass boxes
    },
    
    // UPDATED ROW STYLE FOR GLASSMORPHISM
    row: { 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '25px', 
        
        // Invisible base state
        backgroundColor: 'rgba(255,255,255,0)',
        backdropFilter: 'blur(0px)',
        border: '1px solid transparent',
        boxShadow: 'none',
        borderRadius: '16px',

        cursor: 'pointer', 
        transformOrigin: 'center center', 
        overflow: 'hidden', 
        width: '100%',
        willChange: 'transform, backdrop-filter, background-color' 
    },
    
    rowData: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    
    // IMAGE STYLES
    coverWrapper: { display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 },
    coverImage: {
        width: '55px', height: '55px', objectFit: 'cover',
        border: '1px solid #111',
        filter: 'grayscale(100%)', 
        borderRadius: '4px', // Rounded for glass style
        transition: 'filter 0.3s'
    },
    qty: { opacity: 0.5, fontSize: '0.9rem', fontWeight: 'bold' },

    meta: { flexGrow: 1, paddingLeft: '15px', paddingRight: '15px', overflow: 'hidden' },
    title: { fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', wordBreak: 'break-word', lineHeight: '1.1' },
    
    artist: { 
        fontSize: '0.85rem', 
        opacity: 0.75,
        whiteSpace: 'normal',       
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: '3',       
        WebkitBoxOrient: 'vertical',
        lineHeight: '1.4',
        marginTop: '5px'
    },

    // ADDED GENRE STYLE
    genre: {
        fontSize: '0.7rem',
        fontWeight: 'bold',
        marginTop: '3px',
        textTransform: 'uppercase',
        color: '#E60000',
        letterSpacing: '1px'
    },
    
    durationDisplay: { fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },
    
    // PLAYER WRAPPER
    playerWrapper: { 
        overflow: 'hidden', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px', 
        height: 'auto', 
        opacity: 1, 
        marginTop: '15px' 
    },
    waveformLine: { display: 'flex', alignItems: 'center', gap: '3px', height: '30px', marginTop: '10px', width: '100%', overflow: 'hidden' },
    waveBar: { flex: 1, borderRadius: '2px', transition: 'height 0.1s ease', minWidth: '2px' },
    
    controlsRow: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' },
    playBtn: { background: '#111', color: '#fff', border: 'none', padding: '8px 12px', fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0, borderRadius: '4px' },
    downloadBtn: { background: 'transparent', border: '1px solid #111', color: '#111', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', borderRadius: '4px' },
    scrubberContainer: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    rangeInput: { width: '100%', accentColor: '#E60000', cursor: 'pointer', height: '4px' },
    timeDisplay: { fontSize: '0.75rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
    
    receiptFooter: { textAlign: 'center', width: '100%', maxWidth: '600px', marginTop: '20px', opacity: 0.6 },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px', padding: '0 5px' },
    barcode: { fontFamily: '"Libre Barcode 39 Text", cursive', fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px' },
    thankYou: { fontSize: '0.8rem' },

    // --- MARQUEE STYLES ---
    marqueeBand: {
        width: '100%',
        height: '40px', 
        backgroundColor: '#E60000',
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden', 
        borderTop: '2px solid #111',
    },
    marqueeTrack: {
        display: 'flex', 
        whiteSpace: 'nowrap', 
        width: 'fit-content'
    },
    marqueeText: {
        fontSize: '1rem', fontWeight: '900', color: '#000',
        fontFamily: '"Rajdhani", sans-serif', letterSpacing: '2px',
        paddingRight: '50px',
        flexShrink: 0,
        display: 'block'
    }
};

export default Mixes;