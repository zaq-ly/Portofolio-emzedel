import React from 'react';

const About = () => {
  const skills = [
    'React JS', 'Node.js', 'Tailwind CSS', 'JavaScript (ES6+)',
    'TypeScript', 'Next.js', 'MongoDB', 'Git & GitHub',
    'PostgreSQL', 'REST APIs', 'UI/UX Design', 'Vite'
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">About Me</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-dark dark:text-white mb-6">
              I am a creative developer based in Indonesia
            </h2>
            <p className="text-secondary dark:text-gray-400 text-lg mb-6 leading-relaxed">
              With over 2 years of experience in web development, I enjoy turning complex problems into simple, beautiful, and intuitive designs. My goal is to build high-performance applications that provide the best user experience.
            </p>
            <p className="text-secondary dark:text-gray-400 text-lg mb-8 leading-relaxed">
              I am constantly learning new technologies and improving my skills to stay up-to-date with the latest industry standards.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <h4 className="text-2xl font-bold text-primary mb-1">2+</h4>
                <p className="text-sm text-secondary dark:text-gray-500">Years Experience</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <h4 className="text-2xl font-bold text-primary mb-1">15+</h4>
                <p className="text-sm text-secondary dark:text-gray-500">Projects Completed</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-dark dark:text-white font-bold text-xl mb-6">My Technical Skills</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-5 py-2 bg-white dark:bg-gray-800 text-dark dark:text-gray-300 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:text-primary dark:hover:text-primary transition-all cursor-default border border-gray-100 dark:border-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-purple-600/5 rounded-3xl border border-primary/10">
              <h4 className="text-dark dark:text-white font-bold mb-4 italic">"Code is like humor. When you have to explain it, it’s bad."</h4>
              <p className="text-secondary dark:text-gray-500 text-sm">— Cory House</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
