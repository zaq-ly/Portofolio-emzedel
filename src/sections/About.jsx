import React from 'react';

const About = () => {
  const skills = [
    'Adobe Illustrator', 'Figma', 'Affinity', 'Inkscape',
    'Brand Identity', 'Digital Illustration', 'Layout Design',
    'UI/UX Design', 'Photo Editing',
  ];

  return (
    <section id="about" className="relative py-24 md:py-32 px-4 sm:px-6 bg-light-gray">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          {/* Left — Bio */}
          <div className="lg:w-1/2">
            <h3 className="bg-accent text-white inline-block px-6 py-3 font-black text-sm uppercase tracking-[0.2em] mb-6 border-4 border-black shadow-brutal">
              Tentang Saya
            </h3>
            <h2 className="text-3xl md:text-5xl font-black text-black mb-8">
              Seorang Manusia Biasa Yang Suka Design & Ngegambar
            </h2>
            <div className="bg-white border-4 border-black p-8 shadow-brutal">
              <p className="text-lg text-black leading-relaxed font-bold">
                Halo! Saya seseorang yang punya passion di dunia design dan ilustrasi. Berawal dari hobi yang nggak disengaja, lama-lama jadi cinta beneran.
                Proses kreatif buat saya itu menyenangkan. Menurut saya ide yang nggak dibuat itu sayang banget. Masih terus belajar, masih terus eksplorasi, dan nggak ada rencana buat berhenti!
              </p>
            </div>
          </div>

          {/* Right — Skills */}
          <div className="lg:w-1/2">
            <h3 className="text-black font-black text-3xl mb-8">
              <span className="bg-secondary inline-block px-6 py-3 border-4 border-black shadow-brutal">
                Keahlian Desain Saya
              </span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-white border-4 border-black px-6 py-4 font-black text-sm uppercase tracking-wider shadow-brutal-sm hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Quote */}
            <div className="mt-12 bg-primary text-white border-4 border-black p-8 shadow-brutal">
              <h4 className="font-black text-xl md:text-2xl leading-relaxed mb-3 italic">
                "Kreativitas adalah kecerdasan yang sedang bersenang-senang."
              </h4>
              <p className="font-black text-sm uppercase tracking-wider">
                — Albert Einstein
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
