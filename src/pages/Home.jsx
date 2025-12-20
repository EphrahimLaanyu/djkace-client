import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const Home = () => {
  const container = useRef(null);
  const maskRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Ensure we start from a clean state
      gsap.set(".main-content", { opacity: 0 });

      tl.to(maskRef.current, {
        attr: { scale: 100 }, // We scale the SVG mask internally
        scale: 60,            // We scale the element for the zoom effect
        duration: 2.5,
        ease: "expo.inOut",
        delay: 0.5
      })
      .to(".intro-layer", {
        opacity: 0,
        pointerEvents: "none",
        duration: 1
      }, "-=1")
      .to(".main-content", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out"
      }, "-=1.2");
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={container} style={pageWrapper}>
      
      {/* 1. The Intro Layer (Black Screen with Logo) */}
      <div className="intro-layer" style={introStyle}>
        <div style={logoWrapper}>
          <span style={textStyle}>DJ</span>
          
          {/* The Central Animated Plus */}
          <div ref={maskRef} style={plusWrapper}>
            <svg viewBox="0 0 100 100" style={svgStyle}>
              {/* Vertical bar of plus */}
              <rect x="42" y="10" width="16" height="80" fill="currentColor" />
              {/* Horizontal bar of plus */}
              <rect x="10" y="42" width="80" height="16" fill="currentColor" />
            </svg>
          </div>
          
          <span style={textStyle}>KACE</span>
        </div>
      </div>

      {/* 2. The Actual Home Content (Hidden initially) */}
      <div className="main-content" style={contentStyle}>
        <h1 style={heroTitle}>DEEJAY KACE</h1>
        <p style={heroSub}>AFRICA'S PREMIER MIX MASTER</p>
        <div style={buttonGroup}>
          <button style={primaryBtn}>LATEST MIXES</button>
          <button style={secondaryBtn}>BOOKINGS</button>
        </div>
      </div>

    </div>
  );
};

// --- Styles for a Premium Look ---
const pageWrapper = {
  backgroundColor: '#000',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
  position: 'relative',
  fontFamily: '"Inter", sans-serif'
};

const introStyle = {
  position: 'absolute',
  inset: 0,
  backgroundColor: '#000',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
  color: '#fff'
};

const logoWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
  fontWeight: '900',
  fontSize: 'clamp(3rem, 10vw, 8rem)',
};

const textStyle = {
  letterSpacing: '-0.05em',
};

const plusWrapper = {
  width: '1em',
  height: '1em',
  color: '#f63', // Your signature orange
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const svgStyle = {
  width: '100%',
  height: '100%',
};

const contentStyle = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: '#fff',
  background: 'radial-gradient(circle, #1a1a1a 0%, #000 100%)',
};

const heroTitle = {
  fontSize: 'clamp(4rem, 15vw, 10rem)',
  margin: 0,
  lineHeight: 0.8,
  fontWeight: '900'
};

const heroSub = {
  fontSize: '1.2rem',
  letterSpacing: '0.5em',
  marginTop: '20px',
  color: '#888'
};

const buttonGroup = {
  marginTop: '50px',
  display: 'flex',
  gap: '20px'
};

const primaryBtn = {
  padding: '18px 40px',
  backgroundColor: '#f63',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

const secondaryBtn = {
  padding: '18px 40px',
  backgroundColor: 'transparent',
  color: '#fff',
  border: '1px solid #444',
  borderRadius: '4px',
  fontWeight: 'bold',
  cursor: 'pointer'
};

export default Home;