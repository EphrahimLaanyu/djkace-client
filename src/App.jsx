import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import Mixes from './pages/Mixes';
// import About from './pages/About';

// Global Components
import Navbar from './components/Navbar';
import MiniDiscWidget from './components/MiniDiscWidget'; // <-- Import Widget

// Context
import { AudioProvider } from './components/AudioContext';

function App() {
  return (
    <AudioProvider>
      <Router>
        <Navbar />
        
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mixes" element={<Mixes />} />
          </Routes>
        </main>

        {/* PERSISTENT PLAYER WIDGET */}
        {/* It lives outside the Routes so it never reloads */}
        <MiniDiscWidget />

      </Router>
    </AudioProvider>
  );
}

export default App;