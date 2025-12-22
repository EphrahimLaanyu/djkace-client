import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // React Router Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Audio Physics State
  const amplitude = useRef(0); 
  const targetAmplitude = useRef(0); 
  const frequency = useRef(0.02); 
  const phase = useRef(0); 
  const mouseX = useRef(0); 

  // --- 1. SMART HIDE ANIMATION ---
  useGSAP(() => {
    const anim = gsap.from(containerRef.current, { 
      yPercent: -100,
      paused: true,
      duration: 0.4,
      ease: "power3.out"
    }).progress(1);

    ScrollTrigger.create({
      start: "top top",
      end: 99999,
      onUpdate: (self) => {
        self.direction === -1 ? anim.play() : anim.reverse();
      }
    });
  }, { scope: containerRef });

  // --- 2. NAVIGATION HANDLER ---
  const handleNavigation = (id, path) => {
    if (path && path !== '/') {
      navigate(path);
      return;
    }
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // --- 3. CANVAS ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 100; 
    };
    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      amplitude.current += (targetAmplitude.current - amplitude.current) * 0.1;
      
      ctx.beginPath();
      ctx.strokeStyle = amplitude.current > 10 ? '#E60000' : 'rgba(0,0,0,0.3)'; 
      ctx.lineWidth = amplitude.current > 10 ? 2 : 1;
      
      const centerY = canvas.height / 2;
      
      for (let x = 0; x < canvas.width; x += 5) {
        const dist = Math.abs(x - mouseX.current);
        let localAmp = 0;
        if (dist < 200) {
            const falloff = (200 - dist) / 200; 
            localAmp = amplitude.current * falloff;
        }
        const y = centerY + Math.sin(x * frequency.current + phase.current) * localAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      phase.current += 0.15; 
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleMouseMove = (e) => {
        mouseX.current = e.clientX;
        if (targetAmplitude.current === 0) amplitude.current = 2; 
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- 4. HOVER EFFECTS ---
  const { contextSafe } = useGSAP({ scope: containerRef });

  const onLinkEnter = contextSafe((e) => {
    targetAmplitude.current = 50; 
    frequency.current = 0.05; 
    gsap.to(e.target, { color: '#E60000', scale: 1.1, letterSpacing: '5px', duration: 0.3, ease: 'power2.out' });
  });

  const onLinkLeave = contextSafe((e) => {
    targetAmplitude.current = 0; 
    frequency.current = 0.02; 
    gsap.to(e.target, { color: '#111', scale: 1, letterSpacing: '2px', duration: 0.3 });
  });

  const navItems = [
    { label: 'HOME', id: 'home', path: '/' },      
    { label: 'MIXES', id: 'mixes', path: '/mixes' }, 
    { label: 'DATES', id: 'dates', path: '/' },      
  ];

  return (
    <div ref={containerRef} style={styles.navWrapper}>
      
      <div style={styles.bgGradient}></div>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div className="links-container" style={styles.linksContainer}>
        {navItems.map((item, i) => (
            <button 
                key={i}
                onClick={() => handleNavigation(item.id, item.path)} 
                className="nav-link"
                style={styles.link}
                onMouseEnter={onLinkEnter}
                onMouseLeave={onLinkLeave}
            >
                {item.label}
            </button>
        ))}
      </div>

      <div className="nav-meta" style={styles.metaLeft}>FREQ: 20-20kHZ</div>
      <div className="nav-meta" style={styles.metaRight}>SYS: ONLINE</div>

      {/* RESPONSIVE STYLES INJECTION */}
      <style>{`
        /* Desktop Defaults (handled by inline styles mostly, but accessible here) */
        
        @media (max-width: 768px) {
          /* Tighten gap between links */
          .links-container {
            gap: 20px !important; 
            width: 100% !important;
            justify-content: center !important;
          }

          /* Scale down text */
          .nav-link {
            font-size: 0.9rem !important;
            letter-spacing: 1px !important;
            padding: 10px 5px !important;
          }

          /* Hide decorative meta text on mobile to clear clutter */
          .nav-meta {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
};

// --- STYLES ---
const styles = {
  navWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100px', 
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    transition: 'transform 0.1s ease-out'
  },
  bgGradient: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(241, 233, 219, 0.95) 0%, rgba(241, 233, 219, 0) 100%)',
    zIndex: 0,
    pointerEvents: 'none'
  },
  canvas: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 1
  },
  linksContainer: {
    display: 'flex', gap: '8vw', zIndex: 2, pointerEvents: 'auto', alignItems: 'center'
  },
  link: {
    background: 'transparent', border: 'none',
    fontFamily: '"Rajdhani", sans-serif', fontWeight: '800', fontSize: '1rem',
    color: '#111', textDecoration: 'none', letterSpacing: '2px', 
    cursor: 'pointer', position: 'relative', padding: '10px'
  },
  metaLeft: {
    position: 'absolute', left: '50px', top: '50%', transform: 'translateY(-50%)',
    fontFamily: 'monospace', fontSize: '0.7rem', color: '#666', letterSpacing: '2px', zIndex: 2
  },
  metaRight: {
    position: 'absolute', right: '50px', top: '50%', transform: 'translateY(-50%)',
    fontFamily: 'monospace', fontSize: '0.7rem', color: '#E60000', letterSpacing: '2px', zIndex: 2
  }
};

export default Navbar;