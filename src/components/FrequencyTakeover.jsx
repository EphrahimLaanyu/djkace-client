import React, { useRef, useEffect } from 'react';
// import { useAudio } from '../components/AudioContext';
import gsap from 'gsap';

const FrequencyTakeover = () => {
  const { currentTrack, isFullScreen, toggleFullScreen, analyser } = useAudio();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Entry/Exit Animation
  useEffect(() => {
    if (isFullScreen) {
       gsap.to(containerRef.current, { opacity: 1, pointerEvents: 'all', duration: 0.5 });
    } else {
       gsap.to(containerRef.current, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
    }
  }, [isFullScreen]);

  // The Visualizer Loop
  useEffect(() => {
    if (!isFullScreen || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Buffer for audio data
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      // Get data
      analyser.getByteFrequencyData(dataArray);

      // Clear Screen
      ctx.fillStyle = '#050505'; // Deep black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Bars
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 1.5; // Scale height

        // Color Logic: Red for bass, fading to white for treble
        const r = barHeight + (25 * (i/bufferLength));
        const g = 0; 
        const b = 0;

        ctx.fillStyle = `rgb(${r},${r},${r})`; // Monochrome/Red shift
        if (i < 10) ctx.fillStyle = `rgb(${255}, 0, 0)`; // Bass is pure red

        // Draw centered bar
        ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);

        x += barWidth + 1;
      }

      animationId = requestAnimationFrame(render);
    };

    // Resize handler
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isFullScreen, analyser]);

  return (
    <div ref={containerRef} style={styles.container}>
        
        {/* CANVAS */}
        <canvas ref={canvasRef} style={styles.canvas} />

        {/* UI OVERLAY */}
        {currentTrack && (
            <div style={styles.ui}>
                <button onClick={toggleFullScreen} style={styles.closeBtn}>
                    [ EXIT IMMERSION ]
                </button>
                
                <div style={styles.centerInfo}>
                    <img src={currentTrack.image_url} style={styles.bigCover} />
                    <h1 style={styles.bigTitle}>{currentTrack.title}</h1>
                    <div style={styles.genre}>{currentTrack.genre}</div>
                </div>
            </div>
        )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed', inset: 0, zIndex: 10000,
    backgroundColor: '#050505', opacity: 0, pointerEvents: 'none' // Controlled by GSAP
  },
  canvas: { width: '100%', height: '100%' },
  ui: {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  },
  closeBtn: {
    position: 'absolute', top: '40px', right: '40px',
    background: 'transparent', border: '1px solid #fff', color: '#fff',
    padding: '10px 20px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '1rem'
  },
  centerInfo: { textAlign: 'center', mixBlendMode: 'difference' },
  bigCover: { width: '300px', height: '300px', objectFit: 'cover', marginBottom: '20px', filter: 'grayscale(100%)' },
  bigTitle: { color: '#fff', fontSize: '4rem', fontFamily: '"Rajdhani", sans-serif', textTransform: 'uppercase', margin: 0 },
  genre: { color: '#E60000', fontFamily: 'monospace', letterSpacing: '4px', marginTop: '10px' }
};

export default FrequencyTakeover;