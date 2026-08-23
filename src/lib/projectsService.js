import { supabase } from './supabaseClient';
import { transformProject } from '../utils/projects';
import { projects as staticProjects } from '../data/projects';

// ===== FETCH =====
export const fetchProjects = async () => {
  if (!supabase) {
    // Fallback ke data statis jika Supabase tidak tersedia
    return staticProjects.map(p => transformProject({
      ...p,
      image_url: p.image || p.image_url,
      created_at: new Date().toISOString(),
    }));
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// ===== REALTIME SUBSCRIBE =====
export const subscribeProjects = (onData, onError) => {
  // Initial fetch
  fetchProjects().then(onData).catch(onError);

  if (!supabase) return () => {};

  // Realtime subscription
  const channel = supabase
    .channel('projects-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
      fetchProjects().then(onData).catch(onError);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ===== UPLOAD IMAGE =====
export const uploadProjectImage = async (file) => {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const extMatch = file.name?.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const baseName = (file.name || 'image').replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${baseName}.${ext}`;

  const { data, error } = await supabase
    .storage
    .from('project-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data: urlData } = supabase
    .storage
    .from('project-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

// ===== CREATE =====
export const createProject = async ({ title, category, description, tags, image_url, type, techStack, liveUrl, githubUrl, isFeatured }) => {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const projectData = {
    title,
    category,
    description: description || '',
    tags: Array.isArray(tags) ? tags : [],
    image_url,
    is_featured: !!isFeatured,
  };

  if (category === 'frontend' || category === 'uiux') {
    projectData.tech_stack = Array.isArray(techStack) ? techStack : [];
    projectData.live_url = liveUrl || '';
    projectData.github_url = githubUrl || '';
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ===== UPDATE =====
export const updateProject = async (id, { title, category, description, tags, techStack, liveUrl, githubUrl, isFeatured, image_url }) => {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const updateData = {
    title,
    category,
    description: description || '',
    tags: Array.isArray(tags) ? tags : [],
    is_featured: !!isFeatured,
  };

  if (image_url) {
    updateData.image_url = image_url;
  }

  if (category === 'frontend' || category === 'uiux') {
    updateData.tech_stack = Array.isArray(techStack) ? techStack : [];
    updateData.live_url = liveUrl || '';
    updateData.github_url = githubUrl || '';
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ===== DELETE =====
export const deleteProject = async (id) => {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// ===== UPDATE FEATURED ORDER (USING CREATED_AT) =====
export const updateFeaturedOrder = async (updates) => {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  
  const promises = updates.map(update => 
    supabase
      .from('projects')
      .update({ created_at: update.created_at })
      .eq('id', update.id)
  );
  
  const results = await Promise.all(promises);
  
  for (const res of results) {
    if (res.error) {
      console.error("Supabase Error:", res.error);
      throw new Error(`Gagal menyimpan urutan: ${res.error.message}`);
    }
  }
};
