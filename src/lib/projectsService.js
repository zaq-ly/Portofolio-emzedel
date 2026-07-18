import { transformProject } from '../utils/projects';
import { projects as staticProjects } from '../data/projects';

// Fungsi helper untuk mendapatkan kredensial GitHub dari .env
const getGitHubConfig = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const owner = import.meta.env.VITE_GITHUB_OWNER;
  const repo = import.meta.env.VITE_GITHUB_REPO;
  if (!token || !owner || !repo) {
    throw new Error('Konfigurasi GitHub di .env belum lengkap.');
  }
  return { token, owner, repo };
};

// State lokal agar UI langsung update tanpa refresh
let inMemoryProjects = [...staticProjects].sort((a, b) => b.id - a.id);

export const fetchProjects = async () => {
  return inMemoryProjects.map(p => transformProject({
    ...p,
    image_url: p.image || p.image_url,
    created_at: new Date().toISOString(),
  }));
};

// Hapus fungsi subscribeProjects karena kita pakai fetchProjects manual
export const subscribeProjects = (onData, onError) => {
  fetchProjects().then(onData).catch(onError);
  return () => {};
};

// Fungsi helper untuk menembak GitHub API
const fetchGitHubAPI = async (method, path, body = null) => {
  const { token, owner, repo } = getGitHubConfig();
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada GitHub API');
  }
  
  return data;
};

// 1. Upload Gambar ke GitHub
export const uploadProjectImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Content = reader.result.split(',')[1];
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `public/gallery/${fileName}`;
        
        await fetchGitHubAPI('PUT', filePath, {
          message: `Add image ${fileName} via Admin Dashboard`,
          content: base64Content
        });
        
        resolve(`/gallery/${fileName}`);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = error => reject(error);
  });
};

// 2. Simpan Data ke projects.js
const updateProjectsFile = async (newProjectsArray, commitMessage) => {
  const filePath = 'src/data/projects.js';
  
  // Ambil file saat ini untuk dapatkan SHA
  const currentFile = await fetchGitHubAPI('GET', filePath);
  
  // Buat konten baru
  const fileContent = `export const categories = [\n  { key: "all", label: "Semua" },\n  { key: "frontend", label: "Front-End" },\n  { key: "uiux", label: "UI/UX" },\n  { key: "illustration", label: "Ilustrasi" },\n  { key: "vector", label: "Vektor" },\n  { key: "branding", label: "Logo" },\n  { key: "poster-banner", label: "Poster & Banner" },\n];\n\nexport const projects = ${JSON.stringify(newProjectsArray, null, 2)};\n`;
  
  // Encode Base64 (mendukung Unicode)
  const base64Content = btoa(unescape(encodeURIComponent(fileContent)));
  
  // Simpan kembali
  await fetchGitHubAPI('PUT', filePath, {
    message: commitMessage,
    content: base64Content,
    sha: currentFile.sha
  });
};

export const createProject = async ({ title, category, description, tags, image_url, type, techStack, liveUrl, githubUrl }) => {
  // Tambah ke in-memory agar UI langsung update
  const newId = inMemoryProjects.length > 0 ? Math.max(...inMemoryProjects.map(p => p.id)) + 1 : 1;
  const newProject = {
    id: newId,
    title,
    category,
    description,
    image: image_url,
    tags: Array.isArray(tags) ? tags : []
  };

  // Tambah field khusus dev project
  if (type) newProject.type = type;
  if (techStack && techStack.length > 0) newProject.techStack = techStack;
  if (liveUrl) newProject.liveUrl = liveUrl;
  if (githubUrl) newProject.githubUrl = githubUrl;
  
  inMemoryProjects = [newProject, ...inMemoryProjects];
  
  // Update file di GitHub
  await updateProjectsFile(
    [...staticProjects, newProject], 
    `Add project: ${title} via Admin Dashboard`
  );
};

export const updateProject = async (id, { title, category, description, tags, techStack, liveUrl, githubUrl }) => {
  const updateData = { title, category, description, tags: Array.isArray(tags) ? tags : [] };
  if (techStack) updateData.techStack = Array.isArray(techStack) ? techStack : [];
  if (liveUrl !== undefined) updateData.liveUrl = liveUrl;
  if (githubUrl !== undefined) updateData.githubUrl = githubUrl;

  inMemoryProjects = inMemoryProjects.map(p => 
    p.id === id ? { ...p, ...updateData } : p
  );
  
  const updatedStatic = staticProjects.map(p =>
    p.id === id ? { ...p, ...updateData } : p
  );
  
  await updateProjectsFile(updatedStatic, `Update project: ${title} via Admin Dashboard`);
};

export const deleteProject = async (id) => {
  inMemoryProjects = inMemoryProjects.filter(p => p.id !== id);
  const updatedStatic = staticProjects.filter(p => p.id !== id);
  await updateProjectsFile(updatedStatic, `Delete project ID ${id} via Admin Dashboard`);
};
