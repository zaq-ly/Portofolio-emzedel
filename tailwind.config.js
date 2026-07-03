/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: '#FF3366',
        secondary: '#FFD23F',
        accent: '#3B82F6',
        dark: '#000000',
        light: '#FFFFFF',
        'light-gray': '#F5F5F5',
        'dark-card': '#1A1A1A',
        'dark-border': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      boxShadow: {
        'brutal': '8px 8px 0px 0px #000000',
        'brutal-sm': '4px 4px 0px 0px #000000',
        'brutal-lg': '12px 12px 0px 0px #000000',
      },
    },
  },
  plugins: [],
};
