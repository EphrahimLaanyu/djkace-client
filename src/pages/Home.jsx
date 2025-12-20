import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- IMPORT YOUR IMAGE ---
import djImage from '../assets/DSC02056-removebg-preview.png'; 

const Home = () => {
  const container = useRef();
  const ringRef = useRef(); // The part that spins forever
  const tiltRef = useRef(); // The part we tilt with the mouse

  useGSAP(() => {
    // ----------------------------------------------------------------
    // 1. INITIAL SETUP
    // ----------------------------------------------------------------
    gsap.set(".orbit-text", { opacity: 0 });
    gsap.set(".dj-hero", { 
      opacity: 0, 
      scale: 0.8, 
      filter: "blur(10px) grayscale(100%) contrast(1.1)" 
    });

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    // Reveal Sequence
    tl.to(".dj-hero", { 
        opacity: 1, 
        scale: 1, 
        filter: "blur(0px) grayscale(100%) contrast(1.1)", 
        duration: 2 
      })
      .to(".orbit-text", { 
        opacity: 1, 
        duration: 1, 
        stagger: 0.05 
      }, "-=1.0");

    // ----------------------------------------------------------------
    // 2. INFINITE ROTATION (The Inner Ring)
    // ----------------------------------------------------------------
    gsap.to(ringRef.current, {
      rotationY: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

  }, { scope: container });

  // ----------------------------------------------------------------
  // 3. MOUSE INTERACTION (The "Cool" Part)
  // ----------------------------------------------------------------
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse position (-1 to 1)
      const x = (e.clientX / innerWidth - 0.5) * 2; 
      const y = (e.clientY / innerHeight - 0.5) * 2;

      // A. Tilt the Ring Wrapper (Gyroscope Effect)
      gsap.to(tiltRef.current, {
        rotationX: -y * 20, // Tilt Up/Down (Inverted feels more natural)
        rotationZ: x * 10,  // Bank Left/Right
        rotationY: x * 20,  // Pan Left/Right
        duration: 1.5,      // Smooth "weighty" feel
        ease: "power2.out"
      });

      // B. Parallax the DJ Image (Opposite direction for depth)
      gsap.to(".dj-hero", {
        x: x * 20,          // Move slightly right
        y: y * 20,          // Move slightly down
        rotationX: -y * 5,  // Subtle 3D lean
        rotationY: x * 5,
        duration: 2,
        ease: "power2.out"
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: container });

  // --- ORBIT TEXT HELPER ---
  const phrase = "DEEJAY KACE • THE ARCHIVE • ";
  const textArray = new Array(4).fill(phrase).join("").split(""); 
  const angleStep = 360 / textArray.length; 

  return (
    <div ref={container} style={styles.wrapper}>
      
      {/* Background */}
      <div style={styles.noise}></div>
      <div style={styles.vignette}></div>

      {/* 3D SCENE */}
      <div style={styles.scene}>
        
        {/* 1. DJ HERO (Static Center) */}
        <img 
          src={djImage} 
          className="dj-hero" 
          alt="DJ Kace" 
          style={styles.djImage} 
        />

        {/* 2. TILT WRAPPER (Controlled by Mouse) */}
        <div ref={tiltRef} style={styles.tiltWrapper}>
            
            {/* 3. SPINNING RING (Infinite Animation) */}
            <div ref={ringRef} style={styles.ringContainer}>
              {textArray.map((char, i) => (
                <span 
                  key={i} 
                  className="orbit-text"
                  style={{
                    ...styles.char,
                    // Push letters out 450px to form the circle
                    transform: `rotateY(${i * angleStep}deg) translateZ(450px)`
                  }}
                >
                  {char}
                </span>
              ))}
            </div>

        </div>

      </div>

      <div style={styles.bottomLeft}>NAIROBI // KE</div>
      <div style={styles.bottomRight}>EST. 2025</div>

    </div>
  );
};

// --- STYLES ---
const styles = {
  wrapper: {
    backgroundColor: '#F1E9DB',
    height: '100dvh',
    width: '100vw',
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '"Rajdhani", sans-serif',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  noise: {
    position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
    background: 'url("https://grains.imgix.net/grain.png")'
  },
  vignette: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.2) 150%)'
  },
  
  // 3D STAGE
  scene: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    perspective: '1000px', // Lower = More dramatic 3D effect
    transformStyle: 'preserve-3d'
  },

  // DJ IMAGE
  djImage: {
    height: '85%', width: 'auto',
    position: 'absolute', bottom: 0,
    zIndex: 10,
    filter: 'grayscale(100%) contrast(1.1)', 
    pointerEvents: 'none',
    transformStyle: 'preserve-3d' // Allows it to react to 3D tilts
  },

  // NEW: TILT WRAPPER (The mouse interacts with this)
  tiltWrapper: {
    position: 'absolute',
    width: '100%', height: '100%',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    transformStyle: 'preserve-3d'
  },

  // INNER RING (This just spins)
  ringContainer: {
    position: 'absolute',
    transformStyle: 'preserve-3d', 
    width: '100%', height: '100%',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    // We removed the static rotateX(10deg) because the mouse controls it now
  },

  // LETTERS
  char: {
    position: 'absolute',
    fontSize: '3rem',
    fontFamily: '"Playfair Display", serif',
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#E60000',
    textTransform: 'uppercase',
    backfaceVisibility: 'visible',
    whiteSpace: 'pre'
  },

  bottomLeft: { position: 'absolute', bottom: '30px', left: '30px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', color: '#111' },
  bottomRight: { position: 'absolute', bottom: '30px', right: '30px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', color: '#E60000' }
};

export default Home;