import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- STATIC COLORS FOR THE SPINES ---
const SPINE_COLORS = ["#E60000", "#FF5733", "#C70039", "#900C3F", "#581845", "#FFC300", "#DAF7A6"];

// --- 1. UTILITY: FORMAT TIME (MM:SS) ---
const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- 2. COMPONENT: FULL PLAYER UI ---
const PlayerUI = ({ isPlaying, currentTime, duration, onToggle, onSeek, onSkip }) => {
    return (
        <div style={styles.playerContainer}>
            {/* PROGRESS BAR */}
            <div style={styles.progressWrapper}>
                <span style={styles.timeText}>{formatTime(currentTime)}</span>
                <input 
                    type="range" 
                    min="0" 
                    max={duration || 0} 
                    value={currentTime} 
                    onChange={(e) => onSeek(e.target.value)}
                    className="custom-range"
                    style={styles.progressBar}
                />
                <span style={styles.timeText}>{formatTime(duration)}</span>
            </div>

            {/* CONTROLS */}
            <div style={styles.controlsRow}>
                {/* REWIND 10s */}
                <button onClick={(e) => { e.stopPropagation(); onSkip(-10); }} style={styles.skipBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                    </svg>
                    <span style={{fontSize:'0.6rem', marginTop:'2px'}}>-10s</span>
                </button>

                {/* PLAY / PAUSE (Main Button) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onToggle(); }} 
                    style={{...styles.mainPlayBtn, borderColor: isPlaying ? '#E60000' : '#fff', color: isPlaying ? '#E60000' : '#fff'}}
                >
                    {isPlaying ? (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                    ) : (
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    )}
                </button>

                {/* FORWARD 10s */}
                <button onClick={(e) => { e.stopPropagation(); onSkip(10); }} style={styles.skipBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
                    </svg>
                    <span style={{fontSize:'0.6rem', marginTop:'2px'}}>+10s</span>
                </button>
            </div>

            {/* STATUS TEXT */}
            <div style={styles.statusText}>
                {isPlaying ? "SIGNAL ACTIVE // TRANSMITTING" : "SIGNAL PAUSED // AWAITING INPUT"}
            </div>

            {/* CSS FOR RANGE SLIDER (Hard to do inline) */}
            <style>{`
                .custom-range {
                    -webkit-appearance: none; width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; cursor: pointer; outline: none; margin: 0 10px;
                }
                .custom-range::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 12px; height: 12px; background: #E60000; cursor: pointer; border-radius: 50%; box-shadow: 0 0 10px rgba(230,0,0,0.8);
                }
                .custom-range::-moz-range-thumb {
                    width: 12px; height: 12px; background: #E60000; cursor: pointer; border-radius: 50%; border: none;
                }
            `}</style>
        </div>
    );
};

// --- 3. COMPONENT: VISUALIZERS (Kept from previous version) ---
const SignalVisualizer = ({ isPlaying }) => {
  const canvasRef = useRef(null);
  const amplitude = useRef(0);
  const targetAmplitude = useRef(0);
  const phase = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const render = () => {
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== width) { canvas.width = width; canvas.height = height; }
      ctx.clearRect(0, 0, width, height);
      
      targetAmplitude.current = isPlaying ? 20 : 1; 
      amplitude.current += (targetAmplitude.current - amplitude.current) * 0.1;

      ctx.beginPath();
      ctx.strokeStyle = isPlaying ? '#E60000' : 'rgba(255, 255, 255, 0.15)'; 
      ctx.lineWidth = 2;

      const centerY = height / 2;
      for (let x = 0; x < width; x += 4) {
        const y = centerY + Math.sin(x * 0.03 + phase.current) * amplitude.current;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      phase.current += isPlaying ? 0.2 : 0.05; 
      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
};

const SpineSignal = ({ isPlaying }) => {
    if (!isPlaying) return null;
    return (
        <div style={styles.spineSignalWrapper}>
            <div className="signal-bar"></div><div className="signal-bar" style={{animationDelay:'0.1s'}}></div><div className="signal-bar" style={{animationDelay:'0.2s'}}></div>
            <style>{`
                .signal-bar { width: 4px; background-color: #E60000; margin-bottom: 4px; animation: spinePulse 0.5s infinite alternate; }
                @keyframes spinePulse { from { height: 10px; opacity: 0.5; } to { height: 40px; opacity: 1; box-shadow: 0 0 10px #E60000; } }
            `}</style>
        </div>
    );
};


// --- 4. MAIN PAGE ---
const DJsPicks = () => {
  const containerRef = useRef(null);
  
  // Data State
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Audio State
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('https://djkace-api.elaanyu.workers.dev');
        const data = await response.json();
        const formattedTracks = data.slice(0, 5).map((track, index) => ({
          id: track.id,
          title: track.title,
          artist: track.description && track.description.length < 30 ? track.description : "Deejay Kace", 
          genre: track.genre || "EXCLUSIVE",
          bpm: Math.floor(Math.random() * (128 - 90 + 1) + 90).toString(), 
          color: SPINE_COLORS[index % SPINE_COLORS.length], 
          cover: track.image_url,
          audio: track.audio_url
        }));
        setTracks(formattedTracks);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch crate:", error);
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  // --- AUDIO LOGIC ---
  const handleTogglePlay = (trackId, audioUrl) => {
    // A. If clicking same track: Toggle Pause/Play
    if (playingId === trackId) {
        if (currentAudio.paused) {
            currentAudio.play();
        } else {
            currentAudio.pause();
        }
        // Force update to reflect paused state in UI is handled by listeners below
        return;
    }

    // B. If clicking new track: Stop old, Start new
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset old one
    }

    const newAudio = new Audio(audioUrl);
    
    // Add Listeners
    newAudio.ontimeupdate = () => setCurrentTime(newAudio.currentTime);
    newAudio.onloadedmetadata = () => setDuration(newAudio.duration);
    newAudio.onended = () => { setPlayingId(null); setCurrentTime(0); };
    
    newAudio.play();
    setCurrentAudio(newAudio);
    setPlayingId(trackId);
  };

  const handleSeek = (time) => {
    if (currentAudio) {
        currentAudio.currentTime = time;
        setCurrentTime(time);
    }
  };

  const handleSkip = (seconds) => {
    if (currentAudio) {
        let newTime = currentAudio.currentTime + seconds;
        if (newTime < 0) newTime = 0;
        if (newTime > currentAudio.duration) newTime = currentAudio.duration;
        currentAudio.currentTime = newTime;
    }
  };

  // --- ANIMATIONS ---
  useGSAP(() => {
    if (loading || tracks.length === 0) return;
    gsap.from(".record-spine", {
      scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
      yPercent: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power4.out"
    });
  }, { scope: containerRef, dependencies: [loading, tracks] });

  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = contextSafe((id) => {
    gsap.to(".record-spine", {
      flexGrow: (i, target) => target.dataset.id == id ? 12 : 1,
      duration: 0.8, ease: "power3.out", overwrite: 'auto'
    });
    gsap.to(`.content-${id}`, { opacity: 1, scale: 1, duration: 0.5, delay: 0.1 });
    gsap.to(`.spine-text-${id}`, { opacity: 0, duration: 0.3 });
    tracks.filter(t => t.id !== id).forEach(t => {
        gsap.to(`.content-${t.id}`, { opacity: 0, scale: 0.9, duration: 0.3 });
        gsap.to(`.spine-text-${t.id}`, { opacity: 1, duration: 0.3 });
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(".record-spine", { flexGrow: 1, duration: 0.8, ease: "power3.inOut" });
    gsap.to(".record-content", { opacity: 0, duration: 0.3 });
    gsap.to(".spine-text", { opacity: 1, duration: 0.3 });
  });

  if (loading) return <div style={styles.loadingScreen}>LOADING CRATE...</div>;

  return (
    <div ref={containerRef} style={styles.pageWrapper}>
      <div style={styles.header}>
        <h2 style={styles.title}>THE SHELF</h2>
        <p style={styles.subtitle}>HOVER TO BROWSE // {playingId ? "SIGNAL LOCKED" : "AWAITING INPUT"}</p>
      </div>

      <div style={styles.shelfContainer} onMouseLeave={handleMouseLeave}>
        {tracks.map((track) => {
            const isPlayingThis = playingId === track.id;
            
            return (
              <div
                key={track.id}
                className="record-spine track-card-trigger"
                data-id={track.id}
                onMouseEnter={() => handleMouseEnter(track.id)}
                style={{ 
                    ...styles.spine, 
                    borderColor: isPlayingThis ? '#E60000' : 'rgba(255,255,255,0.1)',
                    boxShadow: isPlayingThis ? 'inset 0 0 20px rgba(230,0,0,0.2)' : 'none'
                }}
              >
                {/* --- COLLAPSED VIEW --- */}
                <div className={`spine-text spine-text-${track.id}`} style={styles.spineTextWrapper}>
                  <div style={styles.spineTop}>
                     {isPlayingThis ? <SpineSignal isPlaying={true} /> : <span style={styles.spineBpm}>{track.bpm}</span>}
                  </div>
                  <span style={{...styles.spineTitle, color: isPlayingThis ? '#E60000' : '#fff'}}>{track.title}</span>
                  <div style={{...styles.spineColorTag, backgroundColor: track.color}}></div>
                </div>

                {/* --- EXPANDED VIEW --- */}
                <div className={`record-content content-${track.id}`} style={styles.contentWrapper}>
                    <div style={styles.imageContainer}>
                        <img src={track.cover} alt={track.title} style={styles.image} />
                        <div style={styles.gradientOverlay}></div>
                    </div>

                    <div style={styles.signalContainer}>
                        <SignalVisualizer isPlaying={isPlayingThis && !currentAudio?.paused} />
                    </div>

                    <div style={styles.infoContainer}>
                        <div style={styles.genreTag}>{track.genre}</div>
                        <h3 style={styles.bigTitle}>{track.title}</h3>
                        <p style={styles.artistName}>{track.artist}</p>
                        
                        {/* --- NEW PLAYER UI --- */}
                        <PlayerUI 
                            isPlaying={isPlayingThis && !currentAudio?.paused}
                            currentTime={isPlayingThis ? currentTime : 0}
                            duration={isPlayingThis ? duration : 0}
                            onToggle={() => handleTogglePlay(track.id, track.audio)}
                            onSeek={handleSeek}
                            onSkip={handleSkip}
                        />
                    </div>

                    <div style={{...styles.decorativeStrip, backgroundColor: track.color}}></div>
                </div>
              </div>
            );
        })}
      </div>
      <div style={styles.noise}></div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  pageWrapper: {
    height: '100vh', width: '100%', backgroundColor: '#F1E9DB', color: '#0a0a0a',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    position: 'relative', fontFamily: '"Rajdhani", sans-serif', overflow: 'hidden'
  },
  loadingScreen: {
    height: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#0a0a0a', color: '#E60000', fontSize: '1.5rem', letterSpacing: '4px',
    fontFamily: '"Rajdhani", sans-serif'
  },
  header: { position: 'absolute', top: '40px', left: '5vw', zIndex: 10, pointerEvents: 'none' },
  title: { fontSize: '3rem', fontWeight: '900', margin: 0, lineHeight: 1 },
  subtitle: { fontSize: '0.8rem', color: '#E60000', letterSpacing: '2px', fontWeight: '700' },
  
  shelfContainer: {
    display: 'flex', width: '90vw', height: '70vh', margin: '0 auto', gap: '4px', alignItems: 'stretch'
  },
  spine: {
    flexGrow: 1, flexBasis: '0', position: 'relative', backgroundColor: '#111',
    borderRight: '1px solid #222', borderLeft: '1px solid #222', overflow: 'hidden',
    transition: 'border-color 0.3s, box-shadow 0.3s'
  },
  
  spineTextWrapper: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0', opacity: 1, zIndex: 2 },
  spineTop: { height: '50px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' },
  spineSignalWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' },
  spineBpm: { fontSize: '0.9rem', color: '#666', fontWeight: 'bold' },
  spineTitle: { writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '4px', whiteSpace: 'nowrap', transition: 'color 0.3s' },
  spineColorTag: { width: '4px', height: '60px' },
  
  contentWrapper: { position: 'absolute', inset: 0, opacity: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', transform: 'scale(1.1)', zIndex: 5 },
  imageContainer: { position: 'absolute', inset: 0, zIndex: 0 },
  image: { width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%) contrast(1.2)' },
  gradientOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)' },
  
  infoContainer: { position: 'relative', zIndex: 10, padding: '40px', width: '100%' },
  genreTag: { color: '#E60000', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' },
  bigTitle: { fontSize: '4vw', lineHeight: '0.9', fontWeight: '900', textTransform: 'uppercase', margin: '0 0 10px 0' },
  artistName: { fontSize: '1.2rem', color: '#ccc', marginBottom: '20px' },
  
  signalContainer: { position: 'relative', zIndex: 9, width: '100%', height: '50px', marginBottom: '0px', pointerEvents: 'none' },
  decorativeStrip: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '10px', zIndex: 20 },
  noise: { position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'url("https://grains.imgix.net/grain.png")', zIndex: 0 },

  // --- PLAYER UI STYLES ---
  playerContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
    padding: '15px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '15px'
  },
  progressWrapper: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' },
  timeText: { fontFamily: 'monospace', minWidth: '40px' },
  progressBar: { flexGrow: 1, margin: '0 10px' },
  
  controlsRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' },
  mainPlayBtn: {
      background: 'transparent', border: '2px solid', borderRadius: '50%',
      width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center',
      cursor: 'pointer', transition: 'all 0.2s'
  },
  skipBtn: {
      background: 'transparent', border: 'none', color: '#888',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      cursor: 'pointer', transition: 'color 0.2s', padding: '10px'
  },
  statusText: {
      textAlign: 'center', fontSize: '0.7rem', color: '#666', letterSpacing: '2px', marginTop: '5px'
  }
};

export default DJsPicks;