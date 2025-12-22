import { memo } from 'react';
import Home from './Home';
import About from './About';
import DJsPicks from '../components/DJsPicks';


const HomePage = () => {
  return (
    <div>
      <Home/>
      {/* <About/> */}
      <DJsPicks/>
    </div>
  );
};

export default memo(HomePage);