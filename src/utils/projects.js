export const transformProject = (p) => ({
  ...p,
  // Normalize snake_case from Supabase to camelCase
  imageUrl: p.image_url || p.image || '',
  image: p.image_url || p.image || '',
  techStack: p.tech_stack || p.techStack || [],
  liveUrl: p.live_url || p.liveUrl || '',
  githubUrl: p.github_url || p.githubUrl || '',
  isFeatured: p.is_featured || p.isFeatured || false,
  category: p.category === 'print' ? 'poster' : p.category,
  tags: Array.isArray(p.tags)
    ? p.tags.map((t) => {
        const lowerT = t.toLowerCase();
        if (lowerT === 'print' || lowerT === 'poster & banner') {
          return p.category === 'banner' ? 'Banner' : 'Poster';
        }
        return t;
      })
    : [],
});

export const transformProjectForGallery = (p) => ({
  ...transformProject(p),
  image: p.image_url || p.image || '',
});
