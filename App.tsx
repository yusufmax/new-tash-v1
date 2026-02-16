import React from 'react';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { UIInterface } from './components/UIInterface';
import { LoadingScreen } from './components/LoadingScreen';

const App: React.FC = () => {
  return (
    <>
      <LoadingScreen />
      {/* 3D Canvas Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <Experience />
      </div>

      {/* UI Overlay (Fixed) */}
      <UIInterface />
      <Overlay />

      {/* Scroll Control Container 
          This div determines the total scroll length. 
          500vh means the user has to scroll 5 screens worth of height to complete the path.
      */}
      <div className="scroll-container w-full" style={{ height: '600vh' }}>
        {/* This container is empty, it just provides the scrollbar and height for ScrollTrigger */}
      </div>
    </>
  );
};

export default App;