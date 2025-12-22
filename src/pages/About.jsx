import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  // Generate 40 bars
  const barsArray = new Array(40).fill(0);

  useGSAP(() => {
    // Get all bars
    const bars = gsap.utils.toArray(".freq-bar");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center", // Start animating when top of section hits center of screen
        end: "center center", // End when center of section hits center of screen
        scrub: 1.5, // Smooth scrubbing effect
      }
    });

    // 1. Animate bars to "open" vertically
    tl.to(bars, {
      scaleY: 0.05, // Shrink to 5% height (creating the gap)
      transformOrigin: "center", // Shrink from top and bottom towards center
      ease: "power2.inOut",
      stagger: {
        amount: 1, 
        from: "center", // Start opening from the center outward
        grid: "auto",
        ease: "power1.out"
      }
    });

    // 2. Fade in content behind the bars
    tl.from(contentRef.current, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px)",
      duration: 0.5,
      ease: "power2.out"
    }, "<0.3"); // Overlap slightly with bar animation

  }, { scope: containerRef });

  return (
    <section ref={containerRef} style={styles.analyzerSection}>
        
        {/* 1. CONTENT LAYER (Hidden Behind Bars initially) */}
        <div ref={contentRef} style={styles.contentLayer}>
            <div style={styles.textContent}>
                <h4 style={styles.techHeader}>SYSTEM CHECK // 2025</h4>
                <h2 style={styles.mainHeader}>PRECISION<br/>SOUND</h2>
                <div style={styles.separator}></div>
                <p style={styles.desc}>
                    Just like a frequency spectrum, the set is calculated.
                    High highs. Deep lows. No distortion.
                    Experience the technical side of the African Mzungu.
                </p>
                
                {/* Tech Stats Grid */}
                <div style={styles.techGrid}>
                    <div style={styles.techItem}>
                        <span style={styles.label}>FORMAT</span>
                        <span style={styles.value}>DIGITAL / VINYL</span>
                    </div>
                    <div style={styles.techItem}>
                        <span style={styles.label}>RANGE</span>
                        <span style={styles.value}>20Hz - 20kHz</span>
                    </div>
                    <div style={styles.techItem}>
                        <span style={styles.label}>OUTPUT</span>
                        <span style={styles.value}>HIGH FIDELITY</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. THE ANALYZER BARS OVERLAY */}
        <div style={styles.barsContainer}>
            {barsArray.map((_, i) => (
                <div
                    key={i}
                    className="freq-bar"
                    style={styles.bar}
                ></div>
            ))}
        </div>

    </section>
  );
};

const styles = {
  analyzerSection: {
    height: '100vh',
    width: '100%',
    position: 'relative',
    backgroundColor: '#050505', // Very dark bg
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: '"Rajdhani", sans-serif',
  },
  
  // Content
  contentLayer: {
    zIndex: 1,
    textAlign: 'center',
    color: '#F1E9DB',
    padding: '20px',
    maxWidth: '800px'
  },
  techHeader: { color: '#E60000', letterSpacing: '5px', fontSize: '0.9rem', marginBottom: '10px' },
  mainHeader: { fontFamily: '"Playfair Display", serif', fontSize: '5rem', lineHeight: '0.9', fontStyle: 'italic', marginBottom: '30px' },
  separator: { width: '2px', height: '60px', background: '#E60000', margin: '0 auto 30px auto' },
  desc: { fontSize: '1.2rem', fontWeight: '300', lineHeight: '1.6', color: '#aaa', marginBottom: '50px' },
  
  // Grid
  techGrid: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '20px' },
  techItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  label: { fontSize: '0.8rem', color: '#666', marginBottom: '5px', letterSpacing: '1px' },
  value: { fontSize: '1rem', fontWeight: 'bold', color: '#E60000' },

  // Bars
  barsContainer: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10, pointerEvents: 'none'
  },
  bar: {
    flexGrow: 1, height: '100%', backgroundColor: '#E60000', margin: '0 1px', transformOrigin: 'center'
  }
};

export default About;