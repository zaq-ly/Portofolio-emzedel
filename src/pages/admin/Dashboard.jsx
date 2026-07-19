import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProjects,
  subscribeProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} from '../../lib/projectsService';
import { Upload, Plus, LogOut, Loader2, CheckCircle2, AlertCircle, Trash2, Edit, X, Search, ArrowLeft } from 'lucide-react';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false,
  });
  const [editForm, setEditForm] = useState({
    title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [modalStatus, setModalStatus] = useState({ type: '', message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeProjects(
      (data) => setProjects(data),
      (error) => console.error('Error fetch projects:', error),
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => setStatus({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  useEffect(() => {
    if (modalStatus.message) {
      const timer = setTimeout(() => setModalStatus({ type: '', message: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [modalStatus.message]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  // Compress image
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

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) { setStatus({ type: 'error', message: 'Pilih gambar terlebih dahulu.' }); return; }
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const isDevProject = uploadForm.category === 'frontend' || uploadForm.category === 'uiux';
      const uploadedUrls = [];
      
      for (const file of imageFiles) {
        const compressed = await compressImage(file);
        const url = await uploadProjectImage(compressed);
        uploadedUrls.push(url);
      }

      const publicUrl = uploadedUrls.join(',');
      const parsedTags = uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      
      const projectData = {
        title: uploadForm.title,
        category: uploadForm.category,
        description: uploadForm.description,
        tags: parsedTags,
        image_url: publicUrl,
        isFeatured: uploadForm.isFeatured,
      };
      if (isDevProject) {
        projectData.type = uploadForm.category;
        projectData.techStack = uploadForm.techStack.split(',').map(t => t.trim()).filter(Boolean);
        projectData.liveUrl = uploadForm.liveUrl;
        projectData.githubUrl = uploadForm.githubUrl;
      }
      await createProject(projectData);
      setStatus({ type: 'success', message: 'Project berhasil diupload!' });
      setUploadForm({ title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false });
      setImageFiles([]);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModalStatus({ type: '', message: '' });
    try {
      const parsedTags = editForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const projectData = {
        title: editForm.title,
        category: editForm.category,
        description: editForm.description,
        tags: parsedTags,
        techStack: editForm.techStack ? editForm.techStack.split(',').map(t => t.trim()).filter(Boolean) : [],
        liveUrl: editForm.liveUrl,
        githubUrl: editForm.githubUrl,
        isFeatured: editForm.isFeatured,
      };

      if (editImageFiles.length > 0) {
        const uploadedUrls = [];
        for (const file of editImageFiles) {
          const compressed = await compressImage(file);
          const url = await uploadProjectImage(compressed);
          uploadedUrls.push(url);
        }
        projectData.image_url = uploadedUrls.join(',');
      }

      await updateProject(editingId, projectData);
      setModalStatus({ type: 'success', message: 'Berhasil diperbarui!' });
      setTimeout(() => handleCancelEdit(), 1200);
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
      techStack: Array.isArray(project.tech_stack || project.techStack) ? (project.tech_stack || project.techStack).join(', ') : '',
      liveUrl: project.live_url || project.liveUrl || '',
      githubUrl: project.github_url || project.githubUrl || '',
      isFeatured: project.is_featured || project.isFeatured || false,
    });
    setEditingId(project.id);
    setEditingProject(project);
    setModalStatus({ type: '', message: '' });
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditForm({ title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false });
    setEditingId(null);
    setEditingProject(null);
    setEditImageFiles([]);
    setModalStatus({ type: '', message: '' });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus project ini?')) return;
    try {
      await deleteProject(id);
      setStatus({ type: 'success', message: 'Project berhasil dihapus.' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    }
  };

  const filtered = projects.filter(p =>
    !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Shared input styles
  const inputClass = "w-full px-4 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder:text-[#86868b]";
  const labelClass = "block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2";

  const FormFields = ({ form, setForm, isEdit = false }) => {
    const isDevProject = form.category === 'frontend' || form.category === 'uiux';
    return (
      <>
        <div>
          <label className={labelClass}>Judul</label>
          <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Nama project" />
        </div>
        <div>
          <label className={labelClass}>Kategori</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass + " appearance-none"}>
            <option value="illustration">Illustration</option>
            <option value="logo">Logo</option>
            <option value="vector">Vector</option>
            <option value="poster">Poster</option>
            <option value="banner">Banner</option>
            <option value="frontend">Front-End Project</option>
            <option value="uiux">UI/UX Project</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-2 mb-4">
          <input 
            type="checkbox" 
            id={`featured-${isEdit ? 'edit' : 'upload'}`}
            checked={form.isFeatured} 
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} 
            className="w-4 h-4 text-[#0071e3] border-[#d2d2d7] rounded focus:ring-[#0071e3] transition-all"
          />
          <label htmlFor={`featured-${isEdit ? 'edit' : 'upload'}`} className="text-sm font-medium text-[#1d1d1f] cursor-pointer">
            Tampilkan di Beranda (Featured)
          </label>
        </div>
        <div>
          <label className={labelClass}>Tags (pisahkan koma)</label>
          <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputClass} placeholder="React, Figma, Digital Art" />
        </div>
        <div>
          <label className={labelClass}>Deskripsi</label>
          <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " resize-none"} placeholder="Jelaskan singkat tentang project ini..." />
        </div>
        {isDevProject && (
          <>
            <div>
              <label className={labelClass}>Tech Stack (pisahkan koma)</label>
              <input type="text" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className={inputClass} placeholder="React, Tailwind CSS, Vite" />
            </div>
            <div>
              <label className={labelClass}>Live Demo URL</label>
              <input type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className={inputClass} placeholder="https://example.com" />
            </div>
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className={inputClass} placeholder="https://github.com/username/repo" />
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-[#0071e3] hover:underline text-sm font-medium flex items-center gap-1">
              <ArrowLeft size={14} /> Beranda
            </button>
            <span className="text-[#d2d2d7]">|</span>
            <h1 className="text-sm font-bold text-[#1d1d1f]">Admin</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-[#86868b] hover:text-red-500 transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Alert */}
        {status.message && (
          <div className={`mb-6 px-5 py-3.5 rounded-2xl flex items-center gap-3 text-sm font-medium ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] sticky top-24">
              <h2 className="text-xl font-bold text-[#1d1d1f] mb-1 tracking-tight flex items-center gap-2">
                <Plus size={20} className="text-[#0071e3]" />
                Upload Baru
              </h2>
              <p className="text-[#86868b] text-xs mb-6">Tambahkan project ke portfolio Anda.</p>

              <form onSubmit={handleUpload} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className={labelClass}>
                    Gambar {uploadForm.category === 'frontend' || uploadForm.category === 'uiux' ? '(Bisa pilih banyak)' : ''}
                  </label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple={uploadForm.category === 'frontend' || uploadForm.category === 'uiux'}
                      onChange={(e) => setImageFiles(Array.from(e.target.files))} 
                      className="hidden" 
                      id="file-upload" 
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#d2d2d7] group-hover:border-[#0071e3]/40 rounded-2xl cursor-pointer bg-[#f5f5f7] transition-all overflow-hidden"
                    >
                      {imageFiles.length > 0 ? (
                        <div className="flex w-full h-full overflow-x-auto gap-2 p-2">
                          {imageFiles.map((file, i) => (
                            <img key={i} src={URL.createObjectURL(file)} alt="Preview" className="h-full w-auto object-cover rounded-lg flex-shrink-0" />
                          ))}
                        </div>
                      ) : (
                        <>
                          <Upload className="text-[#86868b] mb-2 group-hover:text-[#0071e3] transition-colors" size={22} />
                          <span className="text-xs text-[#86868b] font-medium">Klik untuk pilih gambar</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <FormFields form={uploadForm} setForm={setUploadForm} />

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm mt-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Upload Project'}
                </button>
              </form>
            </div>
          </div>

          {/* Project List */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                Projects <span className="text-[#86868b] font-normal text-base">({projects.length})</span>
              </h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari project..."
                  className="pl-9 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3] w-full sm:w-56 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((project) => (
                <div key={project.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group">
                  <div className="w-20 h-20 bg-[#f5f5f7] rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={project.image_url || project.image} 
                      alt="" 
                      loading="lazy" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#1d1d1f] truncate">{project.title}</h3>
                        {(project.is_featured || project.isFeatured) && (
                          <span className="text-[#0071e3]" title="Featured">⭐️</span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#0071e3] uppercase font-bold tracking-widest mt-0.5">{project.category}</p>
                    </div>
                    <div className="flex gap-3 self-end">
                      <button onClick={() => handleEdit(project)} className="text-[#86868b] hover:text-[#0071e3] transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="text-[#86868b] hover:text-red-500 transition-colors" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-20 text-center bg-white border-2 border-dashed border-[#d2d2d7] rounded-3xl">
                  <p className="text-[#86868b] text-sm">{searchQuery ? 'Tidak ada yang cocok.' : 'Belum ada project.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCancelEdit}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#f5f5f7]">
              <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2 tracking-tight">
                <Edit size={18} className="text-[#0071e3]" />
                Edit Project
              </h2>
              <button onClick={handleCancelEdit} className="p-2 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow">
              {modalStatus.message && (
                <div className={`px-4 py-3 rounded-2xl mb-4 flex items-center gap-3 text-sm font-medium ${
                  modalStatus.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {modalStatus.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  {modalStatus.message}
                </div>
              )}
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Edit Image Upload */}
                <div>
                  <label className={labelClass}>
                    Ganti Gambar (Opsional) {editForm.category === 'frontend' || editForm.category === 'uiux' ? '- Bisa pilih banyak' : ''}
                  </label>
                  <div className="relative group mb-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple={editForm.category === 'frontend' || editForm.category === 'uiux'}
                      onChange={(e) => setEditImageFiles(Array.from(e.target.files))} 
                      className="hidden" 
                      id="edit-file-upload" 
                    />
                    <label
                      htmlFor="edit-file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#d2d2d7] group-hover:border-[#0071e3]/40 rounded-2xl cursor-pointer bg-[#f5f5f7] transition-all overflow-hidden"
                    >
                      {editImageFiles.length > 0 ? (
                        <div className="flex w-full h-full overflow-x-auto gap-2 p-2">
                          {editImageFiles.map((file, i) => (
                            <img key={i} src={URL.createObjectURL(file)} alt="Preview" className="h-full w-auto object-cover rounded-lg flex-shrink-0" />
                          ))}
                        </div>
                      ) : (
                        <>
                          <Upload className="text-[#86868b] mb-2 group-hover:text-[#0071e3] transition-colors" size={20} />
                          <span className="text-xs text-[#86868b] font-medium text-center px-4">
                            Biarkan kosong jika tidak ingin mengubah gambar
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <FormFields form={editForm} setForm={setEditForm} isEdit />
                <div className="flex gap-3 pt-2">
                  <button disabled={loading} type="submit" className="flex-1 bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Simpan'}
                  </button>
                  <button type="button" onClick={handleCancelEdit} disabled={loading} className="px-6 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-semibold rounded-xl transition-all disabled:opacity-50 text-sm">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
