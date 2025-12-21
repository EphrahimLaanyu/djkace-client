import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
import Home from './pages/Home';
// import Mixes from './pages/Mixes';
import About from './pages/About';
import HomePage from './pages/HomePage';
// import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/mixes" element={<Mixes />} />
          <Route path="/about-dj-kace" element={<About />} />
          <Route path="/book-deejay-kace" element={<Contact />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;