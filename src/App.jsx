import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import Mixes from './pages/Mixes';
// import About from './pages/About';

// Global Components
import Navbar from './components/Navbar';
import { AudioProvider } from './context/AudioContext';
import Contact from './pages/Contacts';
import ScrollToTop from './context/ScrollToTop';
function App() {
  return (
    <AudioProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        
        <main style={{ minHeight: '80vh' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mixes" element={<Mixes />} />
            <Route path="/contacts" element={<Contact />} />
          </Routes>
        </main>

      </Router>
</AudioProvider>
  );
}

export default App;