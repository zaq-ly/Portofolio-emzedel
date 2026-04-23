import React from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';


const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState({ type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // ... (submission logic)
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            full_name: formData.name, 
            email: formData.email, 
            subject: formData.subject, 
            message: formData.message 
          }
        ]);

      if (error) throw error;

      setStatus({ type: 'success', message: 'Pesan Anda berhasil dikirim! Saya akan segera menghubungi Anda.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus({ type: 'error', message: 'Gagal mengirim pesan. Silakan coba lagi nanti.' });
    } finally {
      setLoading(false);
    }
  };

  // Auto-dismiss alert setelah 5 detik
  React.useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  return (
    <section id="contact" className="relative py-20 md:py-28 bg-white dark:bg-dark-card/50 transition-colors overflow-hidden">
      {/* ... (background decor) ... */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] dark:bg-[radial-gradient(#1e1e2e_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">
            Hubungi Saya
          </h3>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-dark dark:text-white mb-6">
            Mari Berkolaborasi
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Punya proyek menarik atau sekadar ingin menyapa? Saya selalu terbuka untuk peluang baru dan kolaborasi kreatif.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left — Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/3 space-y-8"
          >
            {[
              { icon: <Mail size={24} />, title: 'Email', detail: 'muhammadzaqly01@gmail.com' },
              { icon: <Phone size={24} />, title: 'Telepon', detail: '081342445280' },
              { icon: <MapPin size={24} />, title: 'Lokasi', detail: 'Makassar, Sulawesi Selatan' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-primary/10 p-4 rounded-2xl text-primary flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-dark dark:text-white mb-1">{item.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400">{item.detail}</p>
                </div>
              </motion.div>
            ))}

            {/* Available Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="p-8 bg-gray-50 dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-dark-border"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h4 className="text-xl font-bold text-dark dark:text-white">Tersedia untuk Freelance</h4>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Saya sedang menerima proyek desain baru dan kolaborasi kreatif.
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-2/3 bg-gray-50 dark:bg-dark-card p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-dark-border"
          >
            {status.message && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {status.message}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Nama Anda</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl transition-all duration-300 text-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    placeholder="Nama Lengkap"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Email Anda</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl transition-all duration-300 text-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Subjek</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl transition-all duration-300 text-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600"
                  placeholder="Apa yang bisa saya bantu?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Pesan</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-white dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl transition-all duration-300 text-dark dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 h-40 resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-primary hover:bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-primary/30 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Pesan</span>
                    <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
