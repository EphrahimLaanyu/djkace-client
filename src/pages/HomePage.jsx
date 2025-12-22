import { memo } from 'react';
import Home from './Home';
import DJsPicks from '../components/DJsPicks';
// import About from './About'; 

const HomePage = () => {
  return (
    <div style={styles.mainWrapper}>
      <Home/>
      {/* <About/> */}
      <DJsPicks/>
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