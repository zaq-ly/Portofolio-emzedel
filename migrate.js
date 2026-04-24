import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { projects } from './src/data/projects.js';

// Load .env manually
const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    // remove quotes if any
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    envVars[match[1].trim()] = val;
  }
});

const supabaseUrl = envVars['VITE_SUPABASE_URL'];
const supabaseKey = envVars['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log(`Starting migration of ${projects.length} projects...`);
  
  for (const p of projects) {
    // Check if it already exists (by title and image_url) to avoid duplicates if run multiple times
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('title', p.title)
      .eq('image_url', p.image)
      .single();
      
    if (existing) {
      console.log(`Skipping existing: ${p.title}`);
      continue;
    }

    const { error } = await supabase
      .from('projects')
      .insert([{
        title: p.title,
        category: p.category,
        description: p.description || '',
        image_url: p.image,
        tags: p.tags
      }]);

    if (error) {
      console.error(`Error inserting ${p.title}:`, error.message);
    } else {
      console.log(`Inserted: ${p.title}`);
    }
  }
  
  console.log('Migration complete!');
}

migrate();
