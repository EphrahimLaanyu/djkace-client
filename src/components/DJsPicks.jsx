import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useTexture, Text, RoundedBox, Cylinder } from '@react-three/drei';
import gsap from 'gsap';
import { useAudio } from '../components/AudioContext';

const WORKER_URL = "https://djkace-api.elaanyu.workers.dev";
const FALLBACK_IMG = "https://via.placeholder.com/500/000000/FFFFFF/?text=NO+SIGNAL";

// --- 3D COMPONENT: THE HOLO-CASSETTE ---
const Cassette = ({ mix, position, rotation, isPlaying, isCurrent }) => {
  const group = useRef();
  const leftSpool = useRef();
  const rightSpool = useRef();

  // Load Album Art as Texture
  // Note: We use a try-catch pattern in useTexture normally, but here we just pass the URL.
  // Ensure your R2 CORS is set correctly as discussed before.
  const texture = useLoader(THREE.TextureLoader, mix.image_url || FALLBACK_IMG);
  texture.crossOrigin = "anonymous";

  useFrame((state, delta) => {
    // 1. Rotate Spools if Playing
    if (isCurrent && isPlaying) {
      leftSpool.current.rotation.z -= delta * 2; // Spin Left
      rightSpool.current.rotation.z -= delta * 2; // Spin Right
    }

    // 2. Idle Floating Animation (Breathing)
    if (isCurrent) {
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      
      {/* 1. THE CLEAR PLASTIC SHELL (Glass) */}
      <RoundedBox args={[6, 3.8, 0.4]} radius={0.2} smoothness={4}>
        <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.9}  // Glass effect
          opacity={1} 
          metalness={0} 
          roughness={0} 
          ior={1.5} 
          thickness={1}
        />
      </RoundedBox>

      {/* 2. THE LABEL (Album Art) */}
      <mesh position={[0, 0.1, 0.21]}>
        <planeGeometry args={[5.4, 2.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* 3. THE SPOOLS (Rotating Parts) */}
      {/* Left Spool */}
      <group position={[-1.4, 0, 0]} ref={leftSpool}>
        {/* The Teeth */}
        <Cylinder args={[0.7, 0.7, 0.45, 12]} rotation={[Math.PI / 2, 0, 0]}>
             <meshStandardMaterial color="#111" />
        </Cylinder>
        {/* The Tape Roll (White/Glow) */}
        <Cylinder args={[0.5, 0.5, 0.46, 32]} rotation={[Math.PI / 2, 0, 0]}>
             <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
        </Cylinder>
      </group>

      {/* Right Spool */}
      <group position={[1.4, 0, 0]} ref={rightSpool}>
        <Cylinder args={[0.7, 0.7, 0.45, 12]} rotation={[Math.PI / 2, 0, 0]}>
             <meshStandardMaterial color="#111" />
        </Cylinder>
        <Cylinder args={[0.3, 0.3, 0.46, 32]} rotation={[Math.PI / 2, 0, 0]}>
             <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
        </Cylinder>
      </group>

      {/* 4. DETAILS (Screws) */}
      <mesh position={[-2.8, 1.7, 0.2]}>
         <circleGeometry args={[0.1, 8]} />
         <meshBasicMaterial color="#333" />
      </mesh>
      <mesh position={[2.8, 1.7, 0.2]}>
         <circleGeometry args={[0.1, 8]} />
         <meshBasicMaterial color="#333" />
      </mesh>
      <mesh position={[-2.8, -1.7, 0.2]}>
         <circleGeometry args={[0.1, 8]} />
         <meshBasicMaterial color="#333" />
      </mesh>
      <mesh position={[2.8, -1.7, 0.2]}>
         <circleGeometry args={[0.1, 8]} />
         <meshBasicMaterial color="#333" />
      </mesh>

    </group>
  );
};

// --- SCENE MANAGER (Handles Animation) ---
const DeckScene = ({ picks, activeIndex, isPlaying }) => {
  const groupRef = useRef();
  
  // We use GSAP to animate the ENTIRE group when index changes
  useEffect(() => {
    if (groupRef.current) {
        // EJECT SEQUENCE
        const tl = gsap.timeline();
        
        // 1. Pull Out (Z axis)
        tl.to(groupRef.current.position, { z: 5, duration: 0.3, ease: "power2.in" })
        // 2. Slide Down (Y axis - out of view)
          .to(groupRef.current.position, { y: -10, duration: 0.2 })
        // 3. Reset Position (Instantly move to top)
          .set(groupRef.current.position, { y: 10, z: 5 })
        // 4. Slam In (Y axis - back to center)
          .to(groupRef.current.position, { y: 0, duration: 0.3, ease: "power2.out" })
        // 5. Push In (Z axis - lock into place)
          .to(groupRef.current.position, { z: 0, duration: 0.2, ease: "back.out(1.5)" });
    }
  }, [activeIndex]);

  const activeMix = picks[activeIndex];

  return (
    <group ref={groupRef}>
      {activeMix && (
        <Cassette 
            mix={activeMix} 
            position={[0, 0, 0]} 
            rotation={[0, 0, 0]} 
            isCurrent={true}
            isPlaying={isPlaying}
        />
      )}
    </group>
  );
};

// --- MAIN COMPONENT ---
const DJsPicks = () => {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();
  const [picks, setPicks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // FETCH
  useEffect(() => {
    const fetchPicks = async () => {
      try {
        const res = await fetch(WORKER_URL);
        const data = await res.json();
        setPicks(data.slice(0, 5)); // Top 5
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchPicks();
  }, []);

  // CONTROLS
  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % picks.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + picks.length) % picks.length);
  };

  const handlePlayActive = () => {
      const mix = picks[activeIndex];
      playTrack(mix);
  };

  // Sync active index if global track changes elsewhere
  useEffect(() => {
    if (currentTrack) {
        const index = picks.findIndex(p => p.id === currentTrack.id);
        if (index !== -1 && index !== activeIndex) {
            setActiveIndex(index);
        }
    }
  }, [currentTrack, picks]);

  if (loading) return null;

  return (
    <div style={styles.container}>
      
      {/* BACKGROUND TEXT */}
      <div style={styles.bgText}>DECK 01</div>

      {/* 3D CANVAS */}
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        {/* Dynamic lighting for the glass */}
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
        <spotLight position={[-10, 5, 10]} color="#E60000" intensity={2} />
        
        <DeckScene 
            picks={picks} 
            activeIndex={activeIndex} 
            isPlaying={isPlaying && currentTrack?.id === picks[activeIndex]?.id} 
        />
      </Canvas>

      {/* HTML CONTROLS INTERFACE */}
      <div style={styles.controlsLayer}>
        
        <div style={styles.header}>
            <h2>HOLOGRAPHIC // DECK</h2>
            <p>CASSETTE ARCHIVE</p>
        </div>

        <div style={styles.controlBar}>
            {/* PREV */}
            <button onClick={handlePrev} style={styles.btn}>
                 &lt; EJECT
            </button>

            {/* MAIN PLAY ACTION */}
            <div style={styles.mainAction} onClick={handlePlayActive}>
                <div style={styles.playLabel}>
                    {isPlaying && currentTrack?.id === picks[activeIndex]?.id ? "STOP TAPE" : "INSERT TAPE"}
                </div>
                <div style={styles.trackTitle}>
                    {picks[activeIndex]?.title || "LOADING..."}
                </div>
            </div>

            {/* NEXT */}
            <button onClick={handleNext} style={styles.btn}>
                 NEXT &gt;
            </button>
        </div>

      </div>

    </div>
  );
};

const styles = {
  container: {
    width: '100%', height: '80vh', position: 'relative',
    background: 'radial-gradient(circle at center, #222 0%, #000 100%)',
    overflow: 'hidden', borderBottom: '2px solid #E60000'
  },
  bgText: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    fontSize: '15vw', fontFamily: '"Rajdhani", sans-serif', fontWeight: '900',
    color: 'rgba(255,255,255,0.03)', pointerEvents: 'none', whiteSpace: 'nowrap'
  },
  controlsLayer: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '40px'
  },
  header: {
    color: '#fff', fontFamily: '"Rajdhani", sans-serif'
  },
  controlBar: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
    pointerEvents: 'auto', marginBottom: '20px'
  },
  btn: {
    background: 'transparent', border: '1px solid #666', color: '#666',
    padding: '15px 30px', fontFamily: 'monospace', cursor: 'pointer',
    fontWeight: 'bold', fontSize: '0.9rem', transition: 'all 0.2s',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  mainAction: {
    textAlign: 'center', cursor: 'pointer', width: '300px'
  },
  playLabel: {
    color: '#E60000', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '2px',
    marginBottom: '5px', animation: 'pulse 2s infinite'
  },
  trackTitle: {
    color: '#fff', fontSize: '1.5rem', fontFamily: '"Rajdhani", sans-serif', fontWeight: 'bold',
    textTransform: 'uppercase'
  }
};

// CSS Injection
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  button:hover { border-color: #E60000 !important; color: #E60000 !important; }
  @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
`;
document.head.appendChild(styleSheet);

export default DJsPicks;