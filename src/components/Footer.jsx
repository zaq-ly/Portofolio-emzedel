import React from 'react';
import { Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-secondary py-8 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="flex items-center justify-between">
          <p className="text-text-tertiary text-xs">
            &copy; {new Date().getFullYear()} Muhammad Zaqly Luluang. Hak cipta dilindungi undang-undang.
          </p>

          <a
            href="/admin"
            className="text-text-tertiary hover:text-text-primary transition-colors"
            title="Admin Login"
          >
            <Lock size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
