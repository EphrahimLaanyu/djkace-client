import React, { useRef, useState, useEffect } from 'react';
import { useAudio } from '../components/AudioContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const MiniDiscWidget = () => {
  const { currentTrack, isPlaying, togglePlay } = useAudio();
  const widgetRef = useRef(null);
  
  // --- DRAGGABLE PHYSICS STATE ---
  const [position, setPosition] = useState({ x: 20, y: 20 }); // Start Bottom-Left
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Entry Animation
  useGSAP(() => {
    if (currentTrack) {
        gsap.fromTo(widgetRef.current, 
            { y: 100, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
  }, { dependencies: [currentTrack] });

  // --- MOUSE HANDLERS ---
  const handleMouseDown = (e) => {
    isDragging.current = true;
    const rect = widgetRef.current.getBoundingClientRect();
    // Calculate click offset relative to the widget
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top 
    };
    
    // Attach global listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Visual feedback
    gsap.to(widgetRef.current, { scale: 1.05, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', duration: 0.2 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    
    // Calculate new position
    // Note: We are positioning using 'left' and 'bottom'
    const newX = e.clientX - dragOffset.current.x;
    
    // Invert Y because CSS 'bottom' works upwards, but mouse 'clientY' works downwards
    const newY = window.innerHeight - (e.clientY - dragOffset.current.y) - 120; // 120 = approx widget height
    
    setPosition({ 
        x: Math.max(0, Math.min(window.innerWidth - 280, newX)), // Clamp X
        y: Math.max(0, Math.min(window.innerHeight - 120, newY)) // Clamp Y
    }); 
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    
    // Release visual
    gsap.to(widgetRef.current, { scale: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', duration: 0.2 });
  };

  // Don't render if stopped
  if (!currentTrack) return null;

  return (
    <div 
      ref={widgetRef}
      style={{ ...styles.widget, left: position.x, bottom: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* SPINNING DISC ART */}
      <div style={styles.discWrapper}>
         <img 
            src={currentTrack.image_url} 
            alt="Cover" 
            style={{
                ...styles.discArt,
                animation: isPlaying ? 'spin 4s linear infinite' : 'none'
            }} 
         />
         {/* Center Spindle */}
         <div style={styles.discHole}></div>
      </div>

      {/* TRACK INFO & CONTROLS */}
      <div style={styles.controls}>
         <div style={styles.trackInfo}>
             <div style={styles.title}>{currentTrack.title}</div>
             <div style={styles.status}>
                {isPlaying ? "● SPINNING @ 128BPM" : "|| PAUSED"}
             </div>
         </div>
         
         <div style={styles.btnRow}>
             <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
                style={styles.btnMain}
             >
                {isPlaying ? "PAUSE" : "PLAY"}
             </button>
         </div>
      </div>
      
      {/* DECORATIVE DRAG HANDLE */}
      <div style={styles.dragHandle}>::: GRIP :::</div>

    </div>
  );
};

// --- STYLES ---
const styles = {
  widget: {
    position: 'fixed', zIndex: 9999,
    width: '280px', height: '110px',
    backgroundColor: 'rgba(5, 5, 5, 0.85)', // Dark glass
    backdropFilter: 'blur(12px)',
    borderRadius: '55px', // Pill shape
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex', alignItems: 'center', padding: '8px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    cursor: 'grab', userSelect: 'none',
    transition: 'box-shadow 0.2s, transform 0.2s'
  },
  discWrapper: {
    width: '94px', height: '94px', flexShrink: 0,
    position: 'relative', borderRadius: '50%', overflow: 'hidden',
    border: '2px solid #111', backgroundColor: '#000',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
  },
  discArt: { width: '100%', height: '100%', objectFit: 'cover' },
  discHole: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '15px', height: '15px', backgroundColor: '#050505', 
    borderRadius: '50%', border: '2px solid #333'
  },
  controls: {
    flex: 1, paddingLeft: '15px', paddingRight: '10px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px'
  },
  trackInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  title: { 
    color: '#F1E9DB', fontWeight: '800', fontSize: '0.85rem', 
    whiteSpace: 'nowrap', overflow: 'hidden', width: '130px', 
    textOverflow: 'ellipsis', fontFamily: '"Rajdhani", sans-serif',
    textTransform: 'uppercase'
  },
  status: { color: '#E60000', fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: '1px' },
  
  btnRow: { display: 'flex', width: '100%' },
  btnMain: {
    flex: 1, background: '#F1E9DB', color: '#111', border: 'none', borderRadius: '20px',
    padding: '6px 0', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'monospace',
    fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase',
    transition: 'background 0.2s'
  },
  
  dragHandle: {
    position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
    fontSize: '0.6rem', color: '#666', fontFamily: 'monospace', letterSpacing: '3px',
    pointerEvents: 'none'
  }
};

// CSS Injection for Spin Animation
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);

export default MiniDiscWidget;