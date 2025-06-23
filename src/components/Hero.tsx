import React from 'react';
import Terminal from './Terminal';

const Hero: React.FC = () => {
  const handleNavigate = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center py-20 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-accent-cyan">Welcome</span>
            <span className="text-primary"> to my </span>
            <span className="text-accent-green">Portfolio</span>
          </h1>
          <p className="text-lg text-secondary mb-8">
            Navigate through my portfolio using terminal commands below
          </p>
        </div>
        
        <Terminal onNavigate={handleNavigate} />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-secondary">
            💡 Try commands like: <span className="text-accent-cyan">help</span>, 
            <span className="text-accent-green"> about</span>, 
            <span className="text-accent-purple"> projects</span>, 
            <span className="text-accent-pink"> skills</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;