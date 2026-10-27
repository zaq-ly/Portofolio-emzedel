import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            if (isMounted) setAuthenticated(true);
          } else {
            if (isMounted) {
              setAuthenticated(false);
              navigate('/zaqlyneroth');
            }
          }
        } catch {
          if (isMounted) {
            setAuthenticated(false);
            navigate('/zaqlyneroth');
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      } else {
        // Fallback jika mode offline / tanpa Supabase credentials
        const isAuth = localStorage.getItem('admin_auth') === 'true';
        if (isAuth) {
          if (isMounted) setAuthenticated(true);
        } else {
          if (isMounted) {
            setAuthenticated(false);
            navigate('/zaqlyneroth');
          }
        }
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();

    let subscription = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        if (session) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate('/zaqlyneroth');
        }
      });
      subscription = data.subscription;
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#0071e3]" size={36} />
      </div>
    );
  }

  return authenticated ? children : null;
};

export default ProtectedRoute;
