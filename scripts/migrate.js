import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// Import static data
import { projects as staticProjects } from '../src/data/projects.js';

async function migrate() {
  console.log(`Starting migration for ${staticProjects.length} projects...`);
  
  // Sort projects so the newest (highest ID) is inserted last or first? 
  // Let's just insert them in order, or better, we let the database handle ID and created_at.
  // The database will assign new IDs. We want them in the same order as before, so we iterate from oldest to newest.
  // Actually, in the static data, id 1 is the oldest? Wait, ID 1 is "GOCC", ID 74 is "Brosur wisata". 
  // If we insert them sequentially from 1 to 74, created_at will be sequential, which is good.
  
  let successCount = 0;
  let errorCount = 0;

  for (const project of staticProjects) {
    try {
      console.log(`Processing project ${project.id}: ${project.title}`);
      
      let publicUrl = project.image || project.image_url;
      
      // Upload image if it's a local path
      if (publicUrl && publicUrl.startsWith('/gallery/')) {
        const filePath = path.join(publicDir, publicUrl);
        
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const fileName = `${Date.now()}_${path.basename(filePath).replace(/\s+/g, '_')}`;
          
          console.log(`  Uploading image: ${fileName}`);
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('project-images')
            .upload(fileName, fileBuffer, {
              contentType: 'image/jpeg', // approximate, can be png but it's fine for supabase to guess
              cacheControl: '3600',
              upsert: false,
            });
            
          if (uploadError) {
            throw uploadError;
          }
          
          const { data: urlData } = supabase.storage
            .from('project-images')
            .getPublicUrl(uploadData.path);
            
          publicUrl = urlData.publicUrl;
          console.log(`  Image uploaded successfully.`);
        } else {
          console.warn(`  Warning: File not found locally - ${filePath}`);
        }
      }
      
      // Insert into database
      const projectData = {
        title: project.title,
        category: project.category === 'print' ? 'poster' : project.category, // Handle legacy category
        description: project.description || '',
        tags: Array.isArray(project.tags) ? project.tags : [],
        image_url: publicUrl,
      };

      if (project.category === 'frontend' || project.category === 'uiux') {
        projectData.tech_stack = project.techStack || [];
        projectData.live_url = project.liveUrl || '';
        projectData.github_url = project.githubUrl || '';
      }
      
      const { error: insertError } = await supabase
        .from('projects')
        .insert([projectData]);
        
      if (insertError) {
        throw insertError;
      }
      
      console.log(`  ✅ Successfully migrated.`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Failed to migrate project ${project.id}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\nMigration completed.`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
}

migrate();
