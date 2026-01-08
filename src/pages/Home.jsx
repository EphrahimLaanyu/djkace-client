import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- IMPORT YOUR IMAGE ---
import djImage from '../assets/logourldarkblank.png';

// ==========================================
// 1. MAIN COMPONENT (Switcher) 
// ==========================================
const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileDesign /> : <DesktopOriginal />;
};

// ==========================================
// 2. MOBILE COMPONENT (Marquee Poster)
// ==========================================
const MobileDesign = () => {
  const container = useRef();

  return (
    <div ref={container} style={mobileStyles.wrapper}>
      {/* STATIC NOISE OVERLAY */}
      <div style={mobileStyles.noise}></div>

      {/* TOP BAR */}
      <div style={mobileStyles.topBar}>
        <span>NAIROBI <span style={{ color: '#009933' }}>//</span> KE</span>
        <span>VOL. 01</span>
      </div>

      {/* MAIN CONTENT - TYPOGRAPHY SANDWICH */}
      <div style={mobileStyles.container}>
        
        {/* TOP MARQUEE (OUTLINE) */}
        <MobileMarquee 
            text="DEEJAY" 
            direction={-1} 
            baseStyle={mobileStyles.titleOutline} 
        />

        {/* THE SHIELD (CENTERPIECE) */}
        <div style={mobileStyles.imageContainer}>
            <div style={mobileStyles.redLineVertical}></div>
            {/* IMAGE IS HERE - Style updated below */}
            <img src={djImage} alt="Kace Shield" style={mobileStyles.shieldImage} />
        </div>

        {/* BOTTOM MARQUEE (SOLID) */}
        <MobileMarquee 
            text="KACE" 
            direction={1} 
            baseStyle={mobileStyles.titleSolid} 
        />

        {/* TAGLINE */}
        <div style={mobileStyles.taglineBox}>
            <span style={mobileStyles.taglineText}>THE AFRICAN MZUNGU</span>
        </div>

      </div>

      {/* BOTTOM BAR */}
      <div style={mobileStyles.bottomBar}>
        EST. 2025 • ALL RIGHTS RESERVED
      </div>
    </div>
  );
};

// --- HELPER: MOBILE MARQUEE ---
const MobileMarquee = ({ text, direction, baseStyle }) => {
    const marqueeRef = useRef();
    
    useGSAP(() => {
        // Create seamless loop
        const content = marqueeRef.current;
        const totalWidth = content.scrollWidth / 2; // Half because we duplicate text
        
        gsap.to(content, {
            x: direction === 1 ? 0 : -totalWidth, // Move left or right
            duration: 15, // Speed of scroll
            ease: "none",
            repeat: -1,
            // If direction is 1 (right), start from -totalWidth to 0
            // If direction is -1 (left), start from 0 to -totalWidth
            modifiers: {
                x: gsap.utils.unitize(x => {
                    const val = parseFloat(x);
                    return direction === 1 
                        ? (val % totalWidth) - totalWidth 
                        : val % totalWidth;
                })
            }
        });
    }, { scope: marqueeRef });

    // Repeat text to ensure full coverage for loop
    const repeatedText = Array(8).fill(text).join(" • ");

    return (
        <div style={{ width: '100vw', overflow: 'hidden', position: 'relative', zIndex: 2 }}>
            <div ref={marqueeRef} style={{ ...baseStyle, display: 'flex', whiteSpace: 'nowrap', width: 'fit-content' }}>
                <span style={{ paddingRight: '20px' }}>{repeatedText}</span>
                <span style={{ paddingRight: '20px' }}>{repeatedText}</span>
            </div>
        </div>
    );
};

// ==========================================
// 3. DESKTOP COMPONENT (Original - Untouched)
// ==========================================
const DesktopOriginal = () => {
    const container = useRef();
    const ringRef = useRef(); 
    const tiltRef = useRef(); 
    const audioRingsRef = useRef(); 
  
    useGSAP(() => {
      const mm = gsap.matchMedia();
      gsap.set(".orbit-text", { opacity: 0 });
      gsap.set(".audio-rings", { opacity: 0, scale: 0.5 });
      gsap.set([".dj-hero", ".audio-rings", ".orbit-text"], { force3D: true });
  
      mm.add("(min-width: 769px)", () => {
          gsap.set(".dj-hero", { opacity: 0, scale: 0.8 });
          const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
          tl.to(".dj-hero", { opacity: 1, scale: 1, duration: 2 })
            .to(".audio-rings", { opacity: 1, scale: 1, duration: 1.5 }, "<") 
            .to(".orbit-text", { opacity: 1, duration: 1, stagger: 0.05 }, "-=0.5");
          
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
  
      gsap.to(ringRef.current, { rotationY: 360, duration: 20, repeat: -1, ease: "none", force3D: true });
      gsap.to(audioRingsRef.current, { rotationZ: 360, duration: 40, repeat: -1, ease: "none", force3D: true });
  
    }, { scope: container });
  
    const phrase = "DEEJAY KACE • THE AFRICAN MZUNGU • ";
    const textArray = new Array(4).fill(phrase).join("").split("");
    const angleStep = 360 / textArray.length;
  
    return (
      <div ref={container} style={styles.wrapper}>
        <div style={styles.noise}></div>
        <div style={styles.vignette}></div>
        <div style={styles.scene}>
          {/* IMAGE IS HERE - Style updated below */}
          <img src={djImage} className="dj-hero" alt="DJ Kace" style={styles.djImage} />
          <div ref={tiltRef} style={styles.tiltWrapper}>
              <div ref={audioRingsRef} className="audio-rings" style={styles.audioRingsContainer}>
                 <div style={styles.ringOuter}></div>  
                 <div style={styles.ringDashed}></div> 
                 <div style={styles.ringMiddle}></div> 
                 <div style={styles.ringInner}></div>  
              </div>
              <div ref={ringRef} style={styles.ringContainer}>
                {textArray.map((char, i) => (
                  <span key={i} className="orbit-text" style={{
                      ...styles.char,
                      transform: `rotateY(${i * angleStep}deg) translateZ(450px)`
                  }}>
                    {char}
                  </span>
                ))}
              </div>
          </div>
        </div>
        <div style={styles.bottomLeft}>NAIROBI // <span style={{ color: '#009933' }}>KE</span></div>
        <div style={styles.bottomRight}>EST. 2025</div>
      </div>
    );
};

// ==========================================
// 4. STYLES
// ==========================================

// --- MOBILE STYLES (Poster) ---
const mobileStyles = {
    wrapper: {
        backgroundColor: '#F1E9DB',
        height: '100dvh', // Dynamic viewport height
        width: '100vw', 
        overflow: 'hidden', 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', // Push top/bottom bars apart
        alignItems: 'center',
        fontFamily: '"Rajdhani", sans-serif',
        padding: '20px 0', // Removed horizontal padding to let marquee hit edges
        boxSizing: 'border-box'
    },
    noise: { 
        position: 'absolute', inset: 0, opacity: 0.08, 
        pointerEvents: 'none', background: 'url("https://grains.imgix.net/grain.png")', 
        zIndex: 0
    },
    
    // --- BARS ---
    topBar: {
        width: '90%', // Keep bars contained inside
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        fontWeight: '900',
        letterSpacing: '2px',
        color: '#111',
        borderBottom: '2px solid #111',
        paddingBottom: '10px',
        zIndex: 2
    },
    bottomBar: {
        width: '90%',
        textAlign: 'center',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        letterSpacing: '3px',
        color: '#E60000',
        borderTop: '2px solid #111',
        paddingTop: '15px',
        zIndex: 2
    },

    // --- MAIN CONTENT ---
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        zIndex: 1
    },

    // Typography
    titleOutline: {
        fontSize: '4.5rem',
        fontWeight: '900',
        lineHeight: '0.8',
        color: 'transparent',
        WebkitTextStroke: '2px #E60000', // UPDATED: Changed to Red
        letterSpacing: '-2px',
    },
    titleSolid: {
        fontSize: '4.5rem',
        fontWeight: '900',
        lineHeight: '0.8',
        color: '#E60000', // UPDATED: Changed to Red
        letterSpacing: '-2px',
    },

    // The Shield Layout
    imageContainer: {
        position: 'relative',
        width: '220px',
        height: '220px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px 0', // Space between "DEEJAY" and "KACE"
    },
    shieldImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        // UPDATED: Added grayscale(100%) to the existing drop-shadow filter
        filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.3)) grayscale(100%)', 
        zIndex: 5
    },
    // Decorative line behind the shield
    redLineVertical: {
        position: 'absolute',
        width: '2px',
        height: '140%', // Stretches behind text
        backgroundColor: '#E60000',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1
    },

    // Tagline
    taglineBox: {
        marginTop: '30px',
        backgroundColor: '#111',
        padding: '5px 15px',
        transform: 'skewX(-10deg)' // Stylish slant
    },
    taglineText: {
        color: '#F1E9DB',
        fontWeight: 'bold',
        letterSpacing: '2px',
        fontSize: '0.9rem',
        transform: 'skewX(10deg)', // Un-slant text
        display: 'inline-block'
    }
};

// --- DESKTOP STYLES (Original) ---
const styles = {
  wrapper: {
    backgroundColor: '#F1E9DB',
    height: '100dvh', width: '100vw',
    overflow: 'hidden', position: 'relative',
    fontFamily: '"Rajdhani", sans-serif',
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  noise: { position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'url("https://grains.imgix.net/grain.png")' },
  vignette: { position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.2) 150%)' },
  scene: { position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px', transformStyle: 'preserve-3d' },
  djImage: {
    height: '75%', width: 'auto', position: 'absolute', bottom: '10%', zIndex: 10,
    // UPDATED: Added grayscale filter here
    filter: 'grayscale(100%)',
    pointerEvents: 'none', transformStyle: 'preserve-3d', transform: 'translateZ(50px)'
  },
  tiltWrapper: { position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', transformStyle: 'preserve-3d' },
  audioRingsContainer: {
    position: 'absolute', width: '800px', height: '800px', 
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    transformStyle: 'preserve-3d', transform: 'translateZ(-100px)',
  },
  ringOuter: { position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', border: '2px solid rgba(0,0,0,0.1)' },
  ringDashed: { position: 'absolute', width: '85%', height: '85%', borderRadius: '50%', border: '1px dashed rgba(230, 0, 0, 0.4)' },
  ringMiddle: { position: 'absolute', width: '60%', height: '60%', borderRadius: '50%', border: '2px solid rgba(0, 153, 51, 0.5)' },
  ringInner: { position: 'absolute', width: '30%', height: '30%', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.2)', backgroundColor: 'rgba(230, 0, 0, 0.03)' },
  ringContainer: { position: 'absolute', transformStyle: 'preserve-3d', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  char: {
    position: 'absolute',
    fontSize: '3rem', 
    fontFamily: '"Playfair Display", serif', fontWeight: '900', fontStyle: 'italic', color: '#E60000',
    textTransform: 'uppercase', backfaceVisibility: 'visible', whiteSpace: 'pre'
  },
  bottomLeft: { position: 'absolute', bottom: '30px', left: '30px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', color: '#111' },
  bottomRight: { position: 'absolute', bottom: '30px', right: '30px', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.8rem', color: '#E60000' }
};

export default Home;