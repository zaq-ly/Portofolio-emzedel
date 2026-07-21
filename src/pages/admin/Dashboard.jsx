import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProjects,
  subscribeProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} from '../../lib/projectsService';
import { Upload, Plus, LogOut, Loader2, CheckCircle2, AlertCircle, Trash2, Edit, X, Search, ArrowLeft, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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

const AdminDashboard = () => {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const gridScrollRef = useRef(null);

  const [activeDragIndex, setActiveDragIndex] = useState(null);
  const pointerDragState = useRef({ isDragging: false, startIndex: null, ghost: null, offsetX: 0, offsetY: 0 });

  const performPointerSwap = (fromIndex, toIndex) => {
    const swap = (prev) => {
      const arr = [...prev];
      const item = arr.splice(fromIndex, 1)[0];
      arr.splice(toIndex, 0, item);
      return arr;
    };
    if (gridSortType === 'upload') setImageFiles(swap);
    else if (gridSortType === 'edit-new') setEditImageFiles(swap);
    else if (gridSortType === 'edit-existing') setExistingImages(swap);
  };

  const handlePointerMove = (e) => {
    if (!pointerDragState.current.isDragging) return;
    
    const ghost = pointerDragState.current.ghost;
    if (ghost) {
      ghost.style.left = `${e.clientX - pointerDragState.current.offsetX}px`;
      ghost.style.top = `${e.clientY - pointerDragState.current.offsetY}px`;
    }

    const elem = document.elementFromPoint(e.clientX, e.clientY);
    if (!elem) return;
    const itemElem = elem.closest('[data-grid-index]');
    if (itemElem) {
      const hoverIndex = parseInt(itemElem.getAttribute('data-grid-index'), 10);
      if (hoverIndex !== pointerDragState.current.startIndex) {
        performPointerSwap(pointerDragState.current.startIndex, hoverIndex);
        pointerDragState.current.startIndex = hoverIndex;
        setActiveDragIndex(hoverIndex);
      }
    }
  };

  const handlePointerUp = (e) => {
    pointerDragState.current.isDragging = false;
    setActiveDragIndex(null);
    if (pointerDragState.current.ghost) {
      pointerDragState.current.ghost.remove();
      pointerDragState.current.ghost = null;
    }
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  const handlePointerDown = (e, index) => {
    e.preventDefault();
    pointerDragState.current.isDragging = true;
    pointerDragState.current.startIndex = index;
    setActiveDragIndex(index);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const ghost = e.currentTarget.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.top = `${rect.top}px`;
    ghost.style.left = `${rect.left}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.pointerEvents = 'none';
    ghost.style.zIndex = '99999';
    ghost.style.opacity = '0.9';
    ghost.style.transform = 'scale(1.05)';
    ghost.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
    ghost.style.transition = 'none';
    ghost.style.borderRadius = '1rem';
    
    const btns = ghost.querySelectorAll('button, .absolute');
    btns.forEach(b => b.remove());
    
    document.body.appendChild(ghost);
    
    pointerDragState.current.ghost = ghost;
    pointerDragState.current.offsetX = e.clientX - rect.left;
    pointerDragState.current.offsetY = e.clientY - rect.top;

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [uploadForm, setUploadForm] = useState({
    title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false,
  });
  const [editForm, setEditForm] = useState({
    title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGridSortOpen, setIsGridSortOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [gridSortType, setGridSortType] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleFileSelection = (files, isEdit) => {
    const imgFiles = files.filter(f => f.type.startsWith('image/'));
    const sorted = imgFiles.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aIsThumb = aName.includes('thumb');
      const bIsThumb = bName.includes('thumb');
      
      if (aIsThumb && !bIsThumb) return -1;
      if (!aIsThumb && bIsThumb) return 1;
      
      const aNumMatch = aName.match(/^(\d+)/);
      const bNumMatch = bName.match(/^(\d+)/);
      const aNum = aNumMatch ? parseInt(aNumMatch[1], 10) : Infinity;
      const bNum = bNumMatch ? parseInt(bNumMatch[1], 10) : Infinity;
      
      if (aNum !== bNum) return aNum - bNum;
      return aName.localeCompare(bName);
    });

    if (isEdit) {
      setEditImageFiles(sorted);
    } else {
      setImageFiles(sorted);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeProjects(
      (data) => {
        setProjects(data);
        setInitialLoading(false);
      },
      (error) => {
        console.error('Error fetch projects:', error);
        setInitialLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  const removeImage = (index, isEdit, isExisting = false) => {
    if (isEdit) {
      if (isExisting) {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
      } else {
        setEditImageFiles(prev => prev.filter((_, i) => i !== index));
      }
    } else {
      setImageFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const moveImage = (index, direction, isEdit) => {
    let files;
    let isExisting = false;
    
    if (isEdit) {
      if (editImageFiles.length > 0) {
        files = [...editImageFiles];
      } else {
        files = [...existingImages];
        isExisting = true;
      }
    } else {
      files = [...imageFiles];
    }
    
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;
    
    const temp = files[index];
    files[index] = files[newIndex];
    files[newIndex] = temp;
    
    if (isEdit) {
      if (isExisting) setExistingImages(files);
      else setEditImageFiles(files);
    } else {
      setImageFiles(files);
    }
  };

  const handleDragSort = (isEdit) => {
    let files;
    let isExisting = false;
    
    if (isEdit) {
      if (editImageFiles.length > 0) {
        files = [...editImageFiles];
      } else {
        files = [...existingImages];
        isExisting = true;
      }
    } else {
      files = [...imageFiles];
    }

    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;
    
    const draggedItemContent = files.splice(dragItem.current, 1)[0];
    files.splice(dragOverItem.current, 0, draggedItemContent);
    
    dragItem.current = null;
    dragOverItem.current = null;

    if (isEdit) {
      if (isExisting) setExistingImages(files);
      else setEditImageFiles(files);
    } else {
      setImageFiles(files);
    }
  };

  const handleDragOverScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const container = e.currentTarget;
    const scrollThreshold = 150;
    const speed = 25;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < scrollThreshold) {
      container.scrollBy({ left: -speed, behavior: 'auto' });
    } else if (rect.width - x < scrollThreshold) {
      container.scrollBy({ left: speed, behavior: 'auto' });
    }
  };

  const handleDragOverScrollVertical = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const container = e.currentTarget;
    const scrollThreshold = 100;
    const speed = 25;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    if (y < scrollThreshold) {
      container.scrollBy({ top: -speed, behavior: 'auto' });
    } else if (rect.height - y < scrollThreshold) {
      container.scrollBy({ top: speed, behavior: 'auto' });
    }
  };

  // Compress image
  const compressImage = (file, maxWidth = 1200, quality = 0.82) =>
    new Promise((resolve) => {
      if (file.type === 'image/gif') {
        resolve(file);
        return;
      }
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

  const handleCancelUpload = () => {
    setUploadForm({ title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false });
    setImageFiles([]);
    setIsUploadModalOpen(false);
  };

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) { toast.error('Pilih gambar terlebih dahulu.'); return; }
    setLoading(true);
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
      
      const newData = await fetchProjects();
      setProjects(newData);
      
      toast.success('Project berhasil diupload!');
      handleCancelUpload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      } else if (existingImages.length > 0) {
        projectData.image_url = existingImages.join(',');
      }

      await updateProject(editingId, projectData);
      
      const newData = await fetchProjects();
      setProjects(newData);
      
      toast.success('Berhasil diperbarui!');
      setTimeout(() => handleCancelEdit(), 1200);
    } catch (err) {
      toast.error(err.message);
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
    const existingImgs = (project.image_url || project.image || '').split(',').map(s => s.trim()).filter(Boolean);
    setExistingImages(existingImgs);
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditForm({ title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false });
    setEditingId(null);
    setEditingProject(null);
    setEditImageFiles([]);
    setExistingImages([]);
    setIsEditModalOpen(false);
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete.id);
      const newData = await fetchProjects();
      setProjects(newData);
      toast.success('Project berhasil dihapus.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProjectToDelete(null);
    }
  };

  const filtered = projects.filter(p =>
    !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Toaster position="top-center" />
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
              Projects <span className="text-[#86868b] font-normal text-lg">({projects.length})</span>
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari project..."
                  className="pl-9 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-sm text-[#1d1d1f] outline-none focus:border-[#0071e3] w-full sm:w-56 transition-all"
                />
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm whitespace-nowrap shadow-sm"
              >
                <Plus size={18} />
                Tambah Project
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {initialLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] animate-pulse">
                    <div className="w-20 h-20 bg-[#f5f5f7] rounded-xl flex-shrink-0"></div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <div className="h-4 bg-[#f5f5f7] rounded w-3/4"></div>
                        <div className="h-3 bg-[#f5f5f7] rounded w-1/2"></div>
                      </div>
                      <div className="flex gap-3 self-end">
                        <div className="h-4 w-4 bg-[#f5f5f7] rounded"></div>
                        <div className="h-4 w-4 bg-[#f5f5f7] rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {filtered.map((project) => (
                    <div key={project.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group">
                      <div className="w-20 h-20 bg-[#f5f5f7] rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={(project.image_url || project.image) ? (project.image_url || project.image).split(',')[0].trim() : ''} 
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
                          <button onClick={() => confirmDelete(project)} className="text-[#86868b] hover:text-red-500 transition-colors" title="Hapus">
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
                </>
              )}
            </div>
        </div>
      </div>

      {/* ===== UPLOAD MODAL ===== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCancelUpload}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#f5f5f7]">
              <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2 tracking-tight">
                <Plus size={18} className="text-[#0071e3]" />
                Upload Project
              </h2>
              <button onClick={handleCancelUpload} className="p-2 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                      Gambar Project
                    </label>
                    {imageFiles.length > 1 && (
                      <button type="button" onClick={() => { setGridSortType('upload'); setIsGridSortOpen(true); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1">
                        <LayoutGrid size={14} /> Edit Susunan
                      </button>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple={true}
                      onChange={(e) => handleFileSelection(Array.from(e.target.files), false)} 
                      className="hidden" 
                      id="file-upload" 
                    />
                    <input 
                      type="file" 
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={(e) => handleFileSelection(Array.from(e.target.files), false)} 
                      className="hidden" 
                      id="folder-upload" 
                    />
                    <div
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#d2d2d7] rounded-2xl bg-[#f5f5f7] transition-all overflow-hidden relative"
                    >
                      {imageFiles.length > 0 ? (
                        <>
                          <div 
                            className="flex w-full h-full overflow-x-auto gap-2 p-2"
                            onDragOver={handleDragOverScroll}
                          >
                            {imageFiles.map((file, i) => (
                              <div 
                                key={i} 
                                className="relative h-full shrink-0 group/img cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => { e.stopPropagation(); dragItem.current = i; }}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); dragOverItem.current = i; }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDragEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleDragSort(false); }}
                              >
                                <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-auto object-contain rounded-lg pointer-events-none" draggable={false} />
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(i, false); }} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-[#1d1d1f] hover:text-red-500 hover:bg-white rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-all z-10">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center w-full h-full">
                          <Upload className="text-[#86868b] mb-4 group-hover:text-[#0071e3] transition-colors" size={32} />
                          <p className="text-sm font-medium text-[#1d1d1f] mb-1">Pilih sumber gambar</p>
                          <p className="text-[10px] text-[#86868b] mb-5 opacity-80">(Sistem otomatis mendeteksi urutan & thumbnail)</p>
                          <div className="flex gap-3">
                            <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('file-upload').click(); }} className="px-5 py-2.5 bg-white text-[#0071e3] text-xs font-bold rounded-lg shadow-sm border border-[#0071e3]/20 hover:bg-[#0071e3] hover:text-white transition-all">
                              Pilih File
                            </button>
                            <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('folder-upload').click(); }} className="px-5 py-2.5 bg-white text-[#0071e3] text-xs font-bold rounded-lg shadow-sm border border-[#0071e3]/20 hover:bg-[#0071e3] hover:text-white transition-all">
                              Pilih Folder
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <FormFields form={uploadForm} setForm={setUploadForm} />
                
                <div className="flex gap-3 pt-2">
                  <button disabled={loading} type="submit" className="flex-1 bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Upload Project'}
                  </button>
                  <button type="button" onClick={handleCancelUpload} disabled={loading} className="px-6 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-semibold rounded-xl transition-all disabled:opacity-50 text-sm">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== GRID SORT MODAL ===== */}
      {isGridSortOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full h-full max-w-5xl mx-auto flex flex-col bg-[#f5f5f7] rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 bg-white border-b border-[#e8e8ed]">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsGridSortOpen(false)} className="p-2 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] rounded-xl transition-all">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-[#1d1d1f]">Edit Susunan Grid</h2>
                  <p className="text-xs text-[#86868b]">Geser gambar untuk mengatur urutan halaman</p>
                </div>
              </div>
              <button onClick={() => setIsGridSortOpen(false)} className="px-8 py-2.5 bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold rounded-xl transition-all text-sm shadow-md shadow-[#0071e3]/20">
                Selesai
              </button>
            </div>
            <div 
              ref={gridScrollRef}
              className="flex-1 overflow-y-auto p-6 md:p-8"
              onDragOver={handleDragOverScrollVertical}
              onWheel={(e) => { if (dragItem.current !== null) e.currentTarget.scrollBy({ top: e.deltaY, behavior: 'auto' }); }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {(gridSortType === 'upload' ? imageFiles : gridSortType === 'edit-new' ? editImageFiles : existingImages).map((fileOrUrl, i) => {
                  const isExisting = gridSortType === 'edit-existing';
                  const isEdit = gridSortType !== 'upload';
                  const src = isExisting ? fileOrUrl : URL.createObjectURL(fileOrUrl);
                  
                  return (
                    <div 
                      key={i}
                      data-grid-index={i}
                      className={`relative aspect-square bg-white rounded-2xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing group border-2 transition-all ${activeDragIndex === i ? 'opacity-30 scale-95 border-[#0071e3]' : 'border-transparent hover:border-[#0071e3]/30'}`}
                      onPointerDown={(e) => handlePointerDown(e, i)}
                    >
                      <img src={src} alt="Grid Item" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                      <div className="absolute top-2 left-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1d1d1f] text-xs font-bold shadow-sm pointer-events-none">
                        {i + 1}
                      </div>
                      <button 
                        type="button" 
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(i, isEdit, isExisting); }} 
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-[#1d1d1f] hover:text-red-500 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

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
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Edit Image Upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                      Ganti Gambar Project
                    </label>
                    {editImageFiles.length > 1 ? (
                      <button type="button" onClick={() => { setGridSortType('edit-new'); setIsGridSortOpen(true); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1">
                        <LayoutGrid size={14} /> Edit Susunan
                      </button>
                    ) : existingImages.length > 1 ? (
                      <button type="button" onClick={() => { setGridSortType('edit-existing'); setIsGridSortOpen(true); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1">
                        <LayoutGrid size={14} /> Edit Susunan
                      </button>
                    ) : null}
                  </div>
                  <div className="relative group mb-4">
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple={true}
                      onChange={(e) => handleFileSelection(Array.from(e.target.files), true)} 
                      className="hidden" 
                      id="edit-file-upload" 
                    />
                    <input 
                      type="file" 
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={(e) => handleFileSelection(Array.from(e.target.files), true)} 
                      className="hidden" 
                      id="edit-folder-upload" 
                    />
                    <div
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#d2d2d7] rounded-2xl bg-[#f5f5f7] transition-all overflow-hidden relative"
                    >
                      {editImageFiles.length > 0 ? (
                        <>
                          <div 
                            className="flex w-full h-full overflow-x-auto gap-2 p-2"
                            onDragOver={handleDragOverScroll}
                          >
                            {editImageFiles.map((file, i) => (
                              <div 
                                key={i} 
                                className="relative h-full shrink-0 group/img cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => { e.stopPropagation(); dragItem.current = i; }}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); dragOverItem.current = i; }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDragEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleDragSort(true); }}
                              >
                                <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-auto object-contain rounded-lg pointer-events-none" draggable={false} />
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(i, true, false); }} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-[#1d1d1f] hover:text-red-500 hover:bg-white rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-all z-10">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : existingImages.length > 0 ? (
                        <>
                          <div 
                            className="flex w-full h-full overflow-x-auto gap-2 p-2"
                            onDragOver={handleDragOverScroll}
                          >
                            {existingImages.map((url, i) => (
                              <div 
                                key={i} 
                                className="relative h-full shrink-0 group/img cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => { e.stopPropagation(); dragItem.current = i; }}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); dragOverItem.current = i; }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDragEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleDragSort(true); }}
                              >
                                <img src={url} alt="Preview" className="h-full w-auto object-contain rounded-lg pointer-events-none" draggable={false} />
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(i, true, true); }} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-[#1d1d1f] hover:text-red-500 hover:bg-white rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-all z-10">
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center w-full h-full">
                          <Upload className="text-[#86868b] mb-4 group-hover:text-[#0071e3] transition-colors" size={32} />
                          <p className="text-sm font-medium text-[#1d1d1f] mb-1">Pilih sumber gambar</p>
                          <p className="text-[10px] text-[#86868b] mb-5 opacity-80">(Biarkan kosong jika tidak ingin mengubah gambar)</p>
                          <div className="flex gap-3">
                            <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('edit-file-upload').click(); }} className="px-5 py-2.5 bg-white text-[#0071e3] text-xs font-bold rounded-lg shadow-sm border border-[#0071e3]/20 hover:bg-[#0071e3] hover:text-white transition-all">
                              Pilih File
                            </button>
                            <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('edit-folder-upload').click(); }} className="px-5 py-2.5 bg-white text-[#0071e3] text-xs font-bold rounded-lg shadow-sm border border-[#0071e3]/20 hover:bg-[#0071e3] hover:text-white transition-all">
                              Pilih Folder
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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

      {/* DELETE CONFIRMATION MODAL */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Hapus Project?</h3>
              <p className="text-sm text-[#86868b]">
                Apakah Anda yakin ingin menghapus <br/><span className="font-semibold text-[#1d1d1f]">"{projectToDelete.title}"</span>?<br/>Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex border-t border-[#f5f5f7]">
              <button 
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-4 text-sm font-semibold text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-colors border-r border-[#f5f5f7]"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
