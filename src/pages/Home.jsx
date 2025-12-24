import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- IMPORT YOUR IMAGE ---
import djImage from '../assets/DSC02056-removebg-preview.png';

const Home = () => {
  const container = useRef();
  const ringRef = useRef(); 
  const tiltRef = useRef(); 
  const audioRingsRef = useRef(); 

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // 1. SETUP (Common)
    gsap.set(".orbit-text", { opacity: 0 });
    gsap.set(".audio-rings", { opacity: 0, scale: 0.5 });
    
    // --- PERFORMANCE OPTIMIZATION ---
    // Tell browser to prepare GPU for these elements
    gsap.set([".dj-hero", ".audio-rings", ".orbit-text"], { 
        force3D: true 
    });

    // 2. DESKTOP ANIMATION (Full Quality)
    mm.add("(min-width: 769px)", () => {
        gsap.set(".dj-hero", { 
            opacity: 0, 
            scale: 0.8, 
            filter: "blur(10px) grayscale(100%) contrast(1.1)" // Blur allowed on Desktop
        });

        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

        tl.to(".dj-hero", { 
            opacity: 1, 
            scale: 1, 
            filter: "blur(0px) grayscale(100%) contrast(1.1)", 
            duration: 2 
        })
        .to(".audio-rings", { opacity: 1, scale: 1, duration: 1.5 }, "<") 
        .to(".orbit-text", { opacity: 1, duration: 1, stagger: 0.05 }, "-=0.5");
        
        // Mouse Tilt (Desktop Only)
        const handleMouseMove = (e) => {
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 2;
            const y = (e.clientY / innerHeight - 0.5) * 2;
    
            gsap.to(tiltRef.current, { 
              rotationX: -y * 20, rotationZ: x * 10, rotationY: x * 20, duration: 1.5, ease: "power2.out", overwrite: "auto"
            });
            gsap.to(".dj-hero", { 
              x: x * 20, y: y * 20, rotationX: -y * 5, rotationY: x * 5, duration: 2, ease: "power2.out", overwrite: "auto"
            });
          };
          window.addEventListener("mousemove", handleMouseMove);
          return () => window.removeEventListener("mousemove", handleMouseMove);
    });

    // 3. MOBILE ANIMATION (High Performance)
    mm.add("(max-width: 768px)", () => {
        // NO BLUR FILTER ON MOBILE - This is the #1 cause of lag
        gsap.set(".dj-hero", { 
            opacity: 0, 
            scale: 0.8, 
            filter: "grayscale(100%) contrast(1.1)" // Removed Blur
        });

        const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

        tl.to(".dj-hero", { 
            opacity: 1, 
            scale: 1, 
            // We do not animate the filter on mobile, just opacity/scale
            duration: 1.5 
        })
        .to(".audio-rings", { opacity: 1, scale: 1, duration: 1.5 }, "<") 
        .to(".orbit-text", { opacity: 1, duration: 1, stagger: 0.05 }, "-=0.5");
    });

    // 4. INFINITE ROTATIONS (Common)
    // Use force3D: true to keep it on the GPU
    gsap.to(ringRef.current, { 
        rotationY: 360, 
        duration: 20, 
        repeat: -1, 
        ease: "none",
        force3D: true 
    });
    
    gsap.to(audioRingsRef.current, { 
        rotationZ: 360, 
        duration: 40, 
        repeat: -1, 
        ease: "none",
        force3D: true
    });

  }, { scope: container });

  // --- ORBIT TEXT HELPER ---
  const phrase = "DEEJAY KACE • AFRICAN MZUNGU • ";
  const textArray = new Array(4).fill(phrase).join("").split("");
  const angleStep = 360 / textArray.length;

  return (
    <div ref={container} style={styles.wrapper}>
      
      {/* Background */}
      <div style={styles.noise}></div>
      <div style={styles.vignette}></div>

      {/* 3D SCENE */}
      <div style={styles.scene}>
        
        {/* 1. DJ HERO */}
        <img src={djImage} className="dj-hero" alt="DJ Kace" style={styles.djImage} />

        {/* 2. TILT WRAPPER */}
        <div ref={tiltRef} style={styles.tiltWrapper}>
            
            {/* AUDIO RINGS */}
            <div ref={audioRingsRef} className="audio-rings" style={styles.audioRingsContainer}>
               <div style={styles.ringOuter}></div>
               <div style={styles.ringDashed}></div>
               <div style={styles.ringMiddle}></div>
               <div style={styles.ringInner}></div>
            </div>

            {/* TEXT RING */}
            <div ref={ringRef} style={styles.ringContainer}>
              {textArray.map((char, i) => (
                <span key={i} className="orbit-text" style={{
                    ...styles.char,
                    transform: `rotateY(${i * angleStep}deg) translateZ(var(--orbit-radius))`
                }}>
                  {char}
                </span>
              ))}
            </div>

        </div>
      </div>

      <div style={styles.bottomLeft}>NAIROBI // KE</div>
      <div style={styles.bottomRight}>EST. 2025</div>

      {/* --- RESPONSIVE STYLES INJECTION --- */}
      <style>{`
        :root {
          --orbit-radius: 450px;
          --ring-size: 800px;
          --font-size: 3rem;
        }

        /* PERFORMANCE FIX: 
           will-change tells the browser these elements will move,
           so it puts them on their own compositor layer.
        */
        .dj-hero, .audio-rings, .orbit-text, .ringContainer {
            will-change: transform, opacity;
            backface-visibility: hidden; /* Helps mobile render smoother */
        }

        @media (max-width: 1024px) {
          :root {
            --orbit-radius: 350px;
            --ring-size: 600px;
            --font-size: 2.2rem;
          }
        }

        @media (max-width: 768px) {
          :root {
            --orbit-radius: 200px; 
            --ring-size: 380px;    
            --font-size: 1.2rem;   
          }
          
          .dj-hero {
            height: 60% !important; 
            bottom: 10% !important;
          }

          .bottom-text {
            font-size: 0.6rem !important;
            bottom: 20px !important;
          }
        }
      `}</style>

    </div>
  );
};

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
  noise: { position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'url("https://grains.imgix.net/grain.png")' },
  vignette: { position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.2) 150%)' },
  
  scene: { position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px', transformStyle: 'preserve-3d' },

  djImage: {
    height: '85%', width: 'auto', position: 'absolute', bottom: 0, zIndex: 10,
    filter: 'grayscale(100%) contrast(1.1)', // Static filter is okay, animating it is bad
    pointerEvents: 'none', transformStyle: 'preserve-3d', transform: 'translateZ(50px)'
  },

  tiltWrapper: { position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transformStyle: 'preserve-3d' },

  // --- AUDIO RINGS ---
  audioRingsContainer: {
    position: 'absolute',
    width: 'var(--ring-size)', height: 'var(--ring-size)', 
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    transformStyle: 'preserve-3d', transform: 'translateZ(-100px)',
  },
  ringOuter: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.1)' },
  ringDashed: { position: 'absolute', width: '85%', height: '85%', borderRadius: '50%', border: '1px dashed rgba(230, 0, 0, 0.3)' },
  ringMiddle: { position: 'absolute', width: '60%', height: '60%', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.05)' },
  ringInner: { position: 'absolute', width: '30%', height: '30%', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)', backgroundColor: 'rgba(230, 0, 0, 0.05)' },

  // --- TEXT RING ---
  ringContainer: { position: 'absolute', transformStyle: 'preserve-3d', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  char: {
    position: 'absolute',
    fontSize: 'var(--font-size)', 
    fontFamily: '"Playfair Display", serif', fontWeight: '900', fontStyle: 'italic', color: '#E60000',
    textTransform: 'uppercase', backfaceVisibility: 'visible', whiteSpace: 'pre'
  },

  bottomLeft: { position: 'absolute', bottom: '30px', left: '30px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', color: '#111', className: 'bottom-text' },
  bottomRight: { position: 'absolute', bottom: '30px', right: '30px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', color: '#E60000', className: 'bottom-text' }
};

export default Home;