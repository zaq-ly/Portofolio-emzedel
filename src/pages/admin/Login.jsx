import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate('/zaqlyneroth/dashboard');
        }
      });
    } else if (localStorage.getItem('admin_auth') === 'true') {
      navigate('/zaqlyneroth/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        // Fallback untuk development lokal tanpa Supabase credentials
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
        if (password === adminPassword) {
          localStorage.setItem('admin_auth', 'true');
          navigate('/zaqlyneroth/dashboard');
          return;
        } else {
          throw new Error('Password salah (mode offline).');
        }
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Email atau password salah.');
        }
        throw authError;
      }

      if (data?.session) {
        localStorage.removeItem('admin_auth');
        navigate('/zaqlyneroth/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-[#1d1d1f]">MZL</h1>
          <p className="text-[#86868b] text-sm mt-2">Admin Dashboard Authentication</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_24px_rgba(0,0,0,0.06)] border border-[#d2d2d7]/40">
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-1 tracking-tight">Selamat Datang</h2>
          <p className="text-[#86868b] text-sm mb-8">Masuk dengan akun admin Supabase Anda.</p>

          {error && (
            <div className="bg-red-50 border border-red-200/60 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 font-medium animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder:text-[#86868b]"
                  placeholder="admin@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder:text-[#86868b]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <LogIn size={18} />
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-[#0071e3] text-sm font-medium hover:underline transition-all"
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
