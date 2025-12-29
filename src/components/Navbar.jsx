import React, { useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const linksRef = useRef([]); 
  
  const navigate = useNavigate();
  const location = useLocation();

  // Audio Physics State
  const amplitude = useRef(0); 
  const targetAmplitude = useRef(0); 
  const frequency = useRef(0.02); 
  const phase = useRef(0); 
  const mouseX = useRef(0); 

  const navItems = useMemo(() => [
    { label: 'HOME', id: 'home', path: '/' },      
    { label: 'MIXES', id: 'mixes', path: '/mixes' }, 
    { label: 'YOUTUBE', id: 'youtube', path: '/youtube' },      
    { label: 'CONTACTS', id: 'contacts', path: '/contacts' },      
  ], []);

  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": navItems.map(item => item.label),
    "url": navItems.map(item => `https://deejaykace.co.ke${item.path}`)
  };

  // --- 1. SMART HIDE ANIMATION ---
  useGSAP(() => {
    // Detect Touch/Mobile
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const anim = gsap.from(containerRef.current, { 
      yPercent: -100, paused: true, duration: 0.4, ease: "power3.out"
    }).progress(1);

    // FIX: Only auto-hide on Desktop
    let hideTimer = !isTouch ? gsap.delayedCall(1.5, () => {
        if (window.scrollY > 50) anim.reverse();
    }) : null;

    const showNavbar = () => {
        anim.play();
        if (hideTimer) { hideTimer.restart(true); hideTimer.pause(); }
    };

    const hideNavbar = () => {
        if (window.scrollY <= 50) { 
            if (hideTimer) hideTimer.pause(); 
            return; 
        }
        if (hideTimer) hideTimer.restart(true);
    };

    ScrollTrigger.create({
      start: "top top", end: 99999,
      onUpdate: (self) => {
        if (self.direction === -1) {
            anim.play(); 
            if (window.scrollY <= 50 && hideTimer) hideTimer.pause();
            else if (hideTimer) hideTimer.restart(true); 
        } else { 
            if (window.scrollY > 50) anim.reverse(); 
        }
      }
    });

    const navEl = containerRef.current;
    
    // Desktop Events Only
    if (!isTouch) {
        navEl.addEventListener("mouseenter", showNavbar);
        navEl.addEventListener("mouseleave", hideNavbar);
        const handleMouseMove = (e) => { if (e.clientY < 10) showNavbar(); };
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            navEl.removeEventListener("mouseenter", showNavbar);
            navEl.removeEventListener("mouseleave", hideNavbar);
            window.removeEventListener("mousemove", handleMouseMove);
            if (hideTimer) hideTimer.kill();
        };
    } else {
        // Mobile tap safety
        const handleTouch = (e) => { if (e.touches[0].clientY < 50) anim.play(); };
        window.addEventListener("touchstart", handleTouch);
        return () => window.removeEventListener("touchstart", handleTouch);
    }
  }, { scope: containerRef });

  // --- 2. CANVAS ENGINE (MODIFIED) ---
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
      // --- CHANGE: STOP ANIMATION ON MOBILE ---
      if (window.innerWidth < 768) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Keep the loop alive gently, but draw nothing
          animationFrameId = requestAnimationFrame(render);
          return;
      }
      
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

  // --- 3. ACTIVE STATE ---
  const { contextSafe } = useGSAP({ scope: containerRef });
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    navItems.forEach((item, index) => {
        const el = linksRef.current[index];
        if(!el) return;
        if (isActive(item.path)) {
            gsap.to(el, { color: '#E60000', scale: 1, letterSpacing: '2px', duration: 0.3, overwrite: 'auto' });
        } else {
            gsap.to(el, { color: '#111', scale: 1, letterSpacing: '2px', duration: 0.3, overwrite: 'auto' });
        }
    });
  }, [location.pathname, navItems]);

  const onLinkEnter = contextSafe((e) => {
    targetAmplitude.current = 50; 
    frequency.current = 0.05; 
    gsap.to(e.currentTarget, { color: '#E60000', scale: 1.1, letterSpacing: '5px', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
  });

  const onLinkLeave = contextSafe((e, path) => {
    targetAmplitude.current = 0; 
    frequency.current = 0.02; 
    const isCurrentPage = isActive(path);
    gsap.to(e.currentTarget, { color: isCurrentPage ? '#E60000' : '#111', scale: 1, letterSpacing: '2px', duration: 0.3, overwrite: 'auto' });
  });

  const handleNavigation = (e, id, path) => {
    if (location.pathname === path && path === '/') {
       e.preventDefault();
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav ref={containerRef} style={styles.navWrapper} itemScope itemType="https://schema.org/SiteNavigationElement">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(navigationSchema)}</script>
      </Helmet>

      <div style={styles.bgGradient}></div>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div className="links-container" style={styles.linksContainer}>
        {navItems.map((item, i) => (
            <Link 
                key={i}
                to={item.path}
                ref={el => linksRef.current[i] = el} 
                onClick={(e) => handleNavigation(e, item.id, item.path)} 
                className="nav-link"
                style={styles.link}
                onMouseEnter={onLinkEnter}
                onMouseLeave={(e) => onLinkLeave(e, item.path)} 
                itemProp="url"
            >
                <span itemProp="name">{item.label}</span>
            </Link>
        ))}
      </div>

      <div className="nav-meta" style={styles.metaLeft}>FREQ: 20-20kHZ</div>
      <div className="nav-meta" style={styles.metaRight}>SYS: ONLINE</div>

      <style>{`
        @media (max-width: 768px) {
          /* --- CHANGE: REMOVE CANVAS ON MOBILE --- */
          canvas {
            display: none !important;
          }

          .links-container {
            gap: 12px !important; 
            width: 100% !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
            padding: 0 10px;
          }
          .nav-link {
            font-size: 0.8rem !important;
            letter-spacing: 1px !important;
            padding: 8px 5px !important;
            color: #111 !important; 
            opacity: 1 !important;
          }
          .nav-meta {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

const styles = {
  navWrapper: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100px', 
    zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center',
    pointerEvents: 'none', transition: 'transform 0.1s ease-out'
  },
  bgGradient: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(241, 233, 219, 0.95) 0%, rgba(241, 233, 219, 0) 100%)',
    zIndex: 0, pointerEvents: 'none'
  },
  canvas: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 1
  },
  linksContainer: {
    display: 'flex', gap: '8vw', zIndex: 10, pointerEvents: 'auto', alignItems: 'center', position: 'relative'
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