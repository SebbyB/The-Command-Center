import React from 'react';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Demo from './sections/Demo';
import Skills from './sections/Skills';
import Home from './sections/Home';

interface ViewportProps {
  currentSection: string;
  exitingSection: string;
  isTransitioning: boolean;
  pageAnimations: boolean;
}

const Viewport: React.FC<ViewportProps> = ({ currentSection, exitingSection, isTransitioning, pageAnimations }) => {
  const renderSection = () => {
    switch (currentSection) {
      case 'about':
        return <About />;
      case 'demo':
        return <Demo />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'skills':
        return <Skills />;
      default:
        return <Home />;
    }
  };

  const getAnimationClass = (section: string, isExiting: boolean = false) => {
    if (!pageAnimations) return '';
    
    if (isExiting) {
      switch (section) {
        case 'demo': return 'page-exit-demo';
        case 'about': return 'page-exit-about';
        default: return 'page-exit';
      }
    } else {
      switch (section) {
        case 'demo': return 'page-enter-demo';
        case 'about': return 'page-enter-about';
        default: return 'page-enter';
      }
    }
  };

  const renderExitingSection = () => {
    switch (exitingSection) {
      case 'about':
        return <About />;
      case 'demo':
        return <Demo />;
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'skills':
        return <Skills />;
      default:
        return <Home />;
    }
  };

  return (
    <div className={`viewport-content h-full overflow-y-auto relative ${!pageAnimations ? 'no-animations' : ''}`}>
      {/* Exiting section */}
      {isTransitioning && exitingSection && (
        <div className={`absolute inset-0 ${getAnimationClass(exitingSection, true)}`}>
          {renderExitingSection()}
        </div>
      )}
      
      {/* Current section */}
      {!isTransitioning && (
        <div className={getAnimationClass(currentSection)}>
          {renderSection()}
        </div>
      )}
    </div>
  );
};

export default Viewport;