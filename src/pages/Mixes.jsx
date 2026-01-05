import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAudio } from '../context/AudioContext'; 
import Navbar from '../components/Navbar';
import SEO from '../components/SEO';

// --- IMPORT IMAGE FOR FOOTER ---
import footerLogo from '../assets/Artboard_3_page-0001-removebg-preview.png';

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
                        // --- MATCHED TO DJS PICKS: GREEN SIGNAL ---
                        backgroundColor: isPlaying ? '#009933' : '#333' 
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
                        fetch(`https://djkace-api.elaanyu.workers.dev/tracks/${id}/download`, { 
                            method: 'POST' 
                        }).catch(err => console.error("Analytics Error:", err));
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

// --- COMPONENT: LOCAL FOOTER ---
const Footer = () => {
    const containerRef = useRef(null);
    const recordRef = useRef(null);
  
    useGSAP(() => {
      // 1. THE SPINNING ANIMATION
      const spin = gsap.to(recordRef.current, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center"
      });
  
      // 2. INTERACTION: Speed up on hover (Scratch effect)
      const recordEl = recordRef.current;
      
      if(recordEl) {
        recordEl.addEventListener('mouseenter', () => {
            gsap.to(spin, { timeScale: 0.2, duration: 0.5 }); // Slow down (brake)
        });
        
        recordEl.addEventListener('mouseleave', () => {
            gsap.to(spin, { timeScale: 1, duration: 1 }); // Back to normal speed
        });
        
        recordEl.addEventListener('mousedown', () => {
             gsap.to(spin, { timeScale: 5, duration: 0.2 }); // Fast spin (rewind/cue)
        });
        
        recordEl.addEventListener('mouseup', () => {
             gsap.to(spin, { timeScale: 1, duration: 0.5 });
        });
      }
  
    }, { scope: containerRef });
  
    return (
      <footer ref={containerRef} style={footerStyles.footerWrapper} itemScope itemType="https://schema.org/WPFooter">
        
        {/* LEFT SIDE: THE LINER NOTES (Content) */}
        <div style={footerStyles.linerNotes}>
            
            <div style={footerStyles.tracklistBlock}>
               <h4 style={footerStyles.sideLabel}>SOCIALS // CONTACT</h4>
               <ul style={footerStyles.trackList}>
                   {/* INSTAGRAM */}
                   <li style={footerStyles.trackItem}>
                       <span style={footerStyles.trackNum}>A1.</span>
                       <a 
                           href="https://www.instagram.com/deejaykace/" 
                           target="_blank" 
                           rel="noopener noreferrer me" 
                           style={footerStyles.trackLink}
                           itemProp="sameAs" 
                       >
                           INSTAGRAM (@deejaykace)
                       </a>
                       <span style={footerStyles.trackTime}>↗</span>
                   </li>
  
                   {/* TIKTOK */}
                   <li style={footerStyles.trackItem}>
                       <span style={footerStyles.trackNum}>A2.</span>
                       <a 
                           href="https://www.tiktok.com/@dj.kace" 
                           target="_blank" 
                           rel="noopener noreferrer me" 
                           style={footerStyles.trackLink}
                           itemProp="sameAs"
                       >
                           TIKTOK (@dj.kace)
                       </a>
                       <span style={footerStyles.trackTime}>↗</span>
                   </li>
  
                   {/* YOUTUBE */}
                   <li style={footerStyles.trackItem}>
                       <span style={footerStyles.trackNum}>A3.</span>
                       <a 
                           href="https://www.youtube.com/@DeeJayKace" 
                           target="_blank" 
                           rel="noopener noreferrer me" 
                           style={footerStyles.trackLink}
                           itemProp="sameAs"
                       >
                           YOUTUBE (@DeeJayKace)
                       </a>
                       <span style={footerStyles.trackTime}>↗</span>
                   </li>
  
                   {/* EMAIL */}
                   <li style={footerStyles.trackItem}>
                       <span style={footerStyles.trackNum}>B1.</span>
                       <a 
                           href="mailto:deejaykace@gmail.com" 
                           style={footerStyles.trackLink}
                           itemProp="email"
                       >
                           EMAIL (deejaykace@gmail.com)
                       </a>
                       <span style={footerStyles.trackTime}>✉</span>
                   </li>
               </ul>
            </div>
  
            <div style={footerStyles.creditsBlock}>
               <h4 style={footerStyles.sideLabel}>CREDITS</h4>
               <div style={footerStyles.creditGrid}>
                   <div style={footerStyles.creditItem}>
                       <span style={footerStyles.role}>EXECUTIVE PRODUCER</span>
                       <span style={footerStyles.name} itemProp="producer">DEEJAY KACE</span>
                   </div>
                   <div style={footerStyles.creditItem}>
                       <span style={footerStyles.role}>DEVELOPMENT & CODE</span>
                       <div style={footerStyles.devBadge}>
                            <span style={footerStyles.devName}>J&E MAISON</span>
                            <a href="mailto:barcodetech2020@gmail.com" style={footerStyles.devLink}>barcodetech2020@gmail.com</a>
                       </div>
                   </div>
                   <div style={footerStyles.creditItem}>
                       <span style={footerStyles.role}>RECORDED AT</span>
                       <span style={footerStyles.name}>NAIROBI, KE</span>
                   </div>
               </div>
            </div>
            
            <div style={footerStyles.copyright}>
               © 2025 DEEJAY KACE. UNAUTHORIZED DUPLICATION IS A VIOLATION OF APPLICABLE LAWS.
            </div>
  
            {/* --- ADDED LOGO HERE --- */}
            <img src={footerLogo} alt="Kace Logo" style={footerStyles.footerLogo} />
  
        </div>
  
        {/* RIGHT SIDE: THE RECORD (SVG) */}
        <div style={footerStyles.recordContainer}>
          <svg 
              ref={recordRef}
              viewBox="0 0 600 600" 
              style={footerStyles.recordSvg}
          >
              <defs>
                  <path id="circlePath1" d="M 300, 300 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0" />
                  <path id="circlePath2" d="M 300, 300 m -190, 0 a 190,190 0 1,1 380,0 a 190,190 0 1,1 -380,0" />
              </defs>
  
              <circle cx="300" cy="300" r="295" fill="#111" />
              <circle cx="300" cy="300" r="290" fill="none" stroke="#222" strokeWidth="2" />
              <circle cx="300" cy="300" r="280" fill="none" stroke="#1a1a1a" strokeWidth="4" />
              <circle cx="300" cy="300" r="270" fill="none" stroke="#222" strokeWidth="1" />
              
              <text fill="#444" fontSize="14" fontFamily="monospace" letterSpacing="4" fontWeight="bold">
                  <textPath href="#circlePath1" startOffset="0%">
                      ALL RIGHTS RESERVED • DEEJAY KACE • NAIROBI KENYA • EST 2025 • ORIGINAL MASTER RECORDING • 
                  </textPath>
              </text>
  
              <text fill="#E60000" fontSize="12" fontFamily="monospace" letterSpacing="5" fontWeight="bold">
                  <textPath href="#circlePath2" startOffset="50%">
                      DEVELOPED BY J&E MAISON • HIGH FIDELITY CODE • 
                  </textPath>
              </text>
  
              <circle cx="300" cy="300" r="100" fill="#E60000" />
              <circle cx="300" cy="300" r="15" fill="#fff" />
              
              <text x="300" y="260" textAnchor="middle" fill="#000" fontSize="24" fontWeight="900" fontFamily="sans-serif">KACE</text>
              <text x="300" y="280" textAnchor="middle" fill="#000" fontSize="10" fontFamily="monospace">STEREO</text>
              <text x="300" y="340" textAnchor="middle" fill="#000" fontSize="10" fontFamily="monospace">33 1/3 RPM</text>
              
              <circle cx="300" cy="300" r="295" fill="url(#reflection)" opacity="0.1" pointerEvents="none"/>
              <linearGradient id="reflection" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                  <stop offset="50%" stopColor="#fff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
          </svg>
  
          <div style={footerStyles.sleeveShadow}></div>
        </div>
  
      </footer>
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
            // --- MATCHED TO DJS PICKS: GREEN BORDER & GLOW ---
            borderColor: isActive ? "#009933" : "transparent",
            boxShadow: isActive ? "0 8px 32px 0 rgba(0, 153, 51, 0.15)" : "none",
            scale: isActive ? 1.02 : 1,
            y: isActive ? -5 : 0,
            color: isActive ? "#111" : "#111", // Keeping text dark for readability (just like DJs Picks)
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
                        <span>DESCRIPTION</span>
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
                                    {/* ADDED GREEN GENRE */}
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

// --- MIXES STYLES ---
const styles = {
    mainContainer: {
        width: '100vw', 
        minHeight: '100vh',
        backgroundColor: '#F1E9DB',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden' 
    },
    pageWrapper: { 
        minHeight: '100vh', 
        width: '100%', 
        color: '#111', 
        fontFamily: '"Space Mono", "Courier New", monospace', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '100px 15px 40px', 
        overflowX: 'hidden'
    },
    loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#E60000', fontFamily: 'monospace', letterSpacing: '2px' },
    
    // ADDED MARGIN AUTO TO FORCE CENTERING
    receiptHeader: { 
        textAlign: 'center', 
        marginBottom: '40px', 
        width: '100%', 
        maxWidth: '600px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        margin: '0 auto 40px auto' 
    },
    backBtn: { background: 'transparent', border: '1px solid #111', padding: '10px 20px', marginBottom: '30px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.2s', ':hover': { background: '#111', color: '#fff' } },
    brandTitle: { fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px', lineHeight: 1 },
    brandSub: { fontSize: '0.9rem', opacity: 0.6, letterSpacing: '2px' },
    divider: { width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.3, margin: '15px 0' },
    colHeaders: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, padding: '0 20px', width: '100%' },
    
    // ADDED MARGIN AUTO TO FORCE CENTERING
    rollContainer: { 
        width: '100%', 
        maxWidth: '600px', 
        paddingBottom: '80px',
        display: 'flex', 
        flexDirection: 'column',
        gap: '20px',
        margin: '0 auto' 
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

    // MATCHED TO DJS PICKS: GREEN GENRE
    genre: {
        fontSize: '0.7rem',
        fontWeight: 'bold',
        marginTop: '3px',
        textTransform: 'uppercase',
        color: '#009933', // Green
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

// --- FOOTER STYLES ---
const footerStyles = {
    footerWrapper: {
      backgroundColor: '#F1E9DB', 
      color: '#111',
      fontFamily: '"Space Mono", monospace',
      display: 'flex',
      flexWrap: 'wrap', 
      overflow: 'hidden',
      position: 'relative',
      borderTop: '1px solid #ccc',
      width: '100%' 
    },
  
    // --- LEFT SIDE: LINER NOTES ---
    linerNotes: {
      flex: '1 1 300px', 
      maxWidth: '100%', 
      padding: '60px 40px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      zIndex: 10,
      position: 'relative' 
    },
    
    // Tracklist (Socials)
    tracklistBlock: { marginBottom: '50px' },
    sideLabel: { 
      fontSize: '1.5rem', fontWeight: '900', borderBottom: '2px solid #111', 
      paddingBottom: '10px', marginBottom: '20px', letterSpacing: '-1px' 
    },
    trackList: { listStyle: 'none', padding: 0 },
    trackItem: { 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      marginBottom: '10px', borderBottom: '1px dotted #ccc', paddingBottom: '5px' 
    },
    trackNum: { fontWeight: 'bold', width: '40px' },
    trackLink: { 
      flexGrow: 1, textDecoration: 'none', color: '#111', fontSize: '1rem', fontWeight: 'bold',
      textTransform: 'uppercase', cursor: 'pointer'
    },
    trackTime: { fontSize: '0.8rem', color: '#666', fontWeight: 'bold' },
  
    // Credits (Developer)
    creditsBlock: { marginBottom: '40px' },
    creditGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    creditItem: { display: 'flex', flexDirection: 'column' },
    role: { fontSize: '0.6rem', color: '#666', marginBottom: '5px', textTransform: 'uppercase' },
    name: { fontWeight: 'bold' },
  
    // Dev Badge Specifics
    devBadge: { display: 'flex', flexDirection: 'column' },
    devName: { fontWeight: 'bold', color: '#E60000' },
    devLink: { fontSize: '0.7rem', color: '#111', textDecoration: 'underline' },
  
    copyright: { fontSize: '0.6rem', color: '#888', maxWidth: '300px' },
  
    // --- UPDATED LOGO STYLE ---
    footerLogo: {
      width: '180px', 
      height: 'auto',
      marginTop: '30px',
      filter: 'grayscale(100%) contrast(1.2) brightness(0.9)', 
      opacity: 0.8,
      mixBlendMode: 'multiply' 
    },
  
    // --- RIGHT SIDE: THE RECORD ---
    recordContainer: {
      flex: '1 1 300px', 
      maxWidth: '100%', 
      backgroundColor: '#111', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '400px'
    },
    
    recordSvg: {
      width: '90%',
      maxWidth: '500px',
      height: 'auto',
      filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.5))',
      cursor: 'grab' 
    },
  
    sleeveShadow: {
      position: 'absolute', left: 0, top: 0, bottom: 0, width: '20px',
      background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
      pointerEvents: 'none'
    }
};

export default Mixes;