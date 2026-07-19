import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('projects').select('id, title, is_featured').eq('is_featured', true);
  if (error) {
    console.error("Error fetching:", error.message);
  } else {
    console.log("Featured projects:", data);
  }
}
check();
