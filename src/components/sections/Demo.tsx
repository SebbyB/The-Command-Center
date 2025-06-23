import React from 'react';

const Demo: React.FC = () => {
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

        {/* Additional Large Content Sections */}
        <div className="mt-16 space-y-16">
          {/* Neon Grid Section */}
          <div style={{background: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)'}} className="p-12 rounded-lg">
            <h3 className="text-5xl font-bold text-cyan-400 mb-8 text-center" style={{textShadow: '0 0 20px rgba(34, 211, 238, 0.7)'}}>
              💫 NEON CYBER GRID 💫
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({length: 24}, (_, i) => (
                <div key={i} 
                     className="h-24 rounded-lg border-2 border-cyan-400 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center transform hover:scale-110 transition-all duration-300 hover:border-pink-400"
                     style={{boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)'}}>
                  <span className="text-cyan-300 font-bold text-lg" style={{textShadow: '0 0 10px rgba(34, 211, 238, 0.8)'}}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-800 to-pink-800 rounded-lg">
              <p className="text-white text-xl leading-relaxed text-center" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                This cyberpunk-inspired neon grid demonstrates high contrast elements that should create 
                stunning visual effects when viewed through the terminal's glassmorphism overlay. The 
                glowing borders and neon text should blur beautifully behind the semi-transparent terminal.
              </p>
            </div>
          </div>

          {/* Animated Color Waves */}
          <div style={{background: 'linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8, #6c5ce7, #ff6b6b)'}} 
               className="p-12 rounded-lg animate-pulse">
            <h3 className="text-6xl font-bold text-white mb-12 text-center" style={{textShadow: '4px 4px 8px rgba(0,0,0,0.6)'}}>
              🌊 DYNAMIC COLOR WAVES 🌊
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Wave Pattern Boxes */}
              {[
                {bg: 'linear-gradient(45deg, #ff0844, #ffb199)', title: 'CORAL WAVE', emoji: '🏖️'},
                {bg: 'linear-gradient(45deg, #00d2ff, #928dab)', title: 'OCEAN WAVE', emoji: '🌊'},
                {bg: 'linear-gradient(45deg, #ffecd2, #fcb69f)', title: 'SUNSET WAVE', emoji: '🌅'},
                {bg: 'linear-gradient(45deg, #a8edea, #fed6e3)', title: 'PASTEL WAVE', emoji: '🦄'},
                {bg: 'linear-gradient(45deg, #667eea, #764ba2)', title: 'COSMIC WAVE', emoji: '🌌'},
                {bg: 'linear-gradient(45deg, #f093fb, #f5576c)', title: 'ELECTRIC WAVE', emoji: '⚡'},
              ].map((wave, i) => (
                <div key={i} style={{background: wave.bg}} className="p-8 rounded-xl transform hover:rotate-3 transition-all duration-500">
                  <div className="text-center">
                    <div className="text-4xl mb-4">{wave.emoji}</div>
                    <h4 className="text-2xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>
                      {wave.title}
                    </h4>
                    <div className="h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-semibold">Transparency Test Zone</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geometric Patterns */}
          <div style={{background: 'radial-gradient(circle at center, #667eea 0%, #764ba2 50%, #f093fb 100%)'}} className="p-12 rounded-lg">
            <h3 className="text-5xl font-bold text-white mb-12 text-center" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.5)'}}>
              🔷 GEOMETRIC MATRIX 🔷
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-12">
              {Array.from({length: 64}, (_, i) => {
                const shapes = ['rounded-full', 'rounded-lg', 'rounded-none', 'rounded-xl'];
                const colors = [
                  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
                  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
                ];
                return (
                  <div key={i} 
                       className={`h-12 ${shapes[i % shapes.length]} ${colors[i % colors.length]} 
                                  transform hover:scale-125 transition-all duration-300 
                                  flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-xs">{i + 1}</span>
                  </div>
                );
              })}
            </div>
            <div className="bg-black bg-opacity-30 p-8 rounded-lg backdrop-blur-sm">
              <h4 className="text-3xl font-bold text-white mb-4 text-center">Geometric Transparency Testing</h4>
              <p className="text-xl text-white leading-relaxed text-center">
                This geometric matrix with varied shapes, colors, and patterns provides an excellent test 
                for the terminal's glass effect. Each element should contribute to a complex, colorful 
                background that tests the terminal's ability to maintain readability while showcasing 
                the beautiful blur and transparency effects.
              </p>
            </div>
          </div>

          {/* Holographic Cards */}
          <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'}} className="p-12 rounded-lg">
            <h3 className="text-6xl font-bold text-white mb-12 text-center" style={{textShadow: '4px 4px 8px rgba(0,0,0,0.6)'}}>
              ✨ HOLOGRAPHIC SHOWCASE ✨
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'PRISMATIC DISPLAY',
                  bg: 'linear-gradient(45deg, #ff0099, #493240, #ff0099, #493240)',
                  content: 'Shifting hues create mesmerizing patterns that test terminal transparency with complex color interactions.'
                },
                {
                  title: 'AURORA EFFECT',
                  bg: 'linear-gradient(90deg, #00c9ff, #92fe9d, #00c9ff, #92fe9d)',
                  content: 'Natural aurora-like gradients provide organic color flow for testing glass overlay effects.'
                },
                {
                  title: 'CRYSTAL MATRIX',
                  bg: 'linear-gradient(60deg, #667eea, #764ba2, #667eea, #764ba2)',
                  content: 'Crystalline patterns with sharp color transitions challenge terminal readability systems.'
                },
                {
                  title: 'PLASMA FIELD',
                  bg: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #ff6b6b, #4ecdc4)',
                  content: 'High-energy plasma-like colors create intense backgrounds for transparency testing.'
                },
                {
                  title: 'SPECTRUM WAVE',
                  bg: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb, #667eea)',
                  content: 'Full spectrum waves demonstrate how the terminal handles rapid color changes.'
                },
                {
                  title: 'COSMIC PORTAL',
                  bg: 'radial-gradient(circle, #667eea, #764ba2, #f093fb, #667eea)',
                  content: 'Radial gradients simulate portal effects for comprehensive transparency evaluation.'
                }
              ].map((card, i) => (
                <div key={i} style={{background: card.bg}} 
                     className="p-8 rounded-2xl transform hover:scale-105 transition-all duration-500 shadow-2xl">
                  <div className="bg-white bg-opacity-10 p-6 rounded-xl backdrop-blur-sm">
                    <h4 className="text-2xl font-bold text-white mb-4 text-center" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                      {card.title}
                    </h4>
                    <p className="text-white leading-relaxed text-center" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>
                      {card.content}
                    </p>
                    <div className="mt-4 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">Glass Test Strip</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Mega Section */}
          <div className="p-16 rounded-lg" 
               style={{background: 'conic-gradient(from 0deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #fd79a8, #6c5ce7, #667eea, #764ba2, #f093fb, #ff6b6b)'}}>
            <h2 className="text-7xl font-bold text-white mb-16 text-center" style={{textShadow: '5px 5px 10px rgba(0,0,0,0.8)'}}>
              🎆 ULTIMATE TRANSPARENCY CHALLENGE 🎆
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 p-8 rounded-xl">
                  <h4 className="text-3xl font-bold text-white mb-4">Fire Gradient Test</h4>
                  <p className="text-white text-lg">Intense warm colors create high-contrast backgrounds perfect for testing terminal glass effects.</p>
                </div>
                <div className="bg-gradient-to-l from-blue-500 via-purple-500 to-teal-500 p-8 rounded-xl">
                  <h4 className="text-3xl font-bold text-white mb-4">Ocean Gradient Test</h4>
                  <p className="text-white text-lg">Cool color transitions provide contrast to warm sections for comprehensive testing.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-8 rounded-xl">
                  <h4 className="text-3xl font-bold text-white mb-4">Nature Spectrum</h4>
                  <p className="text-white text-lg">Natural color progressions test how terminal transparency handles organic color flows.</p>
                </div>
                <div className="bg-gradient-to-tl from-pink-400 via-red-500 to-yellow-500 p-8 rounded-xl">
                  <h4 className="text-3xl font-bold text-white mb-4">Sunset Spectrum</h4>
                  <p className="text-white text-lg">Sunset-inspired gradients provide warm, inviting backgrounds for glass effect evaluation.</p>
                </div>
              </div>
            </div>

            <div className="bg-black bg-opacity-40 p-12 rounded-2xl backdrop-blur-md">
              <h3 className="text-5xl font-bold text-white mb-8 text-center" style={{textShadow: '3px 3px 6px rgba(0,0,0,0.9)'}}>
                COMPREHENSIVE GLASS TESTING COMPLETE
              </h3>
              <p className="text-2xl text-white leading-relaxed text-center mb-8" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                This extensive demo section features multiple gradient types, color combinations, geometric patterns, 
                and visual effects designed to thoroughly test the terminal's glassmorphism capabilities. 
                Every element contributes to creating complex, colorful backgrounds that challenge the 
                terminal's transparency system while maintaining beautiful visual aesthetics.
              </p>
              <div className="text-center">
                <div className="inline-block bg-white bg-opacity-20 px-8 py-4 rounded-full backdrop-blur-sm">
                  <span className="text-white font-bold text-xl">🌈 Terminal Glass Effect Testing Zone 🌈</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;