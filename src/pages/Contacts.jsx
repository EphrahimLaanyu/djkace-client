import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Footer from './Footer';

// --- IMPORT YOUR IMAGE ---
import DjImage from '../assets/PAT01853-removebg-preview.png'; 

// --- FILMSTRIP CONFIGURATION ---
const filmImages = [DjImage, DjImage, DjImage, DjImage];

const Contact = () => {
  const containerRef = useRef(null);
  const rightSideVisualsRef = useRef(null);
  const formRef = useRef(null);
  const marqueeRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('IDLE');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('SENDING');
    setTimeout(() => {
        setStatus('SENT');
        setTimeout(() => {
            setStatus('IDLE');
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    }, 2000);
  };

  useGSAP(() => {
    // 1. FORM ANIMATION
    gsap.from(".form-track", {
        x: -30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2
    });

    // 2. VERTICAL FILMSTRIP ANIMATION (Right Side)
    const filmTween = gsap.to(".filmstrip", {
        yPercent: -50,
        ease: "none",
        duration: 40, 
        repeat: -1
    });

    const rightContainer = rightSideVisualsRef.current;
    if (rightContainer) {
        rightContainer.addEventListener("mouseenter", () => gsap.to(filmTween, { timeScale: 0.2, duration: 0.5 }));
        rightContainer.addEventListener("mouseleave", () => gsap.to(filmTween, { timeScale: 1, duration: 0.5 }));
    }

    // 3. INFINITE MARQUEE ANIMATION (Bottom)
    const marqueeTween = gsap.to(".marquee-content", {
        xPercent: -100, 
        repeat: -1,
        duration: 20, 
        ease: "none",
    });

    const marqueeContainer = marqueeRef.current;
    if (marqueeContainer) {
        marqueeContainer.addEventListener("mouseenter", () => gsap.to(marqueeTween, { timeScale: 0.2, duration: 0.5 }));
        marqueeContainer.addEventListener("mouseleave", () => gsap.to(marqueeTween, { timeScale: 1, duration: 0.5 }));
    }

  }, { scope: containerRef });

  const renderImages = (keyPrefix) => (
      filmImages.map((imgSrc, i) => (
          <div key={`${keyPrefix}-${i}`} style={styles.filmItem}>
              <div style={styles.filmMeta}>
                  <span style={styles.filmNum}>A{i + 1}.</span>
                  <span style={styles.filmLine}>----------------</span>
                  <span style={styles.filmTag}>KODAK 400</span>
              </div>
              <div style={styles.imageWrapper}>
                  <img src={imgSrc} alt={`Strip ${i}`} style={styles.stripImage} />
                  <div style={styles.sprocketLeft}></div>
                  <div style={styles.sprocketRight}></div>
              </div>
          </div>
      ))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
        
        <section ref={containerRef} style={styles.pageWrapper}>
        
        {/* --- LEFT SIDE: THE FORM --- */}
        <div className="sleeve-side" style={styles.sleeveContainer}>
            <div style={styles.headerBlock}>
                <h2 style={styles.albumTitle}>THE CONTACT SESSIONS</h2>
                <div style={styles.albumSub}>VOL. 1 • 2025 • STEREO</div>
                <div style={styles.divider}>====================================</div>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
                {['NAME', 'EMAIL'].map((field, i) => (
                    <div key={i} className="form-track" style={styles.inputGroup}>
                        <div style={styles.trackNum}>A{i+1}.</div>
                        <div style={styles.inputWrapper}>
                            <label style={styles.label}>ENTER {field}</label>
                            <input 
                                type={field === 'EMAIL' ? 'email' : 'text'}
                                name={field.toLowerCase()}
                                value={formData[field.toLowerCase()]}
                                onChange={handleChange}
                                required
                                placeholder={`YOUR ${field}...`}
                                style={styles.input}
                                autoComplete="off"
                            />
                        </div>
                        <div style={styles.duration}>0{i+3}:00</div>
                    </div>
                ))}
                <div className="form-track" style={styles.inputGroup}>
                    <div style={styles.trackNum}>A3.</div>
                    <div style={styles.inputWrapper}>
                        <label style={styles.label}>THE MESSAGE</label>
                        <textarea 
                            name="message" 
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="TELL ME ABOUT YOUR PROJECT..."
                            rows="4"
                            style={styles.textarea}
                        />
                    </div>
                    <div style={styles.duration}>LP</div>
                </div>
                <div className="form-track" style={styles.submitRow}>
                    <button 
                        type="submit" 
                        disabled={status !== 'IDLE'}
                        style={{
                            ...styles.submitBtn,
                            backgroundColor: status === 'SENT' ? '#4CAF50' : '#111'
                        }}
                    >
                        {status === 'IDLE' && '▶ PRESS TO SEND'}
                        {status === 'SENDING' && 'RECORDING...'}
                        {status === 'SENT' && '✓ TRANSMISSION RECEIVED'}
                    </button>
                </div>
            </form>

            <div style={styles.creditsFooter}>
                <div style={styles.smallCredit}>PRODUCED BY: DEEJAY KACE</div>
                <div style={styles.smallCredit}>DISTRIBUTED BY: NAIROBI_KE</div>
            </div>
        </div>

        {/* --- VERTICAL DIVIDER --- */}
        <div className="vertical-divider" style={styles.verticalDivider}>
            <div style={styles.dividerLine}></div>
            <div style={styles.dividerNotchTop}></div>
            <div style={styles.dividerNotchBottom}></div>
        </div>

        {/* --- RIGHT SIDE: VERTICAL FILMSTRIP --- */}
        <div className="info-side" style={styles.rightSideContainer} ref={rightSideVisualsRef}>
            <div className="filmstrip" style={styles.filmstrip}>
                {renderImages('original')}
                {renderImages('clone')}
            </div>
            <div style={styles.focusLine}></div>
        </div>

        {/* --- BOTTOM ENDLESS MARQUEE BAND --- */}
        <div style={styles.marqueeBand} ref={marqueeRef}>
            <div style={styles.marqueeTrack}>
                <span className="marquee-content" style={styles.marqueeText}>
                    THANKS FOR VIBING • KEEP THE MUSIC LOUD • DEEJAY KACE • NAIROBI'S FINEST • ENJOY THE SITE • ALL RIGHTS RESERVED •&nbsp;
                </span>
                <span className="marquee-content" style={styles.marqueeText}>
                    THANKS FOR VIBING • KEEP THE MUSIC LOUD • DEEJAY KACE • NAIROBI'S FINEST • ENJOY THE SITE • ALL RIGHTS RESERVED •&nbsp;
                </span>
            </div>
        </div>

        <style>{`
            ::placeholder { color: #888; opacity: 0.6; }
            
            /* MOBILE RESPONSIVE STYLES (Max Width 900px) */
            @media (max-width: 900px) {
                .main-content-row { flex-direction: column !important; }
                
                /* HIDE RIGHT SIDE & DIVIDER */
                .info-side { display: none !important; }
                .vertical-divider { display: none !important; }
                
                /* MAKE FORM FULL WIDTH & RESPONSIVE */
                .sleeve-side { 
                    width: 100% !important; 
                    padding: 40px 20px !important; 
                    border-right: none !important;
                    min-width: unset !important;
                }
                
                /* Adjust Text Sizes for Mobile */
                .albumTitle { font-size: 2rem !important; }
                .input { font-size: 1rem !important; }
                .textarea { font-size: 1rem !important; }
                .submitBtn { padding: 15px 20px !important; font-size: 0.9rem !important; }
            }
        `}</style>
        </section>

        {/* --- FOOTER --- */}
        <Footer />
        
    </div>
  );
};

// --- STYLES ---
const styles = {
  pageWrapper: {
    position: 'relative', 
    width: '100vw', 
    minHeight: '100vh',
    display: 'flex', 
    flexDirection: 'row',
    backgroundColor: '#F1E9DB', 
    color: '#111', 
    fontFamily: '"Space Mono", monospace',
    overflowX: 'hidden',
    paddingBottom: '40px' 
  },

  // --- MARQUEE BAND ---
  marqueeBand: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    width: '100%',
    height: '40px', 
    backgroundColor: '#E60000',
    display: 'flex', 
    alignItems: 'center',
    overflow: 'hidden', 
    zIndex: 100,
    borderTop: '2px solid #111'
  },
  marqueeTrack: {
    display: 'flex', 
    whiteSpace: 'nowrap', 
    width: 'fit-content'
  },
  marqueeText: {
    fontSize: '1rem', fontWeight: '900', color: '#000',
    fontFamily: '"Rajdhani", sans-serif', letterSpacing: '2px',
    paddingRight: '50px',
    flexShrink: 0,
    display: 'block'
  },

  // --- LEFT SIDE ---
  sleeveContainer: {
    flex: '1', 
    padding: '80px 50px',
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    position: 'relative', 
    minWidth: '320px', 
    zIndex: 2,
    backgroundColor: '#F1E9DB',
    className: 'sleeve-side' // Added for targeting
  },
  headerBlock: { marginBottom: '40px' },
  albumTitle: { fontSize: '2.5rem', fontWeight: '900', lineHeight: '1', marginBottom: '10px', letterSpacing: '-1px', className: 'albumTitle' },
  albumSub: { fontSize: '0.9rem', color: '#666', letterSpacing: '1px' },
  divider: { margin: '20px 0', opacity: 0.3, whiteSpace: 'nowrap', overflow: 'hidden' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', alignItems: 'flex-start', padding: '15px 0', borderBottom: '1px dotted #aaa' },
  trackNum: { width: '40px', fontWeight: 'bold', paddingTop: '10px', color: '#E60000' },
  inputWrapper: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.6rem', color: '#666', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { background: 'transparent', border: 'none', fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold', color: '#111', outline: 'none', width: '100%', className: 'input' },
  textarea: { background: 'transparent', border: 'none', fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold', color: '#111', outline: 'none', width: '100%', resize: 'none', className: 'textarea' },
  duration: { fontSize: '0.8rem', color: '#888', paddingTop: '10px', width: '50px', textAlign: 'right' },
  submitRow: { marginTop: '30px' },
  submitBtn: { background: '#111', color: '#F1E9DB', border: 'none', padding: '20px 40px', fontSize: '1rem', fontWeight: 'bold', fontFamily: 'inherit', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.3s ease', textTransform: 'uppercase', className: 'submitBtn' },
  creditsFooter: { marginTop: 'auto', paddingTop: '40px' },
  smallCredit: { fontSize: '0.6rem', color: '#888', marginBottom: '5px' },

  // --- DIVIDER ---
  verticalDivider: { position: 'relative', width: '2px', background: 'transparent', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10, className: 'vertical-divider' },
  dividerLine: { height: '90%', width: '2px', backgroundImage: 'linear-gradient(to bottom, #ccc 0%, #ccc 50%, transparent 50%)', backgroundSize: '2px 10px', opacity: 0.5 },
  dividerNotchTop: { position: 'absolute', top: '5%', width: '10px', height: '2px', background: '#111' },
  dividerNotchBottom: { position: 'absolute', bottom: '5%', width: '10px', height: '2px', background: '#111' },

  // --- RIGHT SIDE: VISUALS (FILMSTRIP) ---
  rightSideContainer: { 
      flex: '1', 
      color: '#111', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'flex-start', 
      alignItems: 'center', 
      position: 'sticky', 
      top: 0, 
      height: '100vh', 
      padding: '0', 
      minWidth: '320px', 
      zIndex: 1,
      overflow: 'hidden', 
      backgroundColor: '#F1E9DB',
      className: 'info-side' // Added for targeting
  },
  
  filmstrip: {
      width: '80%', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      willChange: 'transform'
  },

  filmItem: {
      width: '100%',
      marginBottom: '40px', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
  },

  filmMeta: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      color: '#E60000',
      marginBottom: '5px',
      fontFamily: '"Rajdhani", sans-serif'
  },
  
  filmNum: { fontWeight: '900', letterSpacing: '1px' },
  filmLine: { opacity: 0.3, letterSpacing: '-2px', overflow: 'hidden' },
  filmTag: { opacity: 0.8 },

  imageWrapper: {
      width: '100%',
      position: 'relative',
      padding: '0 20px', 
      backgroundColor: '#111', 
  },

  stripImage: {
      width: '100%',
      height: 'auto',
      display: 'block',
      filter: 'grayscale(100%) contrast(110%)',
  },

  // Fake Sprocket Holes
  sprocketLeft: {
      position: 'absolute', left: '5px', top: 0, bottom: 0, width: '10px',
      background: 'repeating-linear-gradient(to bottom, #fff 0px, #fff 10px, transparent 10px, transparent 20px)',
      opacity: 0.8
  },
  sprocketRight: {
      position: 'absolute', right: '5px', top: 0, bottom: 0, width: '10px',
      background: 'repeating-linear-gradient(to bottom, #fff 0px, #fff 10px, transparent 10px, transparent 20px)',
      opacity: 0.8
  },

  focusLine: {
      position: 'absolute',
      top: '50%', left: '0', right: '0',
      height: '2px',
      borderTop: '2px dashed #E60000',
      opacity: 0.3,
      pointerEvents: 'none',
      zIndex: 10
  }
};

export default Contact;