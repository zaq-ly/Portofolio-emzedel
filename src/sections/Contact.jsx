import React from 'react';
import { Mail, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <section id="contact" className="relative py-20 md:py-28 bg-white dark:bg-dark-card/50 transition-colors overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] dark:bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h3 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">
            KONTAK
          </h3>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-dark dark:text-white mb-6">
            Ayo Ngobrol!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Pintu selalu terbuka buat siapa saja yang mau diskusi soal proses kreatif, sharing karya, atau sekadar nambah teman baru.
          </p>
        </motion.div>

        {/* Contact Info */}
        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          {[
            { icon: <Mail size={32} />, title: 'Email', detail: 'muhammadzaqly01@gmail.com', link: 'mailto:muhammadzaqly01@gmail.com' },
            { icon: <Linkedin size={32} />, title: 'LinkedIn', detail: 'Muhammad Zaqly Luluang', link: 'https://www.linkedin.com/in/muhammad-zaqly-luluang-468a61327/' },
            { icon: <Instagram size={32} />, title: 'Instagram', detail: '@zqlyy_', link: 'https://www.instagram.com/zqlyy_/' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex-1 w-full"
            >
              <div className="bg-primary/10 p-5 rounded-full text-primary mb-6 inline-flex shadow-inner">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-dark dark:text-white mb-3">{item.title}</h4>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-medium">
                  {item.detail}
                </a>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{item.detail}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
