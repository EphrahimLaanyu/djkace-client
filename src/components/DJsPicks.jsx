import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
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
const ReceiptPlayer = ({ isPlaying, currentTime, duration, onToggle, onSeek }) => {
    return (
        <div className="receipt-player" style={styles.playerWrapper}>
            <div style={styles.waveformLine}>
                {/* Simulated visualizer bars */}
                {Array(20).fill(0).map((_, i) => (
                    <div key={i} style={{
                        ...styles.waveBar,
                        height: isPlaying ? `${Math.random() * 20 + 5}px` : '2px',
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

// --- MAIN PAGE ---
const DJsPicks = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]); 
    const navigate = useNavigate(); // Initialize hook
    
    // Data State
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Audio State
    const [currentAudio, setCurrentAudio] = useState(null);
    const [playingId, setPlayingId] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // --- FETCH ---
    useEffect(() => {
        const fetchTracks = async () => {
            try {
                const response = await fetch('https://djkace-api.elaanyu.workers.dev');
                const data = await response.json();
                
                // Limit to 5 tracks
                const limitedData = data.slice(0, 5);
                
                const formatted = limitedData.map((t, i) => ({
                    id: t.id,
                    index: i + 1,
                    title: t.title,
                    artist: t.description?.substring(0, 25) || "Deejay Kace",
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
                start: "top 70%", // Relaxed trigger for mobile
                end: "bottom 30%", 
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
            scale: isActive ? 1.05 : 0.95, // Reduced scale for mobile safety
            opacity: isActive ? 1 : 0.5,
            filter: isActive ? "blur(0px)" : "blur(1px)",
            color: isActive ? "#E60000" : "#111",
            borderBottomColor: isActive ? "#E60000" : "#ccc",
            padding: isActive ? "30px 0" : "20px 0",
            duration: 0.4,
            ease: "power2.out"
        });

        const player = element.querySelector('.receipt-player');
        if (player) {
            gsap.to(player, {
                height: isActive ? "auto" : 0,
                opacity: isActive ? 1 : 0,
                marginTop: isActive ? 20 : 0,
                duration: 0.4
            });
        }
    };

    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current.push(el);
        }
    };

    if (loading) return <div style={styles.loader}>PRINTING RECEIPT...</div>;

    return (
        <div ref={containerRef} style={styles.pageWrapper}>
            
            {/* PAPER HEADER */}
            <div style={styles.receiptHeader}>
                <div className="brand-title" style={styles.brandTitle}>DJ KACE // MIXES</div>
                <div style={styles.brandSub}>NAIROBI, KENYA • EST 2025</div>
                <div style={styles.divider}>================================</div>
                <div style={styles.colHeaders}>
                    <span>QTY</span>
                    <span>ITEM DESCRIPTION</span>
                    <span>BPM</span>
                </div>
                <div style={styles.divider}>--------------------------------</div>
            </div>

            {/* THE ROLL */}
            <div style={styles.rollContainer}>
                {tracks.map((track) => (
                    <div 
                        key={track.id} 
                        ref={addToRefs}
                        className="track-row"
                        style={styles.row}
                        onClick={() => handleToggle(track)}
                    >
                        {/* TOP LINE: DATA */}
                        <div style={styles.rowData}>
                            <span style={styles.qty}>0{track.index}</span>
                            <div style={styles.meta}>
                                <div className="track-title" style={styles.title}>{track.title}</div>
                                <div style={styles.artist}>{track.artist}</div>
                            </div>
                            <span style={styles.bpm}>{track.bpm}</span>
                        </div>

                        {/* INLINE PLAYER */}
                        <ReceiptPlayer 
                            isPlaying={playingId === track.id}
                            currentTime={playingId === track.id ? currentTime : 0}
                            duration={playingId === track.id ? duration : 0}
                            onToggle={() => handleToggle(track)}
                            onSeek={handleSeek}
                        />
                    </div>
                ))}
            </div>

            {/* PAPER FOOTER */}
            <div style={styles.receiptFooter}>
                <div style={styles.divider}>--------------------------------</div>
                <div style={styles.totalRow}>
                    <span>TOTAL ITEMS:</span>
                    <span>05</span>
                </div>
                
                {/* NEW: VIEW ALL BUTTON */}
                <button 
                    onClick={() => navigate('/mixes')} 
                    style={styles.viewAllBtn}
                    className="view-all-btn"
                >
                    VIEW ALL MIXES →
                </button>

                <div className="barcode" style={styles.barcode}>||| || ||| | |||| ||| || |||||</div>
                <div style={styles.thankYou}>THANK YOU FOR LISTENING</div>
            </div>

            {/* RESPONSIVE CSS INJECTION */}
            <style>{`
                /* Font Weight Switch for Active Row */
                .active-row .track-title { font-weight: 900 !important; letter-spacing: 1px; }
                
                /* Reset Box Model globally for this page */
                * { box-sizing: border-box; }

                /* Hover effect for View All Button */
                .view-all-btn:hover {
                    background-color: #E60000 !important;
                    color: #fff !important;
                    letter-spacing: 2px !important;
                }

                /* MOBILE RESPONSIVENESS */
                @media (max-width: 600px) {
                    .brand-title { font-size: 1.5rem !important; }
                    .track-title { font-size: 1rem !important; }
                    .controls-row { gap: 10px !important; }
                    .barcode { font-size: 1.5rem !important; }
                    
                    /* Adjust padding for small screens */
                    .receipt-player { padding: 0 5px; }
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const styles = {
    pageWrapper: {
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: '#F1E9DB', 
        color: '#111',
        fontFamily: '"Space Mono", "Courier New", monospace',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '100px 15px', // Reduced side padding for mobile
        overflowX: 'hidden' // CRITICAL: Prevents horizontal scroll
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
        width: '100%', maxWidth: '500px', // Constrained width prevents overflow
        paddingBottom: '20px'
    },
    row: {
        display: 'flex', flexDirection: 'column',
        padding: '20px 5px', // Reduced horizontal padding
        borderBottom: '1px dashed #ccc',
        cursor: 'pointer',
        transformOrigin: 'center center',
        overflow: 'hidden',
        width: '100%' // Ensure row stays within container
    },
    rowData: {
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%'
    },
    qty: { width: '30px', opacity: 0.5, fontSize: '0.8rem', flexShrink: 0 },
    meta: { flexGrow: 1, paddingRight: '10px' },
    title: { fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', wordBreak: 'break-word' },
    artist: { fontSize: '0.8rem', opacity: 0.7 },
    bpm: { fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },

    // PLAYER
    playerWrapper: {
        height: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px'
    },
    waveformLine: {
        display: 'flex', alignItems: 'center', gap: '3px', height: '30px', marginTop: '10px',
        width: '100%', overflow: 'hidden' // contain visualizer
    },
    waveBar: { flex: 1, borderRadius: '2px', transition: 'height 0.1s ease', minWidth: '2px' },
    
    controlsRow: { display: 'flex', alignItems: 'center', gap: '15px', width: '100%' },
    playBtn: {
        background: '#111', color: '#fff', border: 'none', padding: '8px 12px',
        fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0
    },
    scrubberContainer: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    rangeInput: { width: '100%', accentColor: '#E60000', cursor: 'pointer', height: '4px' },
    timeDisplay: { fontSize: '0.75rem', fontWeight: 'bold', minWidth: '40px', textAlign: 'right' },

    receiptFooter: {
        textAlign: 'center', width: '100%', maxWidth: '500px', marginTop: '20px', opacity: 0.6,
        display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    totalRow: {
        width: '100%', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '30px', padding: '0 5px'
    },
    // NEW BUTTON STYLE
    viewAllBtn: {
        background: 'transparent',
        border: '2px solid #111',
        color: '#111',
        padding: '15px 30px',
        fontFamily: 'inherit',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '30px',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase'
    },
    barcode: {
        fontFamily: '"Libre Barcode 39 Text", cursive',
        fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px'
    },
    thankYou: { fontSize: '0.8rem' }
};

export default DJsPicks;