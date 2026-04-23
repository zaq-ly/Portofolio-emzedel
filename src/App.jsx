import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Gallery from './sections/Gallery';
import Contact from './sections/Contact';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Komponen pembantu untuk menangani scroll ke ID saat hash berubah
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

function App() {
  return (
    <Router>
      <ScrollToHash />
      <div className="min-h-screen bg-white text-gray-900 dark:bg-dark dark:text-light transition-colors duration-300">
        <Routes>
          {/* Main Portfolio Route */}
          <Route path="/" element={
            <>
              <Navbar />
              <main>
                <div id="home"><Hero /></div>
                <div id="about"><About /></div>
                <div id="gallery"><Gallery /></div>
                <div id="contact"><Contact /></div>
              </main>
              <Footer />
            </>
          } />




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
