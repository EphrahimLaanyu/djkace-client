import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Footer = () => {
  const containerRef = useRef(null);
  const recordRef = useRef(null);

  useGSAP(() => {
    // 1. THE SPINNING ANIMATION
    const spin = gsap.to(recordRef.current, {
      rotation: 360,
      duration: 10,       // 10 seconds per revolution (33 1/3 RPM ish)
      repeat: -1,
      ease: "none",
      transformOrigin: "center center"
    });

    // 2. INTERACTION: Speed up on hover (Scratch effect)
    const recordEl = recordRef.current;
    
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

  }, { scope: containerRef });

  return (
    <footer ref={containerRef} style={styles.footerWrapper} itemScope itemType="https://schema.org/WPFooter">
      
      {/* LEFT SIDE: THE LINER NOTES (Content) */}
      <div style={styles.linerNotes}>
         
         <div style={styles.tracklistBlock}>
            <h4 style={styles.sideLabel}>SOCIALS // CONTACT</h4>
            <ul style={styles.trackList}>
                {/* INSTAGRAM */}
                <li style={styles.trackItem}>
                    <span style={styles.trackNum}>A1.</span>
                    <a 
                        href="https://www.instagram.com/deejaykace/" 
                        target="_blank" 
                        rel="noopener noreferrer me" // "me" tells Google this is YOU
                        style={styles.trackLink}
                        itemProp="sameAs" // Schema connection
                    >
                        INSTAGRAM (@deejaykace)
                    </a>
                    <span style={styles.trackTime}>↗</span>
                </li>

                {/* TIKTOK */}
                <li style={styles.trackItem}>
                    <span style={styles.trackNum}>A2.</span>
                    <a 
                        href="https://www.tiktok.com/@dj.kace" 
                        target="_blank" 
                        rel="noopener noreferrer me" 
                        style={styles.trackLink}
                        itemProp="sameAs"
                    >
                        TIKTOK (@dj.kace)
                    </a>
                    <span style={styles.trackTime}>↗</span>
                </li>

                {/* YOUTUBE */}
                <li style={styles.trackItem}>
                    <span style={styles.trackNum}>A3.</span>
                    <a 
                        href="https://www.youtube.com/@DeeJayKace" 
                        target="_blank" 
                        rel="noopener noreferrer me" 
                        style={styles.trackLink}
                        itemProp="sameAs"
                    >
                        YOUTUBE (@DeeJayKace)
                    </a>
                    <span style={styles.trackTime}>↗</span>
                </li>

                {/* EMAIL */}
                <li style={styles.trackItem}>
                    <span style={styles.trackNum}>B1.</span>
                    <a 
                        href="mailto:deejaykace@gmail.com" 
                        style={styles.trackLink}
                        itemProp="email"
                    >
                        EMAIL (deejaykace@gmail.com)
                    </a>
                    <span style={styles.trackTime}>✉</span>
                </li>
            </ul>
         </div>

         <div style={styles.creditsBlock}>
            <h4 style={styles.sideLabel}>CREDITS</h4>
            <div style={styles.creditGrid}>
                <div style={styles.creditItem}>
                    <span style={styles.role}>EXECUTIVE PRODUCER</span>
                    <span style={styles.name} itemProp="producer">DEEJAY KACE</span>
                </div>
                <div style={styles.creditItem}>
                    <span style={styles.role}>DEVELOPMENT & CODE</span>
                    {/* DEVELOPER SECTION */}
                    <div style={styles.devBadge}>
                         <span style={styles.devName}>J & M</span>
                         <a href="mailto:barcodetech@gmail.com" style={styles.devLink}>barcodetech@gmail.com</a>
                    </div>
                </div>
                <div style={styles.creditItem}>
                    <span style={styles.role}>RECORDED AT</span>
                    <span style={styles.name}>NAIROBI, KE</span>
                </div>
            </div>
         </div>
         
         <div style={styles.copyright}>
            © 2025 DEEJAY KACE. UNAUTHORIZED DUPLICATION IS A VIOLATION OF APPLICABLE LAWS.
         </div>
      </div>

      {/* RIGHT SIDE: THE RECORD (SVG) */}
      <div style={styles.recordContainer}>
        <svg 
            ref={recordRef}
            viewBox="0 0 600 600" 
            style={styles.recordSvg}
        >
            {/* DEFINITIONS FOR TEXT PATHS */}
            <defs>
                <path id="circlePath1" d="M 300, 300 m -240, 0 a 240,240 0 1,1 480,0 a 240,240 0 1,1 -480,0" />
                <path id="circlePath2" d="M 300, 300 m -190, 0 a 190,190 0 1,1 380,0 a 190,190 0 1,1 -380,0" />
            </defs>

            {/* 1. VINYL BASE (Black with subtle ridges) */}
            <circle cx="300" cy="300" r="295" fill="#111" />
            <circle cx="300" cy="300" r="290" fill="none" stroke="#222" strokeWidth="2" />
            <circle cx="300" cy="300" r="280" fill="none" stroke="#1a1a1a" strokeWidth="4" />
            <circle cx="300" cy="300" r="270" fill="none" stroke="#222" strokeWidth="1" />
            
            {/* 2. GROOVE TEXT 1 (Outer Ring) */}
            <text fill="#444" fontSize="14" fontFamily="monospace" letterSpacing="4" fontWeight="bold">
                <textPath href="#circlePath1" startOffset="0%">
                    ALL RIGHTS RESERVED • DEEJAY KACE • NAIROBI KENYA • EST 2025 • ORIGINAL MASTER RECORDING • 
                </textPath>
            </text>

            {/* 3. GROOVE TEXT 2 (Inner Ring - Developer) */}
            <text fill="#E60000" fontSize="12" fontFamily="monospace" letterSpacing="5" fontWeight="bold">
                <textPath href="#circlePath2" startOffset="50%">
                    DEVELOPED BY J&E MAISON • HIGH FIDELITY CODE • 
                </textPath>
            </text>

            {/* 4. THE LABEL (Center Red Part) */}
            <circle cx="300" cy="300" r="100" fill="#E60000" />
            <circle cx="300" cy="300" r="15" fill="#fff" /> {/* Spindle Hole */}
            
            {/* Label Text */}
            <text x="300" y="260" textAnchor="middle" fill="#000" fontSize="24" fontWeight="900" fontFamily="sans-serif">KACE</text>
            <text x="300" y="280" textAnchor="middle" fill="#000" fontSize="10" fontFamily="monospace">STEREO</text>
            <text x="300" y="340" textAnchor="middle" fill="#000" fontSize="10" fontFamily="monospace">33 1/3 RPM</text>
            
            {/* Glossy Reflection Overlay */}
            <circle cx="300" cy="300" r="295" fill="url(#reflection)" opacity="0.1" pointerEvents="none"/>
            <linearGradient id="reflection" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="50%" stopColor="#fff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

        </svg>

        {/* The "Paper Sleeve" Corner Effect */}
        <div style={styles.sleeveShadow}></div>
      </div>

    </footer>
  );
};

// --- STYLES ---
const styles = {
  footerWrapper: {
    backgroundColor: '#F1E9DB', // Paper sleeve color
    color: '#111',
    fontFamily: '"Space Mono", monospace',
    display: 'flex',
    flexWrap: 'wrap', // Stacks on mobile
    overflow: 'hidden',
    position: 'relative',
    borderTop: '1px solid #ccc'
  },

  // --- LEFT SIDE: LINER NOTES ---
  linerNotes: {
    flex: '1 1 400px', // Grows, shrinks, base width 400px
    padding: '60px 40px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    zIndex: 10
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


  // --- RIGHT SIDE: THE RECORD ---
  recordContainer: {
    flex: '1 1 400px',
    backgroundColor: '#111', // Dark background for the record contrast
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
    cursor: 'grab' // Indicates interaction
  },

  // Visual polish
  sleeveShadow: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '20px',
    background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
    pointerEvents: 'none'
  }
};

export default Footer;