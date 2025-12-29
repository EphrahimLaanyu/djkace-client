import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from './Footer';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: EXTRACT YOUTUBE ID ---
const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
};

// --- COMPONENT: STYLISH DIVIDER ---
const TechDivider = () => (
    <div style={styles.techDivider}>
        <div style={styles.techLine}></div>
        <div style={styles.techDiamond}></div>
        <div style={styles.techLine}></div>
    </div>
);

// --- MAIN PAGE ---
const YouTube = () => {
    const containerRef = useRef(null);
    const itemsRef = useRef([]); 
    const navigate = useNavigate();
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('https://djkace-api.elaanyu.workers.dev/youtube');
                const data = await response.json();
                setVideos(data);
                setLoading(false);
            } catch (e) { 
                console.error(e); 
                setLoading(false); 
            }
        };
        fetchVideos();
    }, []);

    // --- ANIMATIONS ---
    useGSAP(() => {
        if (loading || videos.length === 0) return;
        itemsRef.current = itemsRef.current.slice(0, videos.length);

        itemsRef.current.forEach((item) => {
            if (!item) return;
            ScrollTrigger.create({
                trigger: item,
                start: "top 90%",
                end: "bottom 10%", 
                toggleClass: { targets: item, className: "active-card" },
                onEnter: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }),
                onEnterBack: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.5 }),
            });
        });
    }, { scope: containerRef, dependencies: [loading, videos] });

    const addToRefs = (el) => {
        if (el && !itemsRef.current.includes(el)) itemsRef.current.push(el);
    };

    if (loading) return <div style={styles.loader}>INITIALIZING VISUALS...</div>;

    return (
        <div style={styles.mainContainer}>
            <SEO 
                title="Visual Archive" 
                description="Watch DJ Kace live sets and video mixes." 
                url="https://deejaykace.co.ke/youtube"
            />

            <div ref={containerRef} style={styles.pageWrapper}>
                
                {/* HEADER */}
                <div style={styles.headerBlock}>
                    <button onClick={() => navigate('/')} style={styles.backBtn}>
                        ← RETURN TO HOME
                    </button>
                    <div style={styles.brandTitle}>VISUAL ARCHIVE</div>
                    <div style={styles.brandSub}>VIDEO MIX DATABASE // REC</div>
                </div>

                <TechDivider />

                {/* THE GRID */}
                <div style={styles.gridContainer}>
                    {videos.map((video, index) => {
                        const videoId = getYouTubeId(video.link);
                        // Use maxresdefault for highest quality, fallback to hqdefault
                        const thumbnailUrl = videoId 
                            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
                            : 'https://via.placeholder.com/640x360.png?text=NO+IMAGE';

                        return (
                            <div 
                                key={video.id} 
                                ref={addToRefs}
                                style={styles.videoCard}
                                onClick={() => window.open(video.link, '_blank')}
                                className="video-card-hover"
                            >
                                {/* CLEAN THUMBNAIL */}
                                <div style={styles.imageContainer}>
                                    <div style={styles.cornerMarkerTop}></div>
                                    <img 
                                        src={thumbnailUrl} 
                                        alt={video.title} 
                                        style={styles.thumbnail}
                                        onError={(e) => { e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                                    />
                                    <div style={styles.cornerMarkerBottom}></div>
                                </div>

                                {/* STYLISH METADATA */}
                                <div style={styles.metaContainer}>
                                    <div style={styles.metaHeader}>
                                        <span style={styles.idBadge}>REF: {index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                                        <span style={styles.formatBadge}>HD VIDEO</span>
                                    </div>
                                    <div style={styles.videoTitle}>{video.title}</div>
                                    <div style={styles.actionLine}>
                                        <span style={styles.watchLink}>Tap to Watch on YouTube ↗</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <TechDivider />
                
                {/* FOOTER */}
                <div style={styles.receiptFooter}>
                    <div style={styles.totalRow}>
                        <span>TOTAL RECORDS:</span>
                        <span>{videos.length}</span>
                    </div>
                    <div style={styles.barcode}>|| ||| |||| || ||| || |||||</div>
                    <div style={styles.thankYou}>END OF VISUAL LOG</div>
                </div>

            </div>

            <Footer />

            <style>{`
                /* Hover Effects */
                .video-card-hover { transition: all 0.3s ease; }
                .video-card-hover:hover { transform: translateY(-5px); }
                .video-card-hover:hover .videoTitle { color: #E60000; }
                .video-card-hover:hover img { filter: grayscale(0%) contrast(1.1); }
                
                /* Mobile Fixes */
                @media (max-width: 768px) {
                    .brandTitle { font-size: 2rem !important; }
                    .gridContainer { grid-template-columns: 1fr !important; gap: 40px !important; }
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const styles = {
    mainContainer: {
        width: '100%', minHeight: '100vh',
        backgroundColor: '#F1E9DB',
        display: 'flex', flexDirection: 'column',
    },
    pageWrapper: { 
        minHeight: '100vh', width: '100vw',
        color: '#111', fontFamily: '"Space Mono", monospace',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '100px 20px 40px', overflowX: 'hidden' 
    },
    loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#E60000', fontFamily: 'monospace', letterSpacing: '2px' },
    
    headerBlock: { textAlign: 'center', marginBottom: '40px', width: '100%', maxWidth: '900px' },
    backBtn: { background: 'transparent', border: '1px solid #111', padding: '10px 20px', marginBottom: '20px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.2s' },
    brandTitle: { fontSize: '3rem', fontWeight: '900', lineHeight: 1, marginBottom: '5px', letterSpacing: '-2px' },
    brandSub: { fontSize: '0.8rem', opacity: 0.6, letterSpacing: '4px', color: '#E60000', fontWeight: 'bold' },

    // DIVIDER
    techDivider: { width: '100%', maxWidth: '900px', display: 'flex', alignItems: 'center', gap: '15px', margin: '40px 0', opacity: 0.4 },
    techLine: { flex: 1, height: '1px', background: '#111' },
    techDiamond: { width: '10px', height: '10px', backgroundColor: '#E60000' },

    // GRID LAYOUT
    gridContainer: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', // Responsive Grid
        gap: '30px',
        width: '100%', 
        maxWidth: '1000px',
        margin: '0 auto'
    },

    // VIDEO CARD
    videoCard: { 
        display: 'flex', flexDirection: 'column', gap: '15px',
        cursor: 'pointer', opacity: 0, transform: 'translateY(20px)' // Initial GSAP state
    },
    
    // IMAGE AREA
    imageContainer: { 
        position: 'relative', width: '100%', aspectRatio: '16/9', 
        backgroundColor: '#000', overflow: 'hidden',
        border: '1px solid #111',
        boxShadow: '5px 5px 0px rgba(0,0,0,0.1)'
    },
    thumbnail: { 
        width: '100%', height: '100%', objectFit: 'cover', 
        filter: 'grayscale(100%)', // Stylish B&W default
        transition: 'filter 0.4s ease'
    },
    // Stylish Corner Markers
    cornerMarkerTop: { position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #E60000', borderLeft: '2px solid #E60000', zIndex: 2 },
    cornerMarkerBottom: { position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #E60000', borderRight: '2px solid #E60000', zIndex: 2 },

    // METADATA
    metaContainer: { display: 'flex', flexDirection: 'column', gap: '8px' },
    metaHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.6, borderBottom: '1px solid #ccc', paddingBottom: '5px' },
    idBadge: { fontWeight: 'bold' },
    formatBadge: { letterSpacing: '1px' },
    
    videoTitle: { 
        fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', 
        lineHeight: '1.2', marginTop: '5px', className: 'videoTitle' 
    },
    
    actionLine: { marginTop: '5px' },
    watchLink: { fontSize: '0.75rem', fontWeight: 'bold', color: '#E60000', textDecoration: 'underline', letterSpacing: '1px' },

    // FOOTER
    receiptFooter: { textAlign: 'center', width: '100%', maxWidth: '600px', marginTop: '20px', opacity: 0.6 },
    totalRow: { display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', marginBottom: '20px', padding: '0 20px' },
    barcode: { fontFamily: '"Libre Barcode 39 Text", cursive', fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px' },
    thankYou: { fontSize: '0.8rem' },
};

export default YouTube;