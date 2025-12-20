import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// IMPORT YOUR IMAGE HERE
// Make sure the path matches exactly where your file is
import djImage from '../assets/IMG_9811-removebg-preview.png';

const Home = () => {
  const container = useRef();
  const plusRef = useRef();
  const hudRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    // Initial State
    gsap.set(".tech-char", { opacity: 0, color: "#111" });
    gsap.set(".main-hud", { opacity: 0, scale: 1.05 });
    gsap.set(".red-alert", { opacity: 0 });
    // Hide the DJ image initially (pushed down slightly)
    gsap.set(".dj-cutout", { opacity: 0, y: 50, filter: "grayscale(100%) contrast(1.2)" });

    tl
      // 1. System Boot
      .to(".tech-char", { 
        opacity: 1, color: "#111", stagger: { amount: 0.4, from: "random" }, 
        duration: 0.1, repeat: 3, yoyo: true
      })
      .to(".tech-char", { opacity: 1, duration: 0.1 })

      // 2. Red Warning Zoom
      .to(plusRef.current, { 
        scale: 200, rotation: 90, color: "#E60000", duration: 2.2,
        ease: "expo.inOut", delay: 0.2
      })

      // 3. Reveal Interface
      .to(".intro-layer", { opacity: 0, display: "none", duration: 0.5 }, "-=1.0")
      .to(".main-hud", { opacity: 1, scale: 1, duration: 1.2 }, "-=0.8")
      
      // 4. Reveal DJ Image (Slow rise)
      .to(".dj-cutout", { 
        opacity: 1, y: 0, duration: 1.5, ease: "power3.out" 
      }, "-=1.0")

      // 5. Reveal Text & Elements
      .to(".red-alert", { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 }, "-=0.8");

  }, { scope: container });

  // Parallax Effect (Moves image and HUD at different speeds for depth)
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      
      // HUD moves slightly
      gsap.to(hudRef.current, { x: x * 15, y: y * -15, duration: 1 });
      
      // DJ Image moves LESS (creates depth behind text)
      gsap.to(".dj-cutout", { x: x * 5, y: y * -5, duration: 1 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: container });

  return (
    <div ref={container} style={styles.techWrapper}>
      <div style={styles.scanlines}></div>
      <div style={styles.vignette}></div>

      {/* Intro Layer */}
      <div className="intro-layer" style={styles.introLayer}>
        <div style={styles.logoFlex}>
          <div style={styles.textContainer}><span className="tech-char" style={styles.char}>D</span><span className="tech-char" style={styles.char}>J</span></div>
          <div ref={plusRef} style={styles.plusWrapper}>+</div>
          <div style={styles.textContainer}><span className="tech-char" style={styles.char}>K</span><span className="tech-char" style={styles.char}>A</span><span className="tech-char" style={styles.char}>C</span><span className="tech-char" style={styles.char}>E</span></div>
        </div>
      </div>

      {/* Main HUD */}
      <div className="main-hud" style={styles.mainHud}>
        <div ref={hudRef} style={styles.hudInner}>
          
          {/* THE DJ IMAGE (Positioned behind text) */}
          <img src={djImage} className="dj-cutout" alt="DJ Kace" style={styles.djImage} />

          <div style={styles.cornerTL}>SYSTEM.READY</div>
          <div style={styles.cornerTR}>AUDIO_ENGINE_V.2.0</div>

          <div style={styles.centerContent}>
            <p className="red-alert" style={styles.subTag}>WARNING: HIGH VOLTAGE AUDIO</p>
            
            {/* The text sits ON TOP of the image */}
            <h1 style={styles.heroTitle}>DEEJAY<br/><span style={styles.hollowText}>KACE</span></h1>
            
            <div style={styles.decoBar}><div style={styles.decoFill}></div></div>

            <div style={styles.btnGrid}>
              <button style={styles.primaryBtn}>LATEST MIXES</button>
              <button style={styles.secondaryBtn}>INITIATE BOOKING</button>
            </div>
          </div>

          <div style={styles.cornerBL}>NAIROBI // KE</div>
          <div style={styles.cornerBR}><span style={{color: '#E60000'}}>●</span> LIVE</div>

        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  techWrapper: {
    backgroundColor: '#F1E9DB',
    height: '100dvh', width: '100vw', overflow: 'hidden', position: 'relative',
    fontFamily: '"Rajdhani", sans-serif', color: '#111'
  },
  scanlines: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 900,
    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.04) 3px)',
    backgroundSize: '100% 4px',
  },
  vignette: {
    position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 800,
    background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.15) 140%)'
  },
  introLayer: {
    position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100,
    backgroundColor: '#F1E9DB'
  },
  logoFlex: {
    display: 'flex', alignItems: 'center', gap: '20px',
    fontSize: 'clamp(3rem, 12vw, 10rem)', fontWeight: '700', letterSpacing: '10px'
  },
  char: { display: 'inline-block', color: '#111' },
  plusWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#111' },
  
  mainHud: {
    height: '100dvh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: '20px', boxSizing: 'border-box'
  },
  hudInner: {
    width: '100%', height: '100%',
    border: '1px solid rgba(0,0,0,0.15)',
    position: 'relative',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.4)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
    overflow: 'hidden' // Keeps image inside the border
  },
  
  // NEW IMAGE STYLE
  djImage: {
    position: 'absolute',
    bottom: 0, // Anchored to bottom
    height: '85%', // Adjust this based on how tall you want to appear
    width: 'auto',
    objectFit: 'contain',
    zIndex: 1, // Behind the text (Z-index 10)
    filter: 'grayscale(100%) contrast(1.1)', // Black & White look fits the "Off-White" theme perfectly
    opacity: 0.9,
    pointerEvents: 'none'
  },

  cornerTL: { position: 'absolute', top: '20px', left: '20px', fontSize: '0.8rem', letterSpacing: '2px', color: '#444', fontWeight: '600', zIndex: 20 },
  cornerTR: { position: 'absolute', top: '20px', right: '20px', fontSize: '0.8rem', letterSpacing: '2px', color: '#444', fontWeight: '600', zIndex: 20 },
  cornerBL: { position: 'absolute', bottom: '20px', left: '20px', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: '800', zIndex: 20 },
  cornerBR: { position: 'absolute', bottom: '20px', right: '20px', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: '800', zIndex: 20 },

  centerContent: { textAlign: 'center', zIndex: 10, position: 'relative' }, // Above Image
  subTag: { color: '#E60000', fontSize: '0.9rem', letterSpacing: '4px', fontWeight: '800', marginBottom: '10px' },
  
  heroTitle: {
    fontSize: 'clamp(4rem, 15vw, 12rem)', lineHeight: 0.85, margin: 0, fontWeight: '800',
    color: '#111', textTransform: 'uppercase'
  },
  // HOLLOW TEXT creates a window to see the image behind it
  hollowText: {
    WebkitTextStroke: '2px #111', 
    color: 'transparent' 
  },
  
  decoBar: { width: '2px', height: '60px', backgroundColor: '#ccc', margin: '30px auto', position: 'relative', overflow: 'hidden' },
  decoFill: { width: '100%', height: '50%', backgroundColor: '#E60000', position: 'absolute', top: 0 },
  btnGrid: { display: 'flex', gap: '20px', marginTop: '30px', justifyContent: 'center', flexWrap: 'wrap' },
  primaryBtn: {
    padding: '18px 50px', backgroundColor: '#111', color: '#F1E9DB', border: 'none',
    fontSize: '1rem', fontWeight: '700', letterSpacing: '2px', cursor: 'pointer',
    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
  },
  secondaryBtn: {
    padding: '18px 50px', backgroundColor: 'transparent', color: '#E60000', border: '2px solid #E60000',
    fontSize: '1rem', fontWeight: '800', letterSpacing: '2px', cursor: 'pointer',
    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
  }
};

export default Home;