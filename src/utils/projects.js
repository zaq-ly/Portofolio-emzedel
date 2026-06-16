export const transformProject = (p) => ({
  ...p,
  category: p.category === 'print' ? 'poster' : p.category,
  tags: Array.isArray(p.tags)
    ? p.tags.map((t) => {
        const lowerT = t.toLowerCase();
        if (lowerT === 'print' || lowerT === 'poster & banner') {
          return p.category === 'banner' ? 'Banner' : 'Poster';
        }
        return t;
      })
    : p.tags,
});

export const transformProjectForGallery = (p) => ({
  ...transformProject(p),
  image: p.image_url,
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
