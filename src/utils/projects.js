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

export const parseProjectImages = (imageString) => {
  if (!imageString || typeof imageString !== 'string') return [];

  return imageString
    .split(',')
    .map((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed) return null;

      const pipeIndex = trimmed.lastIndexOf('|');
      let label = '';
      let url = trimmed;
      if (pipeIndex !== -1) {
        label = trimmed.slice(0, pipeIndex).trim();
        url = trimmed.slice(pipeIndex + 1).trim();
      }

      // Pastikan url adalah URL atau path gambar yang valid (bukan serpihan teks)
      const isUrl =
        url.startsWith('http://') ||
        url.startsWith('https://') ||
        url.startsWith('/') ||
        url.startsWith('blob:') ||
        url.startsWith('data:');

      if (!isUrl) return null;

      return { label, url };
    })
    .filter(Boolean);
};

export const getFirstProjectImage = (imageString) => {
  const parsed = parseProjectImages(imageString);
  return parsed.length > 0 ? parsed[0].url : '';
};

