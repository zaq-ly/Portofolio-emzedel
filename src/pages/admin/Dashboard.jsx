import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Upload, Plus, LogOut, Loader2, CheckCircle2, AlertCircle, Trash2, LayoutGrid, MessageSquare, Mail as MailIcon, Edit, X } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/image';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    title: '', category: 'illustration', description: '', tags: '',
  });
  const [editForm, setEditForm] = useState({
    title: '', category: 'illustration', description: '', tags: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [modalStatus, setModalStatus] = useState({ type: '', message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();

    const projectsChannel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  const transformProject = (p) => ({
    ...p,
    category: p.category === 'print' ? 'poster' : p.category,
    tags: Array.isArray(p.tags)
      ? p.tags.map(t => {
        const lowerT = t.toLowerCase();
        if (lowerT === 'print' || lowerT === 'poster & banner') {
          return p.category === 'banner' ? 'Banner' : 'Poster';
        }
        return t;
      })
      : p.tags,
  });

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetch projects:', error);
    if (data) setProjects(data.map(transformProject));
  };



  // Auto-dismiss status alert
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  useEffect(() => {
    if (modalStatus.message) {
      const timer = setTimeout(() => setModalStatus({ type: '', message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [modalStatus.message]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  // Compress image using canvas before upload
  const compressImage = (file, maxWidth = 1200, quality = 0.82) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })), 'image/jpeg', quality);
        };
      };
    });

  const uploadImageToStorage = async (file) => {
    const compressed = await compressImage(file);
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    const filePath = `gallery/${fileName}`;
    const { error } = await supabase.storage.from('portfolio-images').upload(filePath, compressed);
    if (error) throw error;
    return supabase.storage.from('portfolio-images').getPublicUrl(filePath).data.publicUrl;
  };

  // Upload new project
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) { setStatus({ type: 'error', message: 'Pilih gambar terlebih dahulu.' }); return; }
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const publicUrl = await uploadImageToStorage(imageFile);
      const parsedTags = uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { error } = await supabase.from('projects').insert([{
        title: uploadForm.title, category: uploadForm.category,
        description: uploadForm.description, tags: parsedTags, image_url: publicUrl,
      }]);
      if (error) throw error;
      setStatus({ type: 'success', message: 'Karya berhasil diupload!' });
      setUploadForm({ title: '', category: 'illustration', description: '', tags: '' });
      setImageFile(null);
      fetchProjects();
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Update existing project (from modal)
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalStatus({ type: '', message: '' });
    try {
      const parsedTags = editForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const projectData = {
        title: editForm.title, category: editForm.category,
        description: editForm.description, tags: parsedTags,
      };
      const { data, error } = await supabase.from('projects').update(projectData).eq('id', editingId).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Gagal menyimpan. Pastikan Anda memiliki akses atau coba lagi.");
      const updatedProject = transformProject({
        ...editingProject, ...projectData,
      });
      setProjects(prev => prev.map(p => p.id === editingId ? updatedProject : p));
      setModalStatus({ type: 'success', message: 'Karya berhasil diperbarui!' });
      setTimeout(() => {
        handleCancelEdit();
        fetchProjects();
      }, 1200);
    } catch (err) {
      setModalStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditForm({
      title: project.title,
      category: project.category,
      description: project.description || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
    });
    setEditingId(project.id);
    setEditingProject(project);
    setModalStatus({ type: '', message: '' });
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditForm({ title: '', category: 'illustration', description: '', tags: '' });
    setEditingId(null);
    setEditingProject(null);
    setStatus({ type: '', message: '' });
    setModalStatus({ type: '', message: '' });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus karya ini?')) return;
    try {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
      setStatus({ type: 'success', message: 'Karya berhasil dihapus.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark dark:text-white p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Kelola portofolio kamu disini.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>


        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-3xl sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Plus size={20} className="text-primary" />
              Upload Karya Baru
            </h2>

            {status.message && (
              <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-500 border border-green-200 dark:border-green-500/20' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-500 border border-red-200 dark:border-red-500/20'
                }`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {status.message}
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Gambar Karya</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-dark-border group-hover:border-primary/50 rounded-2xl cursor-pointer bg-gray-50 dark:bg-dark/50 transition-all overflow-hidden relative"
                  >
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="text-gray-400 dark:text-gray-500 mb-2 group-hover:text-primary" size={24} />
                        <span className="text-xs text-gray-500 font-medium">Klik atau drop file gambar</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Judul</label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm text-gray-900 dark:text-white"
                  placeholder="Contoh: Logo Branding ABC"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategori</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm appearance-none text-gray-900 dark:text-white"
                >
                  <option value="illustration">Illustration</option>
                  <option value="logo">Logo</option>
                  <option value="vector">Vector</option>
                  <option value="poster">Poster</option>
                  <option value="banner">Banner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm text-gray-900 dark:text-white"
                  placeholder="Digital Art, Logo, Figma"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi</label>
                <textarea
                  rows="3"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm resize-none text-gray-900 dark:text-white"
                  placeholder="Jelaskan sedikit tentang karya ini..."
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Upload Karya'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          {/* Search + count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Karya ({projects.length})</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari judul..."
              className="px-4 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-primary w-full sm:w-56 transition-all"
            />
          </div>
          {/* Project cards with pagination */}
          {(() => {
            const filtered = projects.filter(p =>
              !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
            const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
            return (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginated.map((project) => (
                    <div key={project.id} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-4 rounded-2xl flex gap-4 group shadow-sm dark:shadow-none hover:border-primary/30 transition-all">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-dark rounded-xl overflow-hidden flex-shrink-0">
                        <img src={getOptimizedImageUrl(project.image_url, 200, 70, 200, 'cover')} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div>
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">{project.title}</h3>
                          <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-0.5">{project.category}</p>
                        </div>
                        <div className="flex gap-3 self-end mt-2">
                          <button onClick={() => handleEdit(project)} className="text-gray-400 hover:text-primary transition-colors" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(project.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Hapus">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {paginated.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border border-dashed rounded-3xl">
                      <p className="text-gray-500">{searchQuery ? 'Tidak ada karya yang cocok.' : 'Belum ada karya yang diupload.'}</p>
                    </div>
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border disabled:opacity-40 hover:border-primary transition-all">←</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                      <button key={pg} onClick={() => setCurrentPage(pg)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${currentPage === pg ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border hover:border-primary'}`}>{pg}</button>
                    ))}
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border disabled:opacity-40 hover:border-primary transition-all">→</button>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

      </div>

      {/* ===== EDIT MODAL ===== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCancelEdit}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Preview (Left side) */}
            <div className="hidden md:flex w-full md:w-1/2 bg-gray-100 dark:bg-dark items-center justify-center p-4">
              <img
                src={getOptimizedImageUrl(editingProject?.image_url, 800, 80)}
                alt={editingProject?.title}
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            {/* Form Edit (Right side) */}
            <div className="w-full md:w-1/2 flex flex-col max-h-[90vh] min-h-0">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-dark-border">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                  <Edit size={20} className="text-primary" />
                  Edit Karya
                </h2>
                <button onClick={handleCancelEdit} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-grow">
                {modalStatus.message && (
                  <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 text-sm ${modalStatus.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
                    {modalStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {modalStatus.message}
                  </div>
                )}
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Judul</label>
                    <input type="text" required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm text-gray-900 dark:text-white" placeholder="Judul karya" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategori</label>
                    <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm appearance-none text-gray-900 dark:text-white">
                      <option value="illustration">Illustration</option>
                      <option value="logo">Logo</option>
                      <option value="vector">Vector</option>
                      <option value="poster">Poster</option>
                      <option value="banner">Banner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags (pisahkan koma)</label>
                    <input type="text" value={editForm.tags} onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm text-gray-900 dark:text-white" placeholder="Digital Art, Logo, Figma" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi</label>
                    <textarea rows="3" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 dark:bg-dark border border-gray-200 dark:border-dark-border focus:border-primary outline-none rounded-xl text-sm resize-none text-gray-900 dark:text-white" placeholder="Jelaskan sedikit tentang karya ini..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button disabled={loading} type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50">
                      {loading ? <Loader2 className="animate-spin" size={20} /> : 'Simpan Perubahan'}
                    </button>
                    <button type="button" onClick={handleCancelEdit} disabled={loading} className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-dark-border dark:hover:bg-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all disabled:opacity-50">
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

