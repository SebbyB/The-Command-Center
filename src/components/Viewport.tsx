import React from 'react';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';

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
        return (
          <section className="py-20 px-4 min-h-full" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-6xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                  TRANSPARENCY DEMO
                </h2>
                <p className="text-2xl text-yellow-200 font-semibold">
                  🌈 This colorful section tests the terminal's glass effect 🌈
                </p>
              </div>
              
              <div className="grid md:grid-cols-1 gap-12">
                <div style={{background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8)'}} className="p-8 rounded-lg">
                  <h3 className="text-4xl font-bold text-white mb-6 text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                    🎨 RAINBOW GRADIENT SECTION 🎨
                  </h3>
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-red-500 h-32 rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                      <span className="text-white text-2xl font-bold">RED</span>
                    </div>
                    <div className="bg-green-500 h-32 rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                      <span className="text-white text-2xl font-bold">GREEN</span>
                    </div>
                    <div className="bg-blue-500 h-32 rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform">
                      <span className="text-white text-2xl font-bold">BLUE</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-3xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                      Lorem Ipsum Content
                    </h4>
                    <p className="text-xl text-white leading-relaxed" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. This bright, colorful text should be clearly visible through the terminal's glass effect. 
                      The terminal should blur and tint this vibrant background while still allowing you to see the content behind it.
                    </p>
                  </div>
                </div>
                
                <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'}} className="p-8 rounded-lg mt-8">
                  <h3 className="text-4xl font-bold text-white mb-6 text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                    ⚡ ELECTRIC GRADIENT SECTION ⚡
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div style={{background: 'linear-gradient(45deg, #ff0000, #ff8800)'}} className="h-24 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">FIRE</span>
                    </div>
                    <div style={{background: 'linear-gradient(45deg, #00ff00, #88ff00)'}} className="h-24 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">LIME</span>
                    </div>
                    <div style={{background: 'linear-gradient(45deg, #0088ff, #8800ff)'}} className="h-24 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">OCEAN</span>
                    </div>
                    <div style={{background: 'linear-gradient(45deg, #ff00ff, #ff0088)'}} className="h-24 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg font-bold">MAGIC</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div style={{background: 'rgba(255,255,255,0.2)'}} className="p-6 rounded-lg backdrop-blur-sm">
                      <h4 className="text-2xl font-bold text-white mb-3">Glass Effect Test Area</h4>
                      <p className="text-lg text-white">
                        This bright, high-contrast section with vibrant gradients should be easily visible through 
                        the terminal's glass transparency. Look for blurred colors and text when the terminal overlaps this area.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-16" style={{background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8, #6c5ce7)'}} className="p-12 rounded-lg">
                <h3 className="text-5xl font-bold text-white mb-6 text-center" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.5)'}}>
                  🌟 MEGA RAINBOW SECTION 🌟
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div style={{background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'}} className="h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-800 text-2xl font-bold">PINK DREAMS</span>
                  </div>
                  <div style={{background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'}} className="h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-800 text-2xl font-bold">MINT CANDY</span>
                  </div>
                  <div style={{background: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)'}} className="h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-800 text-2xl font-bold">SUNSET GLOW</span>
                  </div>
                </div>
                <div className="text-center" style={{background: 'rgba(0,0,0,0.3)'}} className="p-8 rounded-lg">
                  <h4 className="text-3xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>
                    ULTIMATE TRANSPARENCY TEST
                  </h4>
                  <p className="text-xl text-white leading-relaxed" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>
                    This ultra-colorful, high-contrast section with multiple gradients and bright colors 
                    is designed to test the terminal's glass transparency effect. You should see these 
                    vibrant colors blurred and visible through the terminal when it overlaps this content.
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      case 'skills':
        return (
          <section className="py-20 px-4 flex items-center justify-center min-h-full bg-component">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4 font-mono">
                  Technical Skills
                </h2>
                <p className="text-gray-600">Technologies and tools I work with</p>
              </div>
              
              <div className="component-card p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-3">🎨</span>
                      Frontend Technologies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Svelte'].map(skill => (
                        <div key={skill} className="bg-blue-50 text-blue-800 px-3 py-2 rounded text-center text-sm font-medium">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-3">⚙️</span>
                      Backend Technologies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Node.js', 'Python', 'Express.js', 'PostgreSQL', 'MongoDB', 'Redis'].map(skill => (
                        <div key={skill} className="bg-green-50 text-green-800 px-3 py-2 rounded text-center text-sm font-medium">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="text-2xl mr-3">🛠️</span>
                      DevOps & Tools
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Docker', 'AWS', 'Git', 'GitHub Actions', 'Figma', 'VSCode'].map(skill => (
                        <div key={skill} className="bg-purple-50 text-purple-800 px-3 py-2 rounded text-center text-sm font-medium">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return (
          <section className="py-20 px-4 flex items-center justify-center min-h-full bg-component">
            <div className="max-w-4xl mx-auto text-center">
              <div className="component-card p-12">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800">
                  Welcome to my
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-blue-600">
                  Portfolio
                </h2>
                <div className="space-y-4 text-lg text-gray-600">
                  <p>Interactive terminal-based portfolio</p>
                  <p className="font-mono text-purple-600">
                    Type <span className="text-blue-600 font-semibold">'help'</span> in the terminal below to get started
                  </p>
                </div>
                
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="component-card p-6 text-center">
                    <div className="text-3xl mb-3">💻</div>
                    <div className="font-semibold text-gray-700">Full Stack</div>
                  </div>
                  <div className="component-card p-6 text-center">
                    <div className="text-3xl mb-3">🚀</div>
                    <div className="font-semibold text-gray-700">React Expert</div>
                  </div>
                  <div className="component-card p-6 text-center">
                    <div className="text-3xl mb-3">⚡</div>
                    <div className="font-semibold text-gray-700">TypeScript</div>
                  </div>
                  <div className="component-card p-6 text-center">
                    <div className="text-3xl mb-3">🎨</div>
                    <div className="font-semibold text-gray-700">UI/UX</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
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
        return (
          <section className="py-20 px-4 min-h-full" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-6xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
                  TRANSPARENCY DEMO
                </h2>
                <p className="text-2xl text-yellow-200 font-semibold">
                  🌈 This colorful section tests the terminal's glass effect 🌈
                </p>
              </div>
              {/* Simplified version for exit animation */}
              <div className="grid md:grid-cols-1 gap-12">
                <div style={{background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8)'}} className="p-8 rounded-lg">
                  <h3 className="text-4xl font-bold text-white mb-6 text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                    🎨 RAINBOW GRADIENT SECTION 🎨
                  </h3>
                </div>
              </div>
            </div>
          </section>
        );
      case 'projects':
        return <Projects />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <section className="py-20 px-4 flex items-center justify-center min-h-full bg-component">
            <div className="max-w-4xl mx-auto text-center">
              <div className="component-card p-12">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-800">
                  Welcome to my
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 text-blue-600">
                  Portfolio
                </h2>
              </div>
            </div>
          </section>
        );
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