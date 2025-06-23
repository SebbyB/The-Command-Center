import React from 'react';

const Skills: React.FC = () => {
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
};

export default Skills;