import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAudio } from '../components/AudioContext'; 

const WORKER_URL = "https://djkace-api.elaanyu.workers.dev"; 

// --- DURATION COMPONENT (Keep this, it's useful) ---
const DurationFetcher = ({ audioUrl }) => {
  const [duration, setDuration] = useState("--:--");
  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.preload = "metadata";
    const onLoadedMetadata = () => {
      const totalSeconds = Math.floor(audio.duration);
      if (isNaN(totalSeconds) || totalSeconds === Infinity) return;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.src = "";
    };
  }, [audioUrl]);
  return <span>{duration}</span>;
};

const Mixes = () => {
  const container = useRef();
  const hoverImageRef = useRef(); // Ref for the floating image
  const { playTrack, currentTrack, isPlaying } = useAudio();
  const [mixes, setMixes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchMixes = async () => {
      try {
        const res = await fetch(WORKER_URL);
        if (!res.ok) throw new Error("API_ERROR");
        const data = await res.json();
        setMixes(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("SYSTEM OFFLINE");
        setLoading(false);
      }
    };
    fetchMixes();
  }, []);

  // --- HOVER IMAGE LOGIC ---
  const handleMouseEnter = (imageUrl) => {
    // Set the image source
    if(hoverImageRef.current) {
        hoverImageRef.current.src = imageUrl;
        // Reveal animation
        gsap.to(hoverImageRef.current, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    // Hide animation
    if(hoverImageRef.current) {
        gsap.to(hoverImageRef.current, { scale: 0.8, opacity: 0, duration: 0.3 });
    }
  };

  const handleMouseMove = (e) => {
    // Move image with cursor
    if(hoverImageRef.current) {
        gsap.to(hoverImageRef.current, {
            x: e.clientX + 20, // Offset slightly
            y: e.clientY - 100, // Center vertically roughly
            duration: 0.5,     // Smooth lag
            ease: "power3.out"
        });
    }
  };

  const isThisPlaying = (mixId) => currentTrack?.id === mixId && isPlaying;

  const formatDate = (dateString) => {
    if (!dateString) return "UNKNOWN";
    return new Date(dateString).toLocaleDateString("en-GB", { year: '2-digit', month: '2-digit', day: '2-digit' }); // Concise date
  };

  return (
    <div ref={container} style={styles.wrapper} onMouseMove={handleMouseMove}>
      
      {/* FLOATING HOVER IMAGE (Fixed Position) */}
      <img ref={hoverImageRef} style={styles.floatingImage} src="" alt="Preview" />

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>INDEX // ARCHIVE</h1>
        <div style={styles.meta}>
            <div>ENTRIES: {mixes.length}</div>
            <div>STATUS: {loading ? "SYNCING..." : "ONLINE"}</div>
        </div>
      </div>

      {loading && <div style={styles.centerMsg}>LOADING DATA...</div>}
      {error && <div style={styles.centerMsg}>/// ERROR: {error} ///</div>}

      {/* TERMINAL LIST */}
      {!loading && !error && (
        <div style={styles.listContainer}>
            {/* Table Header */}
            <div style={styles.rowHeader}>
                <div style={{flex: 1}}>ID</div>
                <div style={{flex: 4}}>TITLE</div>
                <div style={{flex: 2}}>GENRE</div>
                <div style={{flex: 2}}>DATE</div>
                <div style={{flex: 1}}>TIME</div>
                <div style={{flex: 1}}>STATUS</div>
            </div>

            {/* Rows */}
            {mixes.map((mix, index) => (
                <div 
                    key={mix.id} 
                    style={styles.row} 
                    className="mix-row"
                    onClick={() => playTrack(mix)}
                    onMouseEnter={() => handleMouseEnter(mix.image_url)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div style={{flex: 1, opacity: 0.5}}>0{index + 1}</div>
                    
                    <div style={{flex: 4, fontWeight: 'bold', fontSize: '1.2rem'}}>
                        {mix.title}
                    </div>
                    
                    <div style={{flex: 2, fontSize: '0.9rem'}}>
                        <span style={styles.tag}>{mix.genre || "N/A"}</span>
                    </div>
                    
                    <div style={{flex: 2, opacity: 0.7}}>
                        {formatDate(mix.created_at)}
                    </div>
                    
                    <div style={{flex: 1, fontFamily: 'monospace'}}>
                        <DurationFetcher audioUrl={mix.audio_url} />
                    </div>

                    <div style={{flex: 1, color: isThisPlaying(mix.id) ? '#E60000' : '#111'}}>
                        {isThisPlaying(mix.id) ? "● PLAYING" : "READY"}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const styles = {
  wrapper: {
    width: '100vw', minHeight: '100vh', backgroundColor: '#F1E9DB', color: '#111',
    fontFamily: '"Rajdhani", sans-serif', padding: '150px 5vw 100px 5vw', boxSizing: 'border-box',
    cursor: 'crosshair', position: 'relative', overflow: 'hidden' // Important for floating image
  },
  
  // Floating Image
  floatingImage: {
    position: 'fixed', top: 0, left: 0, width: '300px', height: '300px',
    objectFit: 'cover', pointerEvents: 'none', zIndex: 50,
    opacity: 0, transform: 'scale(0.8)', // Initial state
    border: '2px solid #E60000', filter: 'grayscale(100%) contrast(1.2)'
  },

  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
    borderBottom: '4px solid #111', paddingBottom: '10px', marginBottom: '40px'
  },
  title: { fontSize: '4rem', lineHeight: 0.9, fontWeight: '900', margin: 0 },
  meta: { textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold' },
  centerMsg: { textAlign: 'center', fontSize: '1.5rem', marginTop: '100px', fontWeight: 'bold' },

  // List Styles
  listContainer: { display: 'flex', flexDirection: 'column' },
  
  rowHeader: {
    display: 'flex', padding: '10px 20px', borderBottom: '1px solid #999',
    fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.8rem', color: '#666',
    letterSpacing: '1px'
  },
  
  row: {
    display: 'flex', alignItems: 'center', padding: '25px 20px', 
    borderBottom: '1px solid #ccc', cursor: 'pointer',
    transition: 'background 0.2s, padding-left 0.2s'
  },
  
  tag: {
    border: '1px solid #111', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase'
  }
};

// CSS Injection for Hover Effect
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  .mix-row:hover { background: #fff; padding-left: 35px !important; color: #E60000; }
  .mix-row:hover .tag { border-color: #E60000; color: #E60000; }
`;
document.head.appendChild(styleSheet);

export default Mixes;