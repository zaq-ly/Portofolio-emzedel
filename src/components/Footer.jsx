import React from 'react';
import { Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-4 border-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        <div className="text-center">
          <a href="#/" className="font-display text-3xl font-black bg-secondary text-black px-6 py-3 border-4 border-white inline-block hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_white] transition-all duration-200">
            Muhammad Zaqly Luluang
          </a>
          <p className="text-white mt-6 text-lg font-black">
            Mengubah ide menjadi karya seni.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 pt-8 border-t-4 border-white text-center relative">
        <p className="text-lg font-black">
          &copy; {new Date().getFullYear()} Muhammad Zaqly Luluang. Hak Cipta Dilindungi.
        </p>

        {/* Pintu Rahasia Super Tersembunyi */}
        <a
          href="#/admin"
          className="absolute right-4 bottom-0 hover:opacity-100 transition-all duration-200 text-xs font-black uppercase tracking-[0.3em] py-2 bg-secondary text-black px-3 border-4 border-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_white]"
          title="Admin Access"
        >
          <Lock size={12} className="inline mr-1" />
          EMZEDEL
        </a>
      </div>
    </footer>
  );
};

export default Footer;
