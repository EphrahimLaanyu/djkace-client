export const styles = {
    // --- LAYOUT ---
    mainContainer: { width: '100%', minHeight: '100vh', backgroundColor: '#F1E9DB', display: 'flex', flexDirection: 'column' },
    pageWrapper: { 
        minHeight: '100vh', width: '100%', backgroundColor: '#F1E9DB', color: '#111',
        fontFamily: '"Space Mono", "Courier New", monospace',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '100px 15px', overflowX: 'hidden' 
    },
    loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#E60000', fontFamily: 'monospace', letterSpacing: '2px' },
    
    // --- HEADER ---
    receiptHeader: { textAlign: 'center', marginBottom: '20px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    brandTitle: { fontSize: '2rem', fontWeight: '900', marginBottom: '5px', lineHeight: 1 },
    brandSub: { fontSize: '0.8rem', opacity: 0.6, letterSpacing: '2px' },
    divider: { width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', opacity: 0.3, margin: '15px 0' },
    colHeaders: { display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: 'bold', opacity: 0.5, padding: '0 5px', width: '100%' },
    backBtn: { background: 'transparent', border: '1px solid #111', padding: '10px 20px', marginBottom: '30px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.2s' },

    // --- LIST & ROW ---
    rollContainer: { width: '100%', maxWidth: '600px', paddingBottom: '20px', display: 'flex', flexDirection: 'column' },
    row: { 
        display: 'flex', flexDirection: 'column', padding: '20px 5px', 
        borderBottom: '1px dashed #ccc', cursor: 'pointer', 
        transformOrigin: 'center center', width: '100%', willChange: 'transform, opacity' 
    },
    rowData: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    
    // --- IMAGERY & TEXT ---
    coverWrapper: { display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0 },
    coverImage: { width: '55px', height: '55px', objectFit: 'cover', border: '1px solid #111', filter: 'grayscale(100%)', transition: 'filter 0.3s', borderRadius: '2px' },
    qty: { opacity: 0.5, fontSize: '0.8rem', fontWeight: 'bold' },
    meta: { flexGrow: 1, paddingLeft: '15px', paddingRight: '10px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
    title: { fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', lineHeight: '1.2' },
    artist: { fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' },
    bpm: { fontWeight: 'bold', fontSize: '0.9rem', flexShrink: 0 },

    // --- PLAYER & CONTROLS ---
    playerWrapper: { overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px', height: 'auto' },
    waveformLine: { display: 'flex', alignItems: 'center', gap: '3px', height: '30px', marginTop: '10px', width: '100%', overflow: 'hidden' },
    waveBar: { flex: 1, borderRadius: '2px', transition: 'height 0.1s ease', minWidth: '2px' },
    controlsRow: { display: 'flex', alignItems: 'center', gap: '15px', width: '100%' },
    playBtn: { background: '#111', color: '#fff', border: 'none', padding: '8px 12px', fontFamily: 'inherit', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 },
    downloadBtn: { background: 'transparent', border: '1px solid #111', color: '#111', padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
    scrubberContainer: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    rangeInput: { width: '100%', accentColor: '#E60000', cursor: 'pointer', height: '4px' },
    timeDisplay: { fontSize: '0.75rem', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },

    // --- FOOTER & MARQUEE ---
    receiptFooter: { textAlign: 'center', width: '100%', maxWidth: '600px', marginTop: '20px', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center' },
    totalRow: { width: '100%', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '30px', padding: '0 5px' },
    viewAllBtn: { background: 'transparent', border: '2px solid #111', color: '#111', padding: '15px 30px', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '30px', transition: 'all 0.3s ease', textTransform: 'uppercase' },
    barcode: { fontFamily: '"Libre Barcode 39 Text", cursive', fontSize: '2rem', letterSpacing: '4px', transform: 'scaleY(1.5)', marginBottom: '10px' },
    thankYou: { fontSize: '0.8rem' },
    marqueeBand: { width: '100%', height: '40px', backgroundColor: '#E60000', display: 'flex', alignItems: 'center', overflow: 'hidden', borderTop: '2px solid #111' },
    marqueeText: { fontSize: '1rem', fontWeight: '900', color: '#000', fontFamily: '"Rajdhani", sans-serif', letterSpacing: '2px', paddingRight: '50px', flexShrink: 0 }
};