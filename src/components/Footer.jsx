import React from 'react';
import { Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-secondary py-8 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-center text-center">
          <p className="text-text-tertiary text-xs">
            <a href="/admin" className="cursor-default" title="">&copy;</a> {new Date().getFullYear()} EMZEDEL. Hak cipta dilindungi undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
