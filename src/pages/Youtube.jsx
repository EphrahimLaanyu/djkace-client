import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from './Footer';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar'; 

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
    const [selectedVideo, setSelectedVideo] = useState(null); 

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

    const closeModal = () => setSelectedVideo(null);

    if (loading) return <div style={styles.loader}>INITIALIZING VISUALS...</div>;

    return (
        <div style={styles.mainContainer}>
            {/* <Navbar /> */}
            
            <SEO 
                title="Visual Archive" 
                description="Watch DJ Kace live sets and video mixes." 
                url="https://deejaykace.co.ke/youtube"
            />

            <div ref={containerRef} style={styles.pageWrapper} className="pageWrapper">
                
                {/* HEADER */}
                <div style={styles.headerBlock}>
                    <button onClick={() => navigate('/')} style={styles.backBtn}>
                        ← RETURN TO HOME
                    </button>
                    <div style={styles.brandTitle} className="brandTitle">VISUAL ARCHIVE</div>
                    <div style={styles.brandSub}>VIDEO MIX DATABASE // REC</div>
                </div>

                <TechDivider />

                {/* THE GRID */}
                <div style={styles.gridContainer} className="gridContainer">
                    {videos.map((video, index) => {
                        const videoId = getYouTubeId(video.link);
                        const thumbnailUrl = videoId 
                            ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
                            : 'https://via.placeholder.com/640x360.png?text=NO+IMAGE';

                        return (
                            <div 
                                key={video.id} 
                                ref={addToRefs}
                                style={styles.videoCard}
                                onClick={() => setSelectedVideo(video)}
                                className="video-card-hover"
                            >
                                <div style={styles.imageContainer}>
                                    <div style={styles.cornerMarkerTop}></div>
                                    
                                    {/* PLAY BUTTON OVERLAY */}
                                    <div className="play-overlay" style={styles.playOverlay}>
                                        <div style={styles.playButton} className="play-button-icon">▶</div>
                                    </div>

                                    <img 
                                        src={thumbnailUrl} 
                                        alt={video.title} 
                                        style={styles.thumbnail}
                                        onError={(e) => { e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                                    />
                                    <div style={styles.cornerMarkerBottom}></div>
                                </div>

                                <div style={styles.metaContainer}>
                                    <div style={styles.metaHeader}>
                                        <span style={styles.idBadge}>REF: {index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                                        <span style={styles.formatBadge}>HD VIDEO</span>
                                    </div>
                                    <div style={styles.videoTitle} className="videoTitle">{video.title}</div>
                                    <div style={styles.actionLine}>
                                        <span style={styles.watchLink}>Tap to Watch ↗</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <TechDivider />
                
                <div style={styles.receiptFooter}>
                    <div style={styles.barcode}>|| ||| |||| || ||| || |||||</div>
                    <div style={styles.thankYou}>END OF VISUAL LOG</div>
                </div>

            </div>

            <Footer />

            {/* MODAL IMPLEMENTATION */}
            {selectedVideo && (
                <div style={styles.modalOverlay} onClick={closeModal} className="modal-overlay">
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()} className="modal-content">
                        <button style={styles.closeModalBtn} onClick={closeModal} className="close-modal-btn">✕ CLOSE</button>
                        <div style={styles.iframeWrapper}>
                            <iframe 
                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.link)}?autoplay=1`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                                style={styles.iframe}
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                /* GLOBAL FIXES */
                * { box-sizing: border-box; }

                /* DESKTOP HOVER EFFECTS */
                .video-card-hover { transition: all 0.3s ease; }
                .video-card-hover:hover { transform: translateY(-5px); }
                .video-card-hover:hover .videoTitle { color: #E60000; }
                .video-card-hover:hover img { filter: grayscale(0%) contrast(1.1); }
                
                .play-overlay { opacity: 0; transition: opacity 0.3s ease; }
                .video-card-hover:hover .play-overlay { opacity: 1; }

                /* --- MOBILE & RESPONSIVE STYLES --- */
                @media (max-width: 768px) {
                    /* Page Layout */
                    .pageWrapper {
                        padding-top: 100px !important;
                        padding-left: 15px !important;
                        padding-right: 15px !important;
                        width: 100% !important;
                    }
                    
                    /* Typography */
                    .brandTitle { 
                        font-size: 1.8rem !important; 
                        letter-spacing: -1px !important;
                    }
                    
                    /* Grid - Single Column for Mobile */
                    .gridContainer { 
                        grid-template-columns: 1fr !important; 
                        gap: 40px !important; /* increased gap for clarity on mobile scroll */
                        width: 100% !important;
                    }
                    
                    .videoTitle { font-size: 1rem !important; }

                    /* Always show Play Button on Mobile (since there is no hover) */
                    .play-overlay {
                        opacity: 1 !important;
                        background-color: rgba(0,0,0,0.1) !important; /* Lighter overlay on mobile */
                    }
                    .play-button-icon {
                        width: 50px !important;
                        height: 50px !important;
                        font-size: 20px !important;
                        background-color: rgba(230, 0, 0, 0.9) !important;
                    }

                    /* --- MODAL MOBILE TWEAKS --- */
                    .modal-overlay {
                        padding: 10px !important; /* Tighter padding on mobile */
                        align-items: center !important;
                    }
                    
                    .modal-content {
                        width: 100% !important;
                    }

                    .close-modal-btn {
                        padding: 12px 20px !important; /* Larger touch target */
                        font-size: 0.9rem !important;
                        background: rgba(0,0,0,0.8) !important; /* Dark background to pop */
                        margin-bottom: 10px !important;
                    }
                }
            `}</style>
        </div>
    );
};

// --- STYLES ---
const styles = {
    mainContainer: {
        width: '100vw', 
        minHeight: '100vh',
        backgroundColor: '#F1E9DB',
        display: 'flex', 
        flexDirection: 'column',
        overflowX: 'hidden' 
    },
    pageWrapper: { 
        minHeight: '100vh', 
        width: '100%', 
        boxSizing: 'border-box', 
        color: '#111', 
        fontFamily: '"Space Mono", monospace',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: '100px 20px 40px'
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', 
        gap: '30px',
        width: '100%', 
        maxWidth: '1000px',
        margin: '0 auto',
        boxSizing: 'border-box'
    },

    // VIDEO CARD
    videoCard: { 
        display: 'flex', flexDirection: 'column', gap: '15px',
        cursor: 'pointer', opacity: 0, transform: 'translateY(20px)'
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
        filter: 'grayscale(100%)', 
        transition: 'filter 0.4s ease'
    },
    cornerMarkerTop: { position: 'absolute', top: '10px', left: '10px', width: '20px', height: '20px', borderTop: '2px solid #E60000', borderLeft: '2px solid #E60000', zIndex: 2 },
    cornerMarkerBottom: { position: 'absolute', bottom: '10px', right: '10px', width: '20px', height: '20px', borderBottom: '2px solid #E60000', borderRight: '2px solid #E60000', zIndex: 2 },
    
    // Play Overlay
    playOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 3, pointerEvents: 'none'
    },
    playButton: {
        width: '60px', height: '60px', borderRadius: '50%',
        backgroundColor: '#E60000', color: '#fff',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        fontSize: '24px', paddingLeft: '4px',
        boxShadow: '0 0 20px rgba(230, 0, 0, 0.5)'
    },

    // METADATA
    metaContainer: { display: 'flex', flexDirection: 'column', gap: '8px' },
    metaHeader: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.6, borderBottom: '1px solid #ccc', paddingBottom: '5px' },
    idBadge: { fontWeight: 'bold' },
    formatBadge: { letterSpacing: '1px' },
    
    videoTitle: { 
        fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', 
        lineHeight: '1.2', marginTop: '5px'
    },
    
    actionLine: { marginTop: '5px' },
    watchLink: { fontSize: '0.75rem', fontWeight: 'bold', color: '#E60000', textDecoration: 'underline', letterSpacing: '1px' },

    // FOOTER
    receiptFooter: { textAlign: 'center', width: '100%', maxWidth: '600px', marginTop: '20px', opacity: 0.6 },
    barcode: { fontFamily: '"Libre Barcode 39 Text", cursive', fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px' },
    thankYou: { fontSize: '0.8rem' },

    // MODAL STYLES
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '20px'
    },
    modalContent: {
        width: '100%', maxWidth: '900px',
        display: 'flex', flexDirection: 'column', gap: '10px'
    },
    closeModalBtn: {
        alignSelf: 'flex-end',
        background: 'transparent', color: '#fff',
        border: '1px solid #E60000', padding: '8px 16px',
        cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold',
        fontSize: '0.8rem', letterSpacing: '1px',
        transition: 'all 0.2s'
    },
    iframeWrapper: {
        position: 'relative', width: '100%', paddingBottom: '56.25%', // 16:9
        backgroundColor: '#000', border: '1px solid #333'
    },
    iframe: {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'
    }
};

export default YouTube;