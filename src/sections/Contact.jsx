import React from 'react';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden bg-light-gray">
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Header */}
        <div className="mb-12">
          <h3 className="bg-secondary text-black inline-block px-6 py-3 font-black text-sm uppercase tracking-[0.2em] mb-6 border-4 border-black shadow-brutal">
            Kontak
          </h3>
          <h2 className="text-3xl md:text-5xl font-black text-black mb-6">
            Ayo Ngobrol!
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto font-bold">
            Pintu selalu terbuka buat siapa saja yang mau diskusi soal proses kreatif, sharing karya, atau sekadar nambah teman baru.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <Mail size={40} />,
              title: 'Email',
              detail: 'muhammadzaqly01@gmail.com',
              link: 'mailto:muhammadzaqly01@gmail.com',
              bg: 'bg-primary',
              color: 'text-white'
            },
            {
              icon: <Linkedin size={40} />,
              title: 'LinkedIn',
              detail: 'Muhammad Zaqly Luluang',
              link: 'https://www.linkedin.com/in/muhammad-zaqly-luluang-468a61327/',
              bg: 'bg-accent',
              color: 'text-white'
            },
            {
              icon: <Instagram size={40} />,
              title: 'Instagram',
              detail: '@zqlyy_',
              link: 'https://www.instagram.com/zqlyy_/',
              bg: 'bg-secondary',
              color: 'text-black'
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white border-4 border-black shadow-brutal hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-lg active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-200 flex-1 w-full"
            >
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="block p-8">
                <div className={`${item.bg} ${item.color} inline-flex p-4 border-4 border-black shadow-brutal-sm mb-6`}>
                  {item.icon}
                </div>
                <h4 className="text-2xl font-black text-black mb-3">{item.title}</h4>
                <p className="text-lg font-black text-black break-all">
                  {item.detail}
                </p>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
