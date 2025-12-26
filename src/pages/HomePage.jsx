import { memo } from 'react';
import Home from './Home';
import DJsPicks from '../components/DJsPicks';
import About from './About';
import Footer from './Footer';
// IMPORT SEO COMPONENT
import SEO from '../components/SEO';

const HomePage = () => {
  return (
    <div style={styles.mainWrapper}>
      {/* SEO CONFIGURATION:
          - Sets the title to target "DJ Kace" and "Kenya".
          - Description includes key terms for ranking (Nairobi, Mixes, Booking).
          - URL matches your actual domain for authority.
      */}
      <SEO 
        title="Home" 
        description="The official website of Deejay Kace. Voted one of the top DJs in Kenya. Stream the latest Afrobeat, Hiphop and Dancehall mixes, check event dates, and book the best DJ in Nairobi."
        url="https://deejaykace.co.ke"
      />

      <Home/>
      <DJsPicks/>
      <About/>
      <Footer/>
    </div>
  );
};

const styles = {
  mainWrapper: {
    width: '100%',
    maxWidth: '100vw',      // Hard limit on width
    overflowX: 'hidden',    // CRITICAL: Cuts off any elements sticking out
    position: 'relative',   // Keeps context for absolute children
    margin: 0,
    padding: 0,
    boxSizing: 'border-box' // Ensures padding doesn't add width
  }
};

export default memo(HomePage);