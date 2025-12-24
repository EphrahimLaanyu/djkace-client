import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Contact = () => {
  const containerRef = useRef(null);
  const recordRef = useRef(null);
  const formRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('IDLE'); // IDLE, SENDING, SENT

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('SENDING');
    
    // Simulate sending
    setTimeout(() => {
        setStatus('SENT');
        setTimeout(() => {
            setStatus('IDLE');
            setFormData({ name: '', email: '', message: '' });
        }, 3000);
    }, 2000);
  };

  useGSAP(() => {
    // 1. SPINNING RECORD ANIMATION
    const spin = gsap.to(recordRef.current, {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
      transformOrigin: "center center"
    });

    // Hover Interaction for Record
    const recordEl = recordRef.current;
    if (recordEl) {
        recordEl.addEventListener('mouseenter', () => gsap.to(spin, { timeScale: 0.2, duration: 0.5 }));
        recordEl.addEventListener('mouseleave', () => gsap.to(spin, { timeScale: 1, duration: 1 }));
    }

    // 2. FORM ENTRY ANIMATION
    gsap.from(".form-track", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} style={styles.pageWrapper}>
      
      {/* --- LEFT SIDE: THE TEXT & FORM --- */}
      <div className="sleeve-side" style={styles.sleeveContainer}>
        
        <div style={styles.headerBlock}>
            <h2 style={styles.albumTitle}>THE CONTACT SESSIONS</h2>
            <div style={styles.albumSub}>VOL. 1 • 2025 • STEREO</div>
            <div style={styles.divider}>====================================</div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
            
            {/* TRACK 01: NAME */}
            <div className="form-track" style={styles.inputGroup}>
                <div style={styles.trackNum}>A1.</div>
                <div style={styles.inputWrapper}>
                    <label style={styles.label}>ARTIST NAME (Required)</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="ENTER YOUR NAME..."
                        style={styles.input}
                    />
                </div>
                <div style={styles.duration}>03:21</div>
            </div>

            {/* TRACK 02: EMAIL */}
            <div className="form-track" style={styles.inputGroup}>
                <div style={styles.trackNum}>A2.</div>
                <div style={styles.inputWrapper}>
                    <label style={styles.label}>CONTACT FREQUENCY (Email)</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="ENTER YOUR EMAIL..."
                        style={styles.input}
                    />
                </div>
                <div style={styles.duration}>04:05</div>
            </div>

            {/* TRACK 03: MESSAGE */}
            <div className="form-track" style={styles.inputGroup}>
                <div style={styles.trackNum}>A3.</div>
                <div style={styles.inputWrapper}>
                    <label style={styles.label}>THE MESSAGE (Details)</label>
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

            {/* SUBMIT BUTTON (PLAY) */}
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


      {/* --- RIGHT SIDE: THE VINYL --- */}
      <div className="record-side" style={styles.recordSide}>
        <div style={styles.recordWrapper}>
            <svg 
                ref={recordRef}
                viewBox="0 0 600 600" 
                style={styles.recordSvg}
            >
                <defs>
                    <path id="infoPath1" d="M 300, 300 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0" />
                    <path id="infoPath2" d="M 300, 300 m -160, 0 a 160,160 0 1,1 320,0 a 160,160 0 1,1 -320,0" />
                </defs>

                {/* Vinyl Base */}
                <circle cx="300" cy="300" r="295" fill="#111" />
                <circle cx="300" cy="300" r="290" fill="none" stroke="#222" strokeWidth="2" />
                <circle cx="300" cy="300" r="270" fill="none" stroke="#1a1a1a" strokeWidth="5" />
                
                {/* GROOVE TEXT: DIRECT CONTACT INFO */}
                <text fill="#E60000" fontSize="16" fontFamily="monospace" letterSpacing="3" fontWeight="bold">
                    <textPath href="#infoPath1" startOffset="0%">
                        BOOKINGS: INFO@DEEJAYKACE.COM • PHONE: +254 700 000 000 • NAIROBI •
                    </textPath>
                </text>

                <text fill="#666" fontSize="14" fontFamily="monospace" letterSpacing="4">
                    <textPath href="#infoPath2" startOffset="50%">
                        FOLLOW ON INSTAGRAM @DEEJAYKACE • LISTEN ON MIXCLOUD •
                    </textPath>
                </text>

                {/* Center Label */}
                <circle cx="300" cy="300" r="110" fill="#E60000" />
                <circle cx="300" cy="300" r="15" fill="#F1E9DB" />
                
                <text x="300" y="270" textAnchor="middle" fill="#000" fontSize="28" fontWeight="900" fontFamily="sans-serif">SIDE B</text>
                <text x="300" y="300" textAnchor="middle" fill="#000" fontSize="12" fontFamily="monospace">DIRECT LINE</text>
                <text x="300" y="340" textAnchor="middle" fill="#000" fontSize="10" fontFamily="monospace">45 RPM</text>

                {/* Shine */}
                <circle cx="300" cy="300" r="295" fill="url(#shine)" opacity="0.15" pointerEvents="none"/>
                <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
            </svg>
        </div>
      </div>

      <style>{`
        ::placeholder { color: #888; opacity: 0.6; }
        
        /* MEDIA QUERY: 
           On screens smaller than 900px, we hide the vinyl 
           so the form takes up the full width. 
        */
        @media (max-width: 900px) {
            .record-side { display: none !important; } 
            .sleeve-side { border-right: none !important; }
        }
      `}</style>
    </section>
  );
};

// --- STYLES ---
const styles = {
  pageWrapper: {
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row', // Ensures Left-Right layout
    flexWrap: 'wrap',
    backgroundColor: '#F1E9DB', 
    color: '#111',
    fontFamily: '"Space Mono", monospace',
    overflowX: 'hidden'
  },

  // --- LEFT: THE SLEEVE (FORM) ---
  sleeveContainer: {
    flex: '1 1 500px', // Grows to fill space, min-width 500px
    padding: '80px 50px',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center',
    borderRight: '1px solid #ccc',
    position: 'relative',
    backgroundColor: '#F1E9DB'
  },
  headerBlock: { marginBottom: '40px' },
  albumTitle: { fontSize: '2.5rem', fontWeight: '900', lineHeight: '1', marginBottom: '10px', letterSpacing: '-1px' },
  albumSub: { fontSize: '0.9rem', color: '#666', letterSpacing: '1px' },
  divider: { margin: '20px 0', opacity: 0.3, whiteSpace: 'nowrap', overflow: 'hidden' },

  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  
  // Input Group
  inputGroup: {
    display: 'flex', alignItems: 'flex-start',
    padding: '15px 0',
    borderBottom: '1px dotted #aaa'
  },
  trackNum: { 
    width: '40px', fontWeight: 'bold', paddingTop: '10px', color: '#E60000' 
  },
  inputWrapper: { flexGrow: 1, display: 'flex', flexDirection: 'column' },
  label: { 
    fontSize: '0.6rem', color: '#666', marginBottom: '5px', 
    textTransform: 'uppercase', letterSpacing: '1px' 
  },
  input: {
    background: 'transparent', border: 'none',
    fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold',
    color: '#111', outline: 'none', width: '100%'
  },
  textarea: {
    background: 'transparent', border: 'none',
    fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold',
    color: '#111', outline: 'none', width: '100%', resize: 'none'
  },
  duration: { 
    fontSize: '0.8rem', color: '#888', paddingTop: '10px', width: '50px', textAlign: 'right' 
  },

  submitRow: { marginTop: '30px' },
  submitBtn: {
    background: '#111', color: '#F1E9DB', border: 'none',
    padding: '20px 40px', fontSize: '1rem', fontWeight: 'bold',
    fontFamily: 'inherit', cursor: 'pointer',
    width: '100%', textAlign: 'left',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase'
  },

  creditsFooter: { marginTop: 'auto', paddingTop: '40px' },
  smallCredit: { fontSize: '0.6rem', color: '#888', marginBottom: '5px' },

  // --- RIGHT: THE RECORD ---
  recordSide: {
    flex: '1 1 500px', // Grows to fill space, min-width 500px
    backgroundColor: '#0a0a0a',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    
    // Sticky Positioning: keeps vinyl visible on the right while scrolling
    position: 'sticky', 
    top: 0, 
    height: '100vh',
    overflow: 'hidden'
  },
  recordWrapper: { width: '80%', maxWidth: '600px' },
  recordSvg: { 
    width: '100%', height: 'auto', 
    filter: 'drop-shadow(0px 20px 40px rgba(0,0,0,0.6))',
    cursor: 'pointer' 
  }
};

export default Contact;