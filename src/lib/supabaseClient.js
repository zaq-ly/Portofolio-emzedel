import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cek apakah Supabase config tersedia
const isConfigValid = supabaseUrl && supabaseKey;

let supabase = null;

if (isConfigValid) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn(
    '[Supabase] Config tidak ditemukan di .env — aplikasi mungkin berjalan dalam mode offline (data statis).',
    'Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY sudah diisi di file .env'
  );
}

export { supabase };
