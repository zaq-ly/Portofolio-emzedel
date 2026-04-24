import React from 'react';
import { Linkedin, Instagram, Mail, Lock } from 'lucide-react';

const Footer = () => {

  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-100 dark:border-dark-border py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        <div className="text-center">
          <a href="#/" className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Muhammad Zaqly Luluang
          </a>
          <p className="text-gray-500 mt-2 text-sm">
            Mengubah ide menjadi karya seni.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-8 border-t border-gray-100 dark:border-dark-border text-center relative">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Muhammad Zaqly Luluang. Hak Cipta Dilindungi.</p>

        {/* Pintu Rahasia Super Tersembunyi */}
        <a
          href="#/admin"
          className="absolute right-4 bottom-0 opacity-[0.05] hover:opacity-100 text-gray-400 hover:text-primary transition-all duration-700 text-[8px] uppercase tracking-[0.3em] font-bold py-2"
          title="Admin Access"
        >
          <Lock size={8} className="inline mr-1" />
          EMZEDEL
        </a>
      </div>
    </footer>
  );
};



export default Footer;
