import Image from 'next/image';
import TextAnim from '../components/animatedtext';
import Metrics from '../components/metrics';
import WeatherWidget from '../components/weatherwidget';
import Spline from '@splinetool/react-spline/next';

import '../css/textanim.css';


export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>


    <TextAnim text="waldhauser.sk"></TextAnim>

    <div className="spline">
    <Spline
        scene="https://prod.spline.design/ax9XD5JSUAXslLu8/scene.splinecode" 
      />
      </div>     

      <p style={{ maxWidth: '600px', margin: '20px auto' }}>
        Welcome to Jozef's website. Please, feel free to check out any page here. Have fun!
      </p>
      
      <Metrics />
      <WeatherWidget />
    </div>
  );
}
