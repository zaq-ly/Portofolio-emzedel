import React from 'react';
import { Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-4 border-black pt-12 overflow-hidden">
      {/* Marquee */}
      <div className="w-full overflow-hidden border-y-4 border-white bg-primary py-3 mb-12 flex whitespace-nowrap">
        <div className="animate-marquee flex gap-12 font-black uppercase text-xl md:text-2xl tracking-[0.2em]">
          <span>CREATIVE DESIGN</span>
          <span>•</span>
          <span>DIGITAL ILLUSTRATION</span>
          <span>•</span>
          <span>UI/UX</span>
          <span>•</span>
          <span>BRAND IDENTITY</span>
          <span>•</span>
          <span>CREATIVE DESIGN</span>
          <span>•</span>
          <span>DIGITAL ILLUSTRATION</span>
          <span>•</span>
          <span>UI/UX</span>
          <span>•</span>
          <span>BRAND IDENTITY</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        <div className="text-center">
          <a href="#/" className="font-display text-3xl font-black bg-secondary text-black px-6 py-3 border-4 border-white inline-block shadow-[8px_8px_0px_0px_white] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[12px_12px_0px_0px_white] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all duration-200">
            Muhammad Zaqly Luluang
          </a>
          <p className="text-white mt-8 text-xl font-black uppercase tracking-wider">
            Mengubah ide menjadi karya seni.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 pt-8 border-t-4 border-white text-center relative pb-8">
        <p className="text-sm font-black uppercase tracking-wider">
          &copy; {new Date().getFullYear()} Muhammad Zaqly Luluang. Hak Cipta Dilindungi.
        </p>

        {/* Pintu Rahasia Super Tersembunyi */}
        <a
          href="#/admin"
          className="absolute right-4 bottom-0 opacity-0 hover:opacity-100 transition-all duration-200 text-xs font-black uppercase tracking-[0.3em] py-2 bg-secondary text-black px-3 border-4 border-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_white]"
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
