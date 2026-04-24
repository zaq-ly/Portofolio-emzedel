import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    envVars[match[1].trim()] = val;
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCategory() {
  console.log("Updating category 'print' to 'poster' in the database...");
  
  const { data, error } = await supabase
    .from('projects')
    .update({ category: 'poster' })
    .eq('category', 'print')
    .select();

  if (error) {
    console.error("Error updating database:", error.message);
  } else {
    console.log(`Successfully updated ${data.length} records.`);
  }
}

updateCategory();
