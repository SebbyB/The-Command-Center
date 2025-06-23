import React from 'react';

const Home: React.FC = () => {
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
};

export default Home;