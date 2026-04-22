import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with real-time inventory management and secure payment gateway.',
      tags: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
      image: 'https://via.placeholder.com/600x400',
      demo: '#',
      repo: '#'
    },
    {
      title: 'Task Management App',
      description: 'A collaborative task management tool with drag-and-drop functionality and team workspaces.',
      tags: ['React', 'Firebase', 'Tailwind'],
      image: 'https://via.placeholder.com/600x400',
      demo: '#',
      repo: '#'
    },
    {
      title: 'Weather Dashboard',
      description: 'A sleek weather application using OpenWeather API with detailed forecasts and location search.',
      tags: ['React', 'REST API', 'Tailwind'],
      image: 'https://via.placeholder.com/600x400',
      demo: '#',
      repo: '#'
    }
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">My Portfolio</h3>
          <h2 className="text-3xl md:text-5xl font-bold text-dark dark:text-white mb-6">Recent Projects</h2>
          <p className="text-secondary dark:text-gray-400 max-w-2xl mx-auto text-lg">
            A selection of my recent works. Each project is built with a focus on performance, scalability, and user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <div key={index} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 flex flex-col h-full">
              <div className="relative overflow-hidden h-60">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="flex space-x-4">
                    <a href={project.demo} className="bg-white p-2 rounded-full text-dark hover:bg-primary hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                    <a href={project.repo} className="bg-white p-2 rounded-full text-dark hover:bg-primary hover:text-white transition-colors">
                      <Github size={20} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tIndex) => (
                    <span key={tIndex} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-gray-100 dark:bg-gray-700 text-secondary dark:text-gray-400 rounded-lg">
                      {tag}
                    </span>
                  ))}
                </div>
                <h4 className="text-xl font-bold text-dark dark:text-white mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h4>
                <p className="text-secondary dark:text-gray-400 text-sm leading-relaxed flex-grow">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a
            href="https://github.com/zaq-ly"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary font-bold hover:underline"
          >
            <span>View all projects on GitHub</span>
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

// Internal import for ArrowRight since it was used in the footer but not here
import { ArrowRight } from 'lucide-react';

export default Projects;
