import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Footer from './Footer';

const Contact = () => {
  const containerRef = useRef(null);
  const infoRef = useRef(null);
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

    // 2. INFO ANIMATION
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from(".info-header", { opacity: 0, y: -20, duration: 0.5 })
      .from(".info-row", { opacity: 0, x: 20, stagger: 0.1, duration: 0.6, ease: "power2.out" })
      .from(".dev-block", { opacity: 0, y: 30, duration: 0.5, ease: "back.out" }, "-=0.2");

    // 3. INFINITE MARQUEE ANIMATION
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

  return (
    // Wrapped in a flex column to stack the Section and the Footer
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
                        {status === 'IDLE' && '▶ PRESS PLAY TO SEND'}
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

        {/* --- RIGHT SIDE: INFO --- */}
        <div className="info-side" style={styles.infoSide} ref={infoRef}>
            <div style={styles.infoWrapper}>
                <div style={styles.infoSection}>
                    <div className="info-header" style={styles.sectionTitle}>
                        <span style={styles.redDot}></span>
                        SYSTEM OUTPUT // CONTACT INFO
                    </div>
                    <div style={styles.gridContainer}>
                        <div className="info-row" style={styles.dataRow}>
                            <span style={styles.dataLabel}>BOOKINGS</span>
                            <a href="mailto:info@deejaykace.com" style={styles.dataValueLink}>INFO@DEEJAYKACE.COM</a>
                        </div>
                        <div className="info-row" style={styles.dataRow}>
                            <span style={styles.dataLabel}>PHONE</span>
                            <span style={styles.dataValue}>+254 700 000 000</span>
                        </div>
                        <div className="info-row" style={styles.dataRow}>
                            <span style={styles.dataLabel}>LOCATION</span>
                            <span style={styles.dataValue}>NAIROBI, KENYA</span>
                        </div>
                        <div className="info-row" style={styles.socialBlock}>
                            <div style={styles.dataLabel}>FREQUENCIES</div>
                            <div style={styles.socialLinks}>
                                <a href="#" style={styles.socialLink}>INSTAGRAM</a>
                                <a href="#" style={styles.socialLink}>MIXCLOUD</a>
                                <a href="#" style={styles.socialLink}>TWITTER</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={styles.dividerLight}>--------------------------------</div>
                <div className="dev-block" style={styles.devSection}>
                    <div style={styles.sectionTitle}>
                        <span style={styles.greenDot}></span>
                        SYSTEM ARCHITECTURE
                    </div>
                    <div style={styles.devCard}>
                        <div style={styles.devHeader}>
                            <span style={styles.devLabel}>DESIGN & DEVELOPMENT</span>
                            <span style={styles.devId}>ID: DEV-001</span>
                        </div>
                        <h3 style={styles.agencyName}>AGENCY NAME</h3>
                        <p style={styles.devDesc}>
                            High-fidelity web experiences, custom audio visualizations, and digital branding.
                        </p>
                        <a href="mailto:hello@agency.com" style={styles.hireBtn}>
                            [ INITIATE COLLABORATION ]
                        </a>
                    </div>
                </div>
            </div>
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
            @media (max-width: 900px) {
                section { flex-direction: column !important; }
                .vertical-divider { display: none !important; }
                .info-side { position: relative !important; height: auto !important; padding: 60px 30px 80px 30px !important; border-top: 2px dashed #ccc; }
                .sleeve-side { border-right: none !important; }
            }
        `}</style>
        </section>

        {/* --- NEW FOOTER COMPONENT --- */}
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
    flex: '1', padding: '80px 50px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
    position: 'relative', minWidth: '320px', zIndex: 2
  },
  headerBlock: { marginBottom: '40px' },
  albumTitle: { fontSize: '2.5rem', fontWeight: '900', lineHeight: '1', marginBottom: '10px', letterSpacing: '-1px' },
  albumSub: { fontSize: '0.9rem', color: '#666', letterSpacing: '1px' },
  divider: { margin: '20px 0', opacity: 0.3, whiteSpace: 'nowrap', overflow: 'hidden' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', alignItems: 'flex-start', padding: '15px 0', borderBottom: '1px dotted #aaa' },
  trackNum: { width: '40px', fontWeight: 'bold', paddingTop: '10px', color: '#E60000' },
  inputWrapper: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  label: { fontSize: '0.6rem', color: '#666', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '1px' },
  input: { background: 'transparent', border: 'none', fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold', color: '#111', outline: 'none', width: '100%' },
  textarea: { background: 'transparent', border: 'none', fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold', color: '#111', outline: 'none', width: '100%', resize: 'none' },
  duration: { fontSize: '0.8rem', color: '#888', paddingTop: '10px', width: '50px', textAlign: 'right' },
  submitRow: { marginTop: '30px' },
  submitBtn: { background: '#111', color: '#F1E9DB', border: 'none', padding: '20px 40px', fontSize: '1rem', fontWeight: 'bold', fontFamily: 'inherit', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.3s ease', textTransform: 'uppercase' },
  creditsFooter: { marginTop: 'auto', paddingTop: '40px' },
  smallCredit: { fontSize: '0.6rem', color: '#888', marginBottom: '5px' },

  // --- DIVIDER ---
  verticalDivider: { position: 'relative', width: '2px', background: 'transparent', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  dividerLine: { height: '90%', width: '2px', backgroundImage: 'linear-gradient(to bottom, #ccc 0%, #ccc 50%, transparent 50%)', backgroundSize: '2px 10px', opacity: 0.5 },
  dividerNotchTop: { position: 'absolute', top: '5%', width: '10px', height: '2px', background: '#111' },
  dividerNotchBottom: { position: 'absolute', bottom: '5%', width: '10px', height: '2px', background: '#111' },

  // --- RIGHT SIDE ---
  infoSide: { flex: '1', color: '#111', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'sticky', top: 0, height: '100vh', padding: '40px', minWidth: '320px', zIndex: 1 },
  infoWrapper: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '40px' },
  sectionTitle: { fontSize: '0.8rem', color: '#666', marginBottom: '20px', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' },
  redDot: { width: '8px', height: '8px', background: '#E60000', borderRadius: '50%', boxShadow: '0 0 5px rgba(230,0,0,0.5)' },
  greenDot: { width: '8px', height: '8px', background: '#0f0', borderRadius: '50%', boxShadow: '0 0 5px rgba(0,255,0,0.5)' },
  gridContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  dataRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px' },
  dataLabel: { fontSize: '0.7rem', color: '#888', fontWeight: 'bold' },
  dataValue: { fontSize: '1.1rem', fontWeight: 'bold', fontFamily: '"Rajdhani", sans-serif' },
  dataValueLink: { fontSize: '1.1rem', fontWeight: 'bold', fontFamily: '"Rajdhani", sans-serif', color: '#E60000', textDecoration: 'none' },
  socialBlock: { marginTop: '10px' },
  socialLinks: { display: 'flex', gap: '20px', marginTop: '15px' },
  socialLink: { color: '#111', textDecoration: 'none', fontSize: '0.9rem', borderBottom: '2px solid #ccc', paddingBottom: '2px', fontWeight: 'bold' },
  dividerLight: { color: '#ccc', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.5 },
  devSection: { marginTop: '10px' },
  devCard: { background: '#fff', border: '3px solid #111', padding: '25px', borderRadius: '0px', position: 'relative', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' },
  devHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px dashed #ccc', paddingBottom: '10px' },
  devLabel: { fontSize: '0.6rem', color: '#E60000', fontWeight: 'bold', letterSpacing: '1px' },
  devId: { fontSize: '0.6rem', fontFamily: 'monospace', color: '#444', fontWeight: 'bold' },
  agencyName: { fontSize: '1.8rem', margin: '0 0 10px 0', fontFamily: '"Rajdhani", sans-serif', fontWeight: '900', textTransform: 'uppercase' },
  devDesc: { fontSize: '0.8rem', color: '#444', lineHeight: '1.5', marginBottom: '25px', fontWeight: 'bold' },
  hireBtn: { display: 'block', textAlign: 'center', padding: '15px', border: '3px solid #111', color: '#111', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '2px', fontWeight: '900', transition: 'all 0.3s ease', background: 'transparent', textTransform: 'uppercase' },

  // --- FOOTER STYLES ---
  footer: {
      backgroundColor: '#111',
      color: '#F1E9DB',
      padding: '60px 50px 30px',
      fontFamily: '"Space Mono", monospace',
      borderTop: '2px solid #E60000'
  },
  footerInner: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '40px',
      justifyContent: 'space-between',
      marginBottom: '50px'
  },
  footerCol: {
      flex: '1',
      minWidth: '200px'
  },
  footerTitle: {
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#E60000',
      letterSpacing: '2px'
  },
  footerText: {
      fontSize: '0.8rem',
      lineHeight: '1.6',
      opacity: 0.7
  },
  footerList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
  },
  footerLink: {
      display: 'block',
      color: '#F1E9DB',
      textDecoration: 'none',
      fontSize: '0.8rem',
      marginBottom: '10px',
      opacity: 0.7,
      transition: 'opacity 0.3s'
  },
  footerBottom: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: '1px solid #333',
      paddingTop: '20px',
      fontSize: '0.7rem',
      opacity: 0.5
  }
};

export default Contact;