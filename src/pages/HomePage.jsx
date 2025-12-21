import { memo } from 'react';
import Home from './Home';
import About from './About';

const HomePage = () => {
  return (
    <div>
      <Home/>
      {/* <About/> */}
    </div>
  );
};

export default memo(HomePage);