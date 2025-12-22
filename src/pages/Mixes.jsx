import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- UTILS ---
const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- COMPONENT: INLINE PLAYER ---
// Updated to accept 'audioUrl' prop for downloading
const ReceiptPlayer = ({ isPlaying, currentTime, duration, onToggle, onSeek, audioUrl }) => {
    return (
        <div className="receipt-player" style={styles.playerWrapper}>
            <div style={styles.waveformLine}>
                {Array(25).fill(0).map((_, i) => (
                    <div key={i} style={{
                        ...styles.waveBar,
                        height: isPlaying ? `${Math.random() * 20 + 5}px` : '2px',
                        backgroundColor: isPlaying ? '#E60000' : '#333'
                    }} />
                ))}
            </div>
            
            <div className="controls-row" style={styles.controlsRow}>
                {/* PLAY/PAUSE */}
                <button onClick={(e) => { e.stopPropagation(); onToggle(); }} style={styles.playBtn}>
                    {isPlaying ? "PAUSE" : "PLAY"}
                </button>

                {/* NEW: DOWNLOAD BUTTON */}
                <a 
                    href={audioUrl} 
                    download 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                    style={styles.downloadBtn}
                    title="Download Mix"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </a>
                
                {/* SCRUBBER */}
                <div style={styles.scrubberContainer}>
                    <input 
                        type="range" min="0" max={duration || 0} value={currentTime}
                        onChange={(e) => onSeek(e.target.value)}
                        style={styles.rangeInput}
                    />
                </div>
                
                <span style={styles.timeDisplay}>{formatTime(currentTime)}</span>
            </div>
        </div>
    );
};

// --- MAIN PAGE: MIXES ARCHIVE ---
const Mixes = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]); 
    const navigate = useNavigate();
    
    // Data State
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Audio State
    const [currentAudio, setCurrentAudio] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // --- FETCH ALL TRACKS ---
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch('https://djkace-api.elaanyu.workers.dev');
                const data = await response.json();
                
                const formatted = data.map((t, i) => ({
                    id: t.id,
                    index: i + 1,
                    title: t.title,
                    artist: t.description?.substring(0, 30) || "Deejay Kace",
                    bpm: Math.floor(Math.random() * (128 - 90) + 90),
                    audio: t.audio_url,
                    cover: t.image_url
                }));
                setTracks(formatted);
                setLoading(false);
            } catch (e) { console.error(e); setLoading(false); }
        };
        fetchTracks();
    }, []);

    // --- AUDIO LOGIC ---
    const handleToggle = (track) => {
        if (playingId === track.id) {
            currentAudio.paused ? currentAudio.play() : currentAudio.pause();
            return;
        }
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        
        const audio = new Audio(track.audio);
        audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
        audio.onloadedmetadata = () => setDuration(audio.duration);
        audio.onended = () => { setPlayingId(null); setCurrentTime(0); };
        audio.play();
        setCurrentAudio(audio);
        setPlayingId(track.id);
    };

    const handleSeek = (val) => {
        if (currentAudio) { currentAudio.currentTime = val; setCurrentTime(val); }
    };

    // --- SCROLL ANIMATION ---
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

    const animateRow = (element, isActive) => {
        gsap.to(element, {
            scale: isActive ? 1.02 : 0.98,
            opacity: isActive ? 1 : 0.6,
            filter: isActive ? "blur(0px)" : "blur(1px)",
            color: isActive ? "#E60000" : "#111",
            borderBottomColor: isActive ? "#E60000" : "#ccc",
            padding: isActive ? "30px 0" : "20px 0",
            duration: 0.3,
            ease: "power2.out"
        });

        const player = element.querySelector('.receipt-player');
        if (player) {
            gsap.to(player, {
                height: isActive ? "auto" : 0,
                opacity: isActive ? 1 : 0,
                marginTop: isActive ? 20 : 0,
                duration: 0.3
            });
        }
    };

    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };

    if (loading) return <div style={styles.loader}>LOADING ARCHIVE...</div>;

    return (
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
                    <span>BPM</span>
                </div>
                <div style={styles.divider}>--------------------------------</div>
            </div>

            <div style={styles.rollContainer}>
                {tracks.map((track) => (
                    <div 
                        key={track.id} 
                        ref={addToRefs}
                        className="track-row"
                        style={styles.row}
                        onClick={() => handleToggle(track)}
                    >
                        <div style={styles.rowData}>
                            <span style={styles.qty}>
                                {track.index < 10 ? `0${track.index}` : track.index}
                            </span>
                            <div style={styles.meta}>
                                <div className="track-title" style={styles.title}>{track.title}</div>
                                <div style={styles.artist}>{track.artist}</div>
                            </div>
                            <span style={styles.bpm}>{track.bpm}</span>
                        </div>

                        {/* PASS AUDIO URL TO PLAYER */}
                        <ReceiptPlayer 
                            isPlaying={playingId === track.id}
                            currentTime={playingId === track.id ? currentTime : 0}
                            duration={playingId === track.id ? duration : 0}
                            onToggle={() => handleToggle(track)}
                            onSeek={handleSeek}
                            audioUrl={track.audio} 
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

            <style>{`
                .active-row .track-title { font-weight: 900 !important; letter-spacing: 1px; }
                * { box-sizing: border-box; }
                @media (max-width: 600px) {
                    .brand-title { font-size: 1.5rem !important; }
                    .track-title { font-size: 1rem !important; }
                    .controls-row { gap: 10px !important; }
                    .receipt-player { padding: 0 5px; }
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const styles = {
    pageWrapper: {
        minHeight: '100vh', width: '100vw',
        backgroundColor: '#F1E9DB', color: '#111',
        fontFamily: '"Space Mono", "Courier New", monospace',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '100px 15px', overflowX: 'hidden'
    },
    loader: {
        height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
        color: '#E60000', fontFamily: 'monospace', letterSpacing: '2px'
    },
    
    // Header
    receiptHeader: {
        textAlign: 'center', marginBottom: '40px', width: '100%', maxWidth: '600px',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    backBtn: {
        background: 'transparent', border: '1px solid #111', padding: '10px 20px',
        marginBottom: '30px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold',
        fontSize: '0.8rem', transition: 'all 0.2s',
        ':hover': { background: '#111', color: '#fff' }
    },
    brandTitle: { fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px', lineHeight: 1 },
    brandSub: { fontSize: '0.9rem', opacity: 0.6, letterSpacing: '2px' },
    divider: { width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.3, margin: '15px 0' },
    colHeaders: {
        display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, padding: '0 5px', width: '100%'
    },

    // Roll
    rollContainer: {
        width: '100%', maxWidth: '600px', paddingBottom: '80px'
    },
    row: {
        display: 'flex', flexDirection: 'column', padding: '20px 5px',
        borderBottom: '1px dashed #ccc', cursor: 'pointer',
        transformOrigin: 'center center', overflow: 'hidden', width: '100%'
    },
    rowData: {
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%'
    },
    qty: { width: '40px', opacity: 0.5, fontSize: '0.9rem', flexShrink: 0 },
    meta: { flexGrow: 1, paddingRight: '15px' },
    title: { fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', wordBreak: 'break-word' },
    artist: { fontSize: '0.8rem', opacity: 0.7 },
    bpm: { fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },

    // Player
    playerWrapper: { height: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px' },
    waveformLine: {
        display: 'flex', alignItems: 'center', gap: '3px', height: '30px', marginTop: '10px', width: '100%', overflow: 'hidden'
    },
    waveBar: { flex: 1, borderRadius: '2px', transition: 'height 0.1s ease', minWidth: '2px' },
    
    controlsRow: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }, // Reduced gap slightly
    playBtn: {
        background: '#111', color: '#fff', border: 'none', padding: '8px 12px',
        fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0
    },
    // NEW: Download Button Style
    downloadBtn: {
        background: 'transparent', border: '1px solid #111', color: '#111',
        padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
        ':hover': { background: '#111', color: '#fff' }
    },
    scrubberContainer: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    rangeInput: { width: '100%', accentColor: '#E60000', cursor: 'pointer', height: '4px' },
    timeDisplay: { fontSize: '0.75rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'right' },

    // Footer
    receiptFooter: {
        textAlign: 'center', width: '100%', maxWidth: '600px', marginTop: '20px', opacity: 0.6
    },
    totalRow: {
        display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px', padding: '0 5px'
    },
    barcode: {
        fontFamily: '"Libre Barcode 39 Text", cursive', fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px'
    },
    thankYou: { fontSize: '0.8rem' }
};

export default Mixes;