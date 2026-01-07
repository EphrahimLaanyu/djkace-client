import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  // STATE for dynamic text
  const [aboutText, setAboutText] = useState("Loading system info...");
  
  // Generate 40 bars
  const barsArray = new Array(40).fill(0);

  // FETCH DATA
  useEffect(() => {
    const fetchAbout = async () => {
        try {
            const res = await fetch('https://djkace-api.elaanyu.workers.dev/about');
            const data = await res.json();
            if (data && data.about_text) {
                setAboutText(data.about_text);
            } else {
                // Fallback default if DB is empty
                setAboutText("Just like a frequency spectrum, the set is calculated. High highs. Deep lows. No distortion. Experience the technical side of the African Mzungu.");
            }
        } catch (e) {
            console.error("Failed to fetch about text", e);
        }
    };
    fetchAbout();
  }, []);

  useGSAP(() => {
    // Get all bars
    const bars = gsap.utils.toArray(".freq-bar");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center", 
        end: "center center", 
        scrub: 1.5, 
      }
    });

    // 1. Animate bars to "open" vertically
    tl.to(bars, {
      scaleY: 0.05, 
      transformOrigin: "center", 
      ease: "power2.inOut",
      stagger: {
        amount: 1, 
        from: "center", 
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
    }, "<0.3"); 

  }, { scope: containerRef });

  return (
    <section ref={containerRef} style={styles.analyzerSection} itemScope itemType="https://schema.org/Service">
        
        {/* 1. CONTENT LAYER (Hidden Behind Bars initially) */}
        <div ref={contentRef} style={styles.contentLayer}>
            <div style={styles.textContent}>
                <h4 style={styles.techHeader}>SYSTEM CHECK // 2025</h4>
                
                <h2 style={styles.mainHeader} itemProp="name">What's the Kace?</h2>
                
                <div style={styles.separator}></div>
                
                <p style={styles.desc} itemProp="description">
                    {aboutText}
                </p>
                
                {/* NEW: Simple Signature Block */}
                <div style={styles.signatureBlock}>
                    <span style={styles.signature}>DEEJAY KACE</span>
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
    backgroundColor: '#050505', 
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
  desc: { fontSize: '1.2rem', fontWeight: '300', lineHeight: '1.6', color: '#aaa', marginBottom: '40px' },
  
  // NEW: Signature Styles (Replaces Grid)
  signatureBlock: { 
      borderTop: '1px solid #333', 
      paddingTop: '30px',
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'center'
  },
  signature: { 
      fontSize: '1.5rem', 
      fontWeight: '900', 
      color: '#E60000', 
      letterSpacing: '8px',
      textTransform: 'uppercase'
  },

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