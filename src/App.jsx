import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Gallery from './sections/Gallery';
import Contact from './sections/Contact';

function App() {
  return (
    <div className="min-h-screen bg-dark text-light">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
