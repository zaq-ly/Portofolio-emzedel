import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

import Gallery from './pages/Gallery';
import ITProjects from './pages/ITProjects';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Komponen pembantu untuk menangani scroll ke ID saat hash berubah
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const isCrossPage = prevPathname.current !== pathname;
    const scrollBehavior = isCrossPage ? 'auto' : 'smooth';

    // Override global CSS scroll behavior temporarily if cross-page
    if (isCrossPage) {
      document.documentElement.style.scrollBehavior = 'auto';
    }

    if (hash) {
      const id = hash.replace('#', '');
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: scrollBehavior });
          // Hapus hash secara diam-diam agar saat di-refresh, halaman kembali ke atas
          window.history.replaceState(null, '', pathname);
        }
      };
      
      // Scroll immediately, then again after a short delay to account for image loading
      scrollToElement();
      setTimeout(scrollToElement, 150);
      setTimeout(scrollToElement, 500);
    } else if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    }
    
    prevPathname.current = pathname;

    // Reset back to CSS default after all scrolls are done
    if (isCrossPage) {
      const timer = setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToHash />
      <div className="min-h-screen bg-surface text-text-primary transition-colors duration-300">
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={
            <>
              <Navbar />
              <main>
                <div id="home"><Hero /></div>
                <div id="about"><About /></div>
                <div id="skills"><Skills /></div>
                <div id="projects"><Projects /></div>
                <div id="experience"><Experience /></div>
                <div id="contact"><Contact /></div>
              </main>
              <Footer />
            </>
          } />

          {/* Gallery Route */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/it-projects" element={<ITProjects />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
