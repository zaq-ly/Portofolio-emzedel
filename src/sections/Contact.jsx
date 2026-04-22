import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Contact Me</h3>
          <h2 className="text-3xl md:text-5xl font-bold text-dark dark:text-white mb-6">Get In Touch</h2>
          <p className="text-secondary dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Have a project in mind or just want to say hi? Feel free to reach out. I'm always open to new opportunities and collaborations.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info */}
          <div className="lg:w-1/3 space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-dark dark:text-white mb-1">Email</h4>
                <p className="text-secondary dark:text-gray-400">zaqly@example.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-dark dark:text-white mb-1">Phone</h4>
                <p className="text-secondary dark:text-gray-400">+62 812 3456 7890</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-dark dark:text-white mb-1">Location</h4>
                <p className="text-secondary dark:text-gray-400">Gorontalo, Indonesia</p>
              </div>
            </div>
            
            <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="text-xl font-bold text-dark dark:text-white mb-4">Working Hours</h4>
              <p className="text-secondary dark:text-gray-400 text-sm">Monday - Friday: 9am - 5pm</p>
              <p className="text-secondary dark:text-gray-400 text-sm">Saturday - Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3 bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-dark dark:text-gray-300">Your Name</label>
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary outline-none rounded-xl transition-all dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-dark dark:text-gray-300">Your Email</label>
                  <input
                    type="email"
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary outline-none rounded-xl transition-all dark:text-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-dark dark:text-gray-300">Subject</label>
                <input
                  type="text"
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary outline-none rounded-xl transition-all dark:text-white"
                  placeholder="How can I help you?"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-dark dark:text-gray-300">Message</label>
                <textarea
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary outline-none rounded-xl transition-all dark:text-white h-40 resize-none"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto bg-primary hover:bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
