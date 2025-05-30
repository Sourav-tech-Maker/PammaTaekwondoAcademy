import React from 'react';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import AnimatedHeader from './components/AnimatedHeader';
import './styles/main.css';

function App() {
  return (
    <div>
      <AnimatedHeader />
      <AboutSection />
      <TeamSection />
    </div>
  );
};

export default App;