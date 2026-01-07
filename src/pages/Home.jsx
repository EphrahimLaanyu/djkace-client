import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- IMPORTS ---
import djImage from '../assets/DSC02056-removebg-preview.png';
import logoImage from '../assets/Artboard_3_page-0001-removebg-preview.png';

const Home = () => {
  const container = useRef();
  
  useGSAP(() => {
    const mm = gsap.matchMedia();

    // 1. INITIAL SETUP
    gsap.set(".hero-img", { y: 100, opacity: 0, scale: 0.9 });
    gsap.set(".marquee-row", { opacity: 0, y: 50 });
    gsap.set(".script-text", { scale: 0, rotation: -10, opacity: 0 });
    gsap.set(".logo-brand", { y: -30, opacity: 0 });
    gsap.set([".meta-left", ".meta-right"], { opacity: 0 });

    // 2. ENTRANCE ANIMATION
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".logo-brand", { y: 0, opacity: 1, duration: 1 })
      .to(".marquee-row", { y: 0, opacity: 1, duration: 1, stagger: 0.2 }, "-=0.5")
      .to(".hero-img", { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "circ.out" }, "-=0.8")
      .to(".script-text", { scale: 1, rotation: -5, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.5")
      .to([".meta-left", ".meta-right"], { opacity: 1, duration: 1 }, "-=0.5");

    // 3. INFINITE MARQUEE ANIMATION
    gsap.to(".marquee-track-1", { xPercent: -50, repeat: -1, duration: 20, ease: "none" });
    gsap.fromTo(".marquee-track-2", { xPercent: -50 }, { xPercent: 0, repeat: -1, duration: 20, ease: "none" });

    // 4. DESKTOP PARALLAX
    mm.add("(min-width: 1025px)", () => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            gsap.to(".hero-img", { x: -x * 1.5, y: -y * 1.5, duration: 1 });
            gsap.to(".script-text", { x: x * 2, y: y * 2, duration: 1 });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    });

    // MOBILE RESPONSIVE ADJUSTMENTS
    mm.add("(max-width: 767px)", () => {
      gsap.set(".marquee-wrapper-top", { top: "20%" });
      gsap.set(".marquee-wrapper-bottom", { bottom: "15%" });
      gsap.set(".scriptOverlay", { top: "55%", right: "5%" });
      gsap.set([".meta-left", ".meta-right"], { display: "none" });
      gsap.set(".hero-img", { objectPosition: "bottom center" });
      gsap.set(".logo-brand", { height: "50px" });
      gsap.set(".magazine-wrapper", { 
        justifyContent: "flex-start",
        height: "auto",
        minHeight: "100dvh"
      });
      gsap.set(".nav-header", { marginBottom: "30px" });
    });

  }, { scope: container });

  const marqueeText = "THE AFRICAN MZUNGU • THE AFRICAN MZUNGU • THE AFRICAN MZUNGU • ";

  return (
    <div ref={container} style={styles.wrapper} className="magazine-wrapper">
      <div style={styles.noise}></div>
      <div style={styles.vignette}></div>
      <div style={styles.gridLines}></div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.mainContent}>
          
          {/* 1. HEADER LOGO */}
          <div style={styles.navHeader} className="nav-header">
              <img src={logoImage} alt="DJ Kace" className="logo-brand" style={styles.logo} />
          </div>

          {/* 2. CENTER STAGE */}
          <div style={styles.stageContainer}>
              
              {/* MARQUEE 1 (TOP) - NOW OUTLINE (CLEAR) */}
              <div className="marquee-row" style={styles.marqueeWrapperTop}>
                  <div className="marquee-track-1" style={styles.marqueeTrack}>
                      <span style={styles.bigTextOutline}>{marqueeText}</span>
                      <span style={styles.bigTextOutline}>{marqueeText}</span>
                  </div>
              </div>

              {/* HERO IMAGE */}
              <div style={styles.imageContainer} className="image-container">
                  <img 
                    src={djImage} 
                    alt="The African Mzungu" 
                    className="hero-img" 
                    style={styles.djImage} 
                  />
              </div>

              {/* MARQUEE 2 (BOTTOM) - NOW SOLID (BLACK) */}
              <div className="marquee-row" style={styles.marqueeWrapperBottom}>
                  <div className="marquee-track-2" style={styles.marqueeTrack}>
                      <span style={styles.bigTextSolid}>{marqueeText}</span>
                      <span style={styles.bigTextSolid}>{marqueeText}</span>
                  </div>
              </div>

              {/* SCRIPT ACCENT - KENYAN FLAG COLORS */}
              <div className="script-text" style={styles.scriptOverlay}>
                  Nairobi's Finest
              </div>

          </div>
      </div>

      {/* --- METADATA --- */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Oswald:wght@700&display=swap');

        :root {
            --font-size-xl: 10vw;
            --img-height: 75vh; 
            --script-size: 4vw;
            --safe-top-padding: 120px; 
        }

        .magazine-wrapper {
            padding-top: var(--safe-top-padding) !important;
            padding-bottom: 20px;
        }

        .marquee-row {
            width: 100vw;
            overflow: hidden;
            position: absolute;
            left: 0;
            white-space: nowrap;
        }

        /* --- TABLET --- */
        @media (max-width: 1024px) {
            :root {
                --font-size-xl: 12vw;
                --img-height: 60vh;
                --script-size: 7vw;
                --safe-top-padding: 140px; 
            }
        }

        /* --- MOBILE --- */
        @media (max-width: 767px) {
            :root {
                --font-size-xl: 15vw; 
                --img-height: 55vh;   
                --script-size: 10vw;
                --safe-top-padding: 130px; 
            }

            .magazine-wrapper {
                justify-content: flex-start !important; 
                height: auto !important; 
                min-height: 100dvh;
            }

            .nav-header { margin-bottom: 30px !important; }
            .logo { height: 50px !important; }

            .marquee-wrapper-top { top: 20% !important; }
            .marquee-wrapper-bottom { bottom: 15% !important; }

            .hero-img {
                max-height: 100% !important;
                object-position: bottom center !important;
            }
            
            .scriptOverlay {
                top: 55% !important;
                right: 5% !important;
            }

            .meta-left, .meta-right { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#F1E9DB',
    minHeight: '100dvh', 
    width: '100vw',
    overflowX: 'hidden', 
    position: 'relative',
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: '"Oswald", sans-serif', 
    color: '#111',
    paddingTop: '120px',
    paddingBottom: '20px'
  },
  
  // FX
  noise: { position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none', background: 'url("https://grains.imgix.net/grain.png")' },
  vignette: { position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.1) 150%)' },
  gridLines: { position: 'absolute', inset: '20px', border: '1px solid rgba(0,0,0,0.05)', pointerEvents: 'none', zIndex: 1 },

  mainContent: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', zIndex: 10 },

  navHeader: { width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px', position: 'relative', zIndex: 100 },
  logo: { height: '70px', width: 'auto', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.1))' },

  stageContainer: { position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 },

  marqueeWrapperTop: { 
      position: 'absolute', top: '25%', left: 0, width: '100%', overflow: 'hidden', zIndex: 5,
      className: 'marquee-wrapper-top' 
  },
  marqueeWrapperBottom: { 
      position: 'absolute', bottom: '25%', left: 0, width: '100%', overflow: 'hidden', zIndex: 5,
      className: 'marquee-wrapper-bottom' 
  },
  marqueeTrack: { display: 'flex', width: 'fit-content', willChange: 'transform' },
  
  bigTextSolid: {
      fontSize: 'var(--font-size-xl)', lineHeight: 1, fontWeight: '900', color: '#111', letterSpacing: '-2px', paddingRight: '50px'
  },
  bigTextOutline: {
      fontSize: 'var(--font-size-xl)', lineHeight: 1, fontWeight: '900', color: 'transparent', WebkitTextStroke: '2px #111', letterSpacing: '-2px', paddingRight: '50px', opacity: 0.6
  },

  imageContainer: {
      position: 'relative', height: '75vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', zIndex: 10,
      className: 'imageContainer'
  },
  djImage: {
      height: '100%', width: 'auto', objectFit: 'contain', objectPosition: 'bottom center',
      filter: 'grayscale(100%) contrast(1.15) brightness(0.95)', willChange: 'transform'
  },

  // --- KENYAN FLAG GRADIENT ---
  scriptOverlay: {
      position: 'absolute', 
      top: '40%', 
      right: '15%', 
      fontFamily: '"Dancing Script", cursive', 
      fontSize: 'var(--script-size)', 
      zIndex: 30,
      transform: 'rotate(-10deg)', 
      whiteSpace: 'nowrap', 
      className: 'scriptOverlay',
      
      // Gradient: Black -> Red -> Green (Top to Bottom Flag Style)
      background: 'linear-gradient(to bottom, #000000 33%, #990000 33%, #990000 66%, #006600 66%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      
      // Use Drop Shadow filter instead of text-shadow for gradient text
      filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
  },

  metaLeft: { position: 'absolute', top: '50%', left: '40px', transform: 'translateY(-50%)', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', lineHeight: 1.5, className: 'meta-left' },
  metaRight: { position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', textAlign: 'right', fontSize: '0.8rem', fontWeight: 'bold', fontFamily: 'monospace', lineHeight: 1.5, className: 'meta-right' }
};

export default Home;