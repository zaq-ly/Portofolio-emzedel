import React from 'react';
import { Mail, Linkedin, Instagram, Github, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  const contacts = [
    {
      icon: <Mail size={22} />,
      title: 'Email',
      detail: 'muhammadzaqly01@gmail.com',
      link: 'mailto:muhammadzaqly01@gmail.com',
      iconBg: 'bg-accent/10 text-accent',
    },
    {
      icon: <Github size={22} />,
      title: 'GitHub',
      detail: 'github.com/username',
      link: 'https://github.com/',
      iconBg: 'bg-text-primary/5 text-text-primary',
    },
    {
      icon: <Linkedin size={22} />,
      title: 'LinkedIn',
      detail: 'Muhammad Zaqly Luluang',
      link: 'https://www.linkedin.com/in/muhammad-zaqly-luluang-468a61327/',
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Instagram size={22} />,
      title: 'Instagram',
      detail: '@zqlyy_',
      link: 'https://www.instagram.com/zqlyy_/',
      iconBg: 'bg-pink-50 text-pink-600',
    },
  ];

  return (
    <section id="contact" className="section-padding bg-surface">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="section-label">Kontak</span>
          <h2 className="section-title mb-4">
            Mari <span className="text-accent">Berkolaborasi</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Tertarik untuk bekerja sama atau ingin diskusi tentang project? Jangan ragu untuk menghubungi saya.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map((item, index) => (
            <motion.a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card group p-5 flex items-center gap-4 hover:border-accent/20"
            >
              <div className={`p-3 rounded-xl ${item.iconBg} transition-transform duration-200 group-hover:scale-110`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-tertiary font-medium mb-0.5">{item.title}</p>
                <p className="text-sm font-medium text-text-primary truncate">{item.detail}</p>
              </div>
              <ArrowUpRight size={16} className="text-text-tertiary group-hover:text-accent transition-colors flex-shrink-0" />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-block p-6 md:p-8 rounded-2xl bg-surface-secondary border border-border">
            <p className="text-sm text-text-secondary mb-4">
              Lebih suka email langsung?
            </p>
            <a
              href="mailto:muhammadzaqly01@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white
                         font-medium text-sm rounded-xl hover:bg-primary/90
                         transition-all duration-200 shadow-soft"
            >
              <Mail size={16} />
              Kirim Email
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
