import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 bg-component min-h-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            About Me
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            I'm a passionate developer with expertise in modern web technologies
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="component-card p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-2xl mr-3">📖</span>
              My Story
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                With over X years of experience in web development, I specialize in creating 
                beautiful, functional, and user-friendly applications. I love solving complex 
                problems and turning ideas into reality.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, contributing 
                to open source projects, or enjoying the outdoors.
              </p>
              <div className="mt-6 text-sm text-gray-500 bg-gray-50 p-3 rounded">
                <span className="font-medium">Last updated:</span>
                <span className="ml-2">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="component-card p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-2xl mr-3">🛠️</span>
              Tech Stack
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Next.js'].map((skill) => (
                    <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'Python', 'Express', 'PostgreSQL'].map((skill) => (
                    <span key={skill} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'Docker', 'AWS', 'Figma'].map((skill) => (
                    <span key={skill} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;