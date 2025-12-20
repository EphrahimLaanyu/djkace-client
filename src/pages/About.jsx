import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the plugin
gsap.registerPlugin(ScrollTrigger);

// --- PLACEHOLDER IMAGES (Replace with your own) ---
// You can use the same ones or new ones. 
import img1 from '../assets/IMG_9811-removebg-preview.png'; 
import img2 from '../assets/DSC02056-removebg-preview.png';
import img3 from '../assets/PAT01853-removebg-preview.png';

const About = () => {
  const container = useRef();

  useGSAP(() => {
    // Select all image wrappers
    const images = gsap.utils.toArray('.parallax-img');

    images.forEach((img) => {
      gsap.to(img, {
        yPercent: 20, // Moves the image DOWN by 20% while container moves up
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement, // Trigger based on the container
          start: "top bottom", // Start when top of container hits bottom of screen
          end: "bottom top", // End when bottom of container hits top of screen
          scrub: 1.5, // "1.5" adds that luxurious delay/weight (smoothness)
        } 
      });
    });

    // Optional: Fade in text as you scroll
    const texts = gsap.utils.toArray('.fade-text');
    texts.forEach((text) => {
      gsap.from(text, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: text,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      });
    });

  }, { scope: container });

  return (
    <div ref={container} style={styles.wrapper}>
      
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <h1 style={styles.bigTitle}>THE ARCHIVE</h1>
        <p style={styles.subtitle}>( SCROLL TO EXPLORE )</p>
      </div>

      {/* SECTION 1: Text Left, Image Right */}
      <section style={styles.section}>
        <div style={styles.textCol}>
          <h2 className="fade-text" style={styles.sectionTitle}>ORIGIN STORY</h2>
          <p className="fade-text" style={styles.bodyText}>
            Born from the underground scenes of Nairobi, DJ Kace isn't just a selector—he is an architect of sound. Merging high-voltage Afro-Tech with deep house frequencies.
          </p>
        </div>
        <div style={styles.imgWrapper}>
          {/* The image is larger than the wrapper (120%) so it has room to move */}
          <img src={img1} className="parallax-img" alt="DJ Origin" style={styles.image} />
        </div>
      </section>

      {/* SECTION 2: Image Left, Text Right */}
      <section style={{...styles.section, flexDirection: 'row-reverse'}}>
        <div style={styles.textCol}>
          <h2 className="fade-text" style={styles.sectionTitle}>THE PHILOSOPHY</h2>
          <p className="fade-text" style={styles.bodyText}>
            Music is not just audio; it is a physical force. Every mix is curated to bridge the gap between the digital and the spiritual. Pure industrial rhythm.
          </p>
        </div>
        <div style={styles.imgWrapper}>
          <img src={img2} className="parallax-img" alt="DJ Philosophy" style={styles.image} />
        </div>
      </section>

      {/* SECTION 3: Large Center Image */}
      <section style={{...styles.section, flexDirection: 'column', height: 'auto'}}>
        <div style={{...styles.imgWrapper, width: '100%', height: '60vh'}}>
          <img src={img3} className="parallax-img" alt="DJ Live" style={styles.image} />
        </div>
        <div style={{marginTop: '50px', textAlign: 'center'}}>
          <h2 className="fade-text" style={styles.sectionTitle}>FUTURE SOUNDS</h2>
          <p className="fade-text" style={styles.bodyText}>
            Constantly evolving. Never static.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <div style={styles.footer}>
        <span>© 2025 DJ KACE ARCHIVE</span>
      </div>

    </div>
  );
};

// --- STYLES (Industrial Beige Theme) ---
const styles = {
  wrapper: {
    backgroundColor: '#F1E9DB', // Your Beige
    color: '#111',
    minHeight: '100vh',
    width: '100vw',
    fontFamily: '"Rajdhani", sans-serif',
    overflowX: 'hidden'
  },
  header: {
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '1px solid #ccc'
  },
  bigTitle: {
    fontSize: 'clamp(3rem, 10vw, 8rem)',
    margin: 0,
    fontWeight: '800',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    marginTop: '20px',
    fontSize: '0.8rem',
    letterSpacing: '0.2em',
    color: '#666'
  },
  section: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '100px 5vw',
    minHeight: '80vh',
    gap: '50px',
    borderBottom: '1px solid rgba(0,0,0,0.05)'
  },
  textCol: {
    flex: 1,
    padding: '20px'
  },
  sectionTitle: {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '20px',
    textTransform: 'uppercase'
  },
  bodyText: {
    fontSize: '1.2rem',
    lineHeight: '1.6',
    color: '#333',
    maxWidth: '500px'
  },
  // THE KEY TO PARALLAX: Overflow Hidden
  imgWrapper: {
    flex: 1,
    height: '600px', // Fixed height for the window
    overflow: 'hidden', // Hides the parts of the image that scroll out
    position: 'relative',
    backgroundColor: '#000' // Placeholder color
  },
  image: {
    width: '100%',
    height: '140%', // Must be taller than wrapper to allow movement!
    objectFit: 'cover',
    position: 'absolute',
    top: '-20%', // Start slightly pulled up
    willChange: 'transform' // Performance optimization
  },
  footer: {
    padding: '50px',
    textAlign: 'center',
    fontSize: '0.8rem',
    letterSpacing: '0.2em',
    borderTop: '1px solid #111',
    marginTop: '50px'
  }
};

export default About;