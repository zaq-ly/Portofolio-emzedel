/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A',
        accent: '#2563EB',
        'accent-hover': '#1D4ED8',
        'accent-light': '#DBEAFE',
        surface: '#FFFFFF',
        'surface-secondary': '#F8F9FA',
        'surface-tertiary': '#F1F3F5',
        border: '#E5E7EB',
        'border-hover': '#D1D5DB',
        'text-primary': '#0A0A0A',
        'text-secondary': '#4B5563',
        'text-tertiary': '#9CA3AF',
        'dark-surface': '#111111',
        'dark-card': '#1A1A1A',
        'dark-border': '#2A2A2A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 40px -12px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(37, 99, 235, 0.15)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'marquee': 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
