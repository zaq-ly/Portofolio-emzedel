import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchProjects,
  subscribeProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  updateFeaturedOrder,
  renameCategory,
  deleteCategory,
} from '../../lib/projectsService';
import { Upload, Plus, LogOut, Loader2, CheckCircle2, AlertCircle, Trash2, Edit, X, Search, ArrowLeft, ChevronLeft, ChevronRight, LayoutGrid, Eye, Tags, Check, Filter, ChevronDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { parseProjectImages, getFirstProjectImage } from '../../utils/projects';
import { supabase } from '../../lib/supabaseClient';

const inputClass = "w-full px-4 py-3 bg-[#f5f5f7] border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder:text-[#86868b]";
const labelClass = "block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2";


const STORAGE_KEY_CATEGORIES = 'portfolio_all_categories_v2';
const INITIAL_DEFAULT_CATEGORIES = [
  'Illustration',
  'Logo',
  'Vector',
  'Poster',
  'Banner',
  'Front-End Project',
  'UI/UX Project',
  'Sertifikat',
];

const getStoredCategories = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const setStoredCategories = (cats) => {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(cats));
  } catch {}
};

const isDevCategory = (cat) => {
  if (!cat) return false;
  const c = cat.toLowerCase();
  return c === 'frontend' || c === 'uiux' || c.includes('front-end') || c.includes('frontend') || c.includes('ui/ux') || c.includes('uiux');
};

const isCertCategory = (cat) => {
  if (!cat) return false;
  const c = cat.toLowerCase();
  return c === 'certificate' || c === 'sertifikat' || c.includes('certificate') || c.includes('sertifikat');
};

const FormFields = ({ form, setForm, isEdit = false, imageCount = 0, categoriesList = [], onManageCategories }) => {
  const isDevProject = isDevCategory(form.category);
  const isCert = isCertCategory(form.category);

  const [isCustomMode, setIsCustomMode] = useState(() => {
    if (!form.category) return false;
    return !categoriesList.some(c => c.toLowerCase() === form.category.toLowerCase());
  });

  const [customInputValue, setCustomInputValue] = useState(() => {
    if (!form.category) return '';
    const exists = categoriesList.some(c => c.toLowerCase() === form.category.toLowerCase());
    return exists ? '' : form.category;
  });

  useEffect(() => {
    if (!form.category) return;
    const exists = categoriesList.some(c => c.toLowerCase() === form.category.toLowerCase());
    if (!exists) {
      setIsCustomMode(true);
      setCustomInputValue(form.category);
    } else {
      setIsCustomMode(false);
      setCustomInputValue('');
    }
  }, [form.category, categoriesList]);

  const handleSelectCategory = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomMode(true);
      setForm({ ...form, category: customInputValue || '' });
    } else {
      setIsCustomMode(false);
      setForm({ ...form, category: val });
    }
  };

  const handleCustomInputChange = (e) => {
    const val = e.target.value;
    setCustomInputValue(val);
    setForm({ ...form, category: val });
  };

  const getSelectValue = () => {
    if (isCustomMode) return '__custom__';
    const match = categoriesList.find(c => c.toLowerCase() === (form.category || '').toLowerCase());
    if (match) return match;
    return form.category || (categoriesList[0] || 'Illustration');
  };

  return (
    <>
      <div>
        <label className={labelClass}>{isCert ? 'Nama Sertifikat' : 'Judul'}</label>
        <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder={isCert ? "Contoh: Dicoding Front-End Developer" : "Nama project"} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + " mb-0"}>Kategori</label>
          {onManageCategories && (
            <button
              type="button"
              onClick={onManageCategories}
              className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1"
            >
              <Tags size={12} /> Kelola Kategori
            </button>
          )}
        </div>
        <select
          value={getSelectValue()}
          onChange={handleSelectCategory}
          className={inputClass + " appearance-none cursor-pointer"}
        >
          {categoriesList.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="__custom__">+ Tambah Kategori Baru...</option>
        </select>

        {isCustomMode && (
          <div className="mt-2.5">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">
                Nama Kategori Baru
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCustomMode(false);
                  setCustomInputValue('');
                  setForm({ ...form, category: categoriesList[0] || 'Illustration' });
                }}
                className="text-xs text-[#0071e3] hover:underline"
              >
                Batal (Pilih Dari Daftar)
              </button>
            </div>
            <input
              type="text"
              required
              autoFocus
              value={customInputValue}
              onChange={handleCustomInputChange}
              placeholder="Contoh: 3D Art, Motion Graphic, Packaging..."
              className={inputClass}
            />
          </div>
        )}
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
        <label className={labelClass}>{isCert ? 'Lembaga Penerbit' : 'Deskripsi'}</label>
        <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " resize-none"} placeholder={isCert ? "Contoh: Dicoding Academy" : "Jelaskan singkat tentang project ini..."} />
      </div>
      {isCert && (
        <div>
          <label className={labelClass}>Tahun</label>
          <input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={inputClass} placeholder="Contoh: 2024" />
        </div>
      )}
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
          {imageCount > 0 && (
            <div className="mt-4 p-4 bg-white border border-[#d2d2d7] rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <label className="block text-xs font-bold text-[#1d1d1f] uppercase tracking-wider mb-4">
                Judul Gambar (Opsional)
              </label>
              <div className="space-y-3">
                {Array.from({ length: imageCount }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 bg-[#f5f5f7] p-2 rounded-lg border border-[#d2d2d7]/50">
                    <span className="text-xs font-bold text-[#86868b] w-20 shrink-0 text-center">Gambar {i + 1}</span>
                    <input 
                      type="text" 
                      value={form.imageLabels?.[i] || ''}
                      onChange={(e) => {
                        const newLabels = [...(form.imageLabels || [])];
                        newLabels[i] = e.target.value;
                        setForm({ ...form, imageLabels: newLabels });
                      }}
                      placeholder={i === 0 ? 'Homepage' : `Preview ${i + 1}`}
                      className="flex-1 px-3 py-2 bg-white border border-[#d2d2d7] rounded-md text-[#1d1d1f] text-sm outline-none focus:border-[#0071e3] transition-all placeholder:text-[#86868b]/60"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};


const CategoryFilterDropdown = ({ categories, projects, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('pointerdown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
    };
  }, [isOpen]);

  const selectedCount = selected === 'all'
    ? projects.length
    : projects.filter(p => (p.category || '').toLowerCase() === selected.toLowerCase()).length;

  const currentLabel = selected === 'all' ? 'Semua Kategori' : selected;

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold transition-all shadow-sm ${
          isOpen
            ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20 text-[#1d1d1f]'
            : selected !== 'all'
            ? 'border-[#0071e3] text-[#0071e3]'
            : 'border-[#d2d2d7] hover:border-[#0071e3] text-[#1d1d1f]'
        }`}
      >
        <Filter size={15} className={selected !== 'all' ? 'text-[#0071e3]' : 'text-[#86868b]'} />
        <span className="truncate max-w-[130px] sm:max-w-[180px]">{currentLabel}</span>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
          selected !== 'all' ? 'bg-[#0071e3]/10 text-[#0071e3]' : 'bg-[#f5f5f7] text-[#86868b]'
        }`}>
          {selectedCount}
        </span>
        <ChevronDown
          size={15}
          className={`text-[#86868b] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 min-w-[230px] max-w-[280px] bg-white/95 backdrop-blur-xl border border-[#d2d2d7]/80 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] p-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-[300px] overflow-y-auto minimal-scrollbar space-y-0.5">
            <button
              type="button"
              onClick={() => { onSelect('all'); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selected === 'all'
                  ? 'bg-[#0071e3] text-white shadow-sm'
                  : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {selected === 'all' && <Check size={14} className="shrink-0" />}
                <span className="truncate">Semua Kategori</span>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${
                selected === 'all' ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'
              }`}>
                {projects.length}
              </span>
            </button>

            <div className="h-px bg-[#f5f5f7] my-1" />

            {categories.map((cat) => {
              const count = projects.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase()).length;
              const isSelected = selected.toLowerCase() === cat.toLowerCase();

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { onSelect(cat); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#0071e3] text-white shadow-sm'
                      : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isSelected && <Check size={14} className="shrink-0" />}
                    <span className="truncate">{cat}</span>
                  </div>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#f5f5f7] text-[#86868b]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const gridScrollRef = useRef(null);

  const [activeDragIndex, setActiveDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const pointerDragState = useRef({ isDragging: false, startIndex: null, targetIndex: null, ghost: null, offsetX: 0, offsetY: 0 });

  const performPointerSwap = (fromIndex, toIndex) => {
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;
    const swap = (prev) => {
      if (!Array.isArray(prev)) return prev;
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) return prev;
      const arr = [...prev];
      const [item] = arr.splice(fromIndex, 1);
      if (item === undefined) return prev;
      arr.splice(toIndex, 0, item);
      return arr;
    };
    if (gridSortType === 'upload') {
      setImageFiles(swap);
      setUploadForm(prev => ({ ...prev, imageLabels: swap(prev.imageLabels || []) }));
    } else if (gridSortType === 'edit') {
      setEditImages(swap);
      setEditForm(prev => ({ ...prev, imageLabels: swap(prev.imageLabels || []) }));
    } else if (gridSortType === 'featured') {
      setFeaturedProjects(swap);
    }
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
      if (!isNaN(hoverIndex) && pointerDragState.current.targetIndex !== hoverIndex) {
        pointerDragState.current.targetIndex = hoverIndex;
        setDragOverIndex(hoverIndex);
      }
    }
  };

  const handlePointerUp = () => {
    if (!pointerDragState.current.isDragging) return;
    const from = pointerDragState.current.startIndex;
    const to = pointerDragState.current.targetIndex;

    pointerDragState.current.isDragging = false;
    setActiveDragIndex(null);
    setDragOverIndex(null);

    if (pointerDragState.current.ghost) {
      pointerDragState.current.ghost.remove();
      pointerDragState.current.ghost = null;
    }
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);

    if (from !== null && to !== null && from !== to) {
      performPointerSwap(from, to);
    }
  };

  const handlePointerDown = (e, index) => {
    e.preventDefault();
    pointerDragState.current = {
      isDragging: true,
      startIndex: index,
      targetIndex: index,
      ghost: null,
      offsetX: 0,
      offsetY: 0,
    };
    setActiveDragIndex(index);
    setDragOverIndex(index);

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
    title: '', category: 'illustration', description: '', year: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false, imageLabels: [],
  });
  const [editForm, setEditForm] = useState({
    title: '', category: 'illustration', description: '', year: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false, imageLabels: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [editImages, setEditImages] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isGridSortOpen, setIsGridSortOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [gridSortType, setGridSortType] = useState('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewImage, setPreviewImage] = useState(null);
  const [isFeaturedSortOpen, setIsFeaturedSortOpen] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const navigate = useNavigate();

  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = getStoredCategories();
    return saved && saved.length > 0 ? saved : INITIAL_DEFAULT_CATEGORIES;
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [returnToModal, setReturnToModal] = useState(null);

  const handleOpenCategoryManager = (fromModal = null) => {
    if (fromModal === 'edit') {
      setIsEditModalOpen(false);
      setReturnToModal('edit');
    } else if (fromModal === 'upload') {
      setIsUploadModalOpen(false);
      setReturnToModal('upload');
    } else {
      setReturnToModal(null);
    }
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    if (returnToModal === 'edit') {
      setIsEditModalOpen(true);
      setReturnToModal(null);
    } else if (returnToModal === 'upload') {
      setIsUploadModalOpen(true);
      setReturnToModal(null);
    }
  };

  useEffect(() => {
    if (projects.length === 0) return;

    // 1. Migrasi otomatis branding -> Logo & frontend -> Front-End Project jika masih ada di DB
    const hasBranding = projects.some(p => (p.category || '').toLowerCase() === 'branding');
    const hasFrontend = projects.some(p => {
      const c = (p.category || '').toLowerCase();
      return c === 'frontend' || c === 'front end';
    });

    if (hasBranding) {
      renameCategory('branding', 'Logo').catch(console.error);
    }
    if (hasFrontend) {
      renameCategory('frontend', 'Front-End Project').catch(console.error);
    }

    // 2. Normalisasi state lokal
    setProjects(prev => prev.map(p => {
      const lower = (p.category || '').toLowerCase().trim();
      if (lower === 'branding') return { ...p, category: 'Logo' };
      if (lower === 'frontend' || lower === 'front end') return { ...p, category: 'Front-End Project' };
      return p;
    }));

    // 3. Hanya simpan kategori yang benar-benar dipakai oleh proyek (hapus yang tidak terpakai)
    setCategoriesList(prev => {
      const activeCategoryMap = new Map();
      projects.forEach(p => {
        if (!p.category) return;
        const raw = p.category.trim();
        const lower = raw.toLowerCase();
        let canonical = raw.charAt(0).toUpperCase() + raw.slice(1);
        if (lower === 'branding' || lower === 'logo') canonical = 'Logo';
        if (lower === 'frontend' || lower === 'front end' || lower === 'front-end project') canonical = 'Front-End Project';
        if (lower === 'uiux' || lower === 'ui/ux project') canonical = 'UI/UX Project';
        
        if (!activeCategoryMap.has(canonical.toLowerCase())) {
          activeCategoryMap.set(canonical.toLowerCase(), canonical);
        }
      });

      // Tetap sediakan kategori yang sedang dibuat manual jika ada
      prev.forEach(c => {
        if (c && !activeCategoryMap.has(c.toLowerCase())) {
          // Hanya pertahankan jika belum ada proyek sama sekali
        }
      });

      const activeList = Array.from(activeCategoryMap.values()).sort((a, b) => a.localeCompare(b));
      if (activeList.length > 0) {
        setStoredCategories(activeList);
        return activeList;
      }
      return prev;
    });
  }, [projects.length]);

  const handleAddCategory = () => {
    const val = newCategoryInput.trim();
    if (!val) { toast.error('Masukkan nama kategori.'); return; }
    if (categoriesList.some(c => c.toLowerCase() === val.toLowerCase())) {
      toast.error(`Kategori "${val}" sudah ada.`);
      return;
    }
    const next = [...categoriesList, val];
    setCategoriesList(next);
    setStoredCategories(next);
    setNewCategoryInput('');
    toast.success(`Kategori "${val}" berhasil ditambahkan.`);
  };

  const handleSaveEditCategory = async () => {
    if (!editingCategory) return;
    const oldName = editingCategory.name;
    const newName = editingCategory.value.trim();
    if (!newName) { toast.error('Nama kategori tidak boleh kosong.'); return; }
    if (newName.toLowerCase() === oldName.toLowerCase()) { setEditingCategory(null); return; }
    if (categoriesList.some(c => c.toLowerCase() === newName.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
      toast.error(`Kategori "${newName}" sudah ada.`);
      return;
    }

    try {
      const count = projects.filter(p => (p.category || '').toLowerCase() === oldName.toLowerCase()).length;
      if (count > 0) {
        await renameCategory(oldName, newName);
      }

      const updated = categoriesList.map(c => c.toLowerCase() === oldName.toLowerCase() ? newName : c);
      setCategoriesList(updated);
      setStoredCategories(updated);

      setProjects(prev => prev.map(p => {
        if ((p.category || '').toLowerCase() === oldName.toLowerCase()) {
          return { ...p, category: newName };
        }
        return p;
      }));

      if (uploadForm.category?.toLowerCase() === oldName.toLowerCase()) {
        setUploadForm(prev => ({ ...prev, category: newName }));
      }
      if (editForm.category?.toLowerCase() === oldName.toLowerCase()) {
        setEditForm(prev => ({ ...prev, category: newName }));
      }

      toast.success(`Kategori "${oldName}" diubah menjadi "${newName}".`);
      setEditingCategory(null);
    } catch (err) {
      toast.error(err.message || 'Gagal mengubah nama kategori.');
    }
  };

  const promptDeleteCategory = (cat, count) => {
    if (categoriesList.length <= 1) {
      toast.error('Minimal harus ada satu kategori tersisa.');
      return;
    }
    setCategoryToDelete({ name: cat, count });
  };

  const executeDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const catName = categoryToDelete.name;
    const count = categoryToDelete.count;
    const fallback = categoriesList.find(c => c.toLowerCase() !== catName.toLowerCase()) || 'Illustration';

    try {
      if (count > 0) {
        await deleteCategory(catName, fallback);
      }

      const updated = categoriesList.filter(c => c.toLowerCase() !== catName.toLowerCase());
      setCategoriesList(updated);
      setStoredCategories(updated);

      setProjects(prev => prev.map(p => {
        if ((p.category || '').toLowerCase() === catName.toLowerCase()) {
          return { ...p, category: fallback };
        }
        return p;
      }));

      if (uploadForm.category?.toLowerCase() === catName.toLowerCase()) {
        setUploadForm(prev => ({ ...prev, category: fallback }));
      }
      if (editForm.category?.toLowerCase() === catName.toLowerCase()) {
        setEditForm(prev => ({ ...prev, category: fallback }));
      }

      toast.success(`Kategori "${catName}" berhasil dihapus.`);
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus kategori.');
    } finally {
      setCategoryToDelete(null);
    }
  };

  const openFeaturedSort = () => {
    const featured = projects.filter(p => p.is_featured || p.isFeatured);
    setFeaturedProjects(featured);
    setGridSortType('featured');
    setIsFeaturedSortOpen(true);
  };

  const saveFeaturedOrder = async () => {
    setLoading(true);
    try {
      const now = Date.now();
      const updates = featuredProjects.map((p, i) => ({ 
        id: p.id, 
        created_at: new Date(now - i * 1000).toISOString() 
      }));
      await updateFeaturedOrder(updates);
      const newData = await fetchProjects();
      setProjects(newData);
      toast.success('Urutan Featured berhasil disimpan!');
      setIsFeaturedSortOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelection = (files, isEdit, append = false) => {
    if (!files || !Array.isArray(files) || files.length === 0) return;

    // 1. Filter hanya gambar web valid & abaikan file sistem / sampah OS
    const isSupportedWebImage = (f) => {
      if (!f || f.size === 0) return false;
      const name = f.name.toLowerCase();
      const path = (f.webkitRelativePath || f.name).toLowerCase();
      
      // Abaikan file sistem / OS junk
      if (
        name.startsWith('.') ||
        name.startsWith('~$') ||
        path.includes('__macosx') ||
        path.includes('.ds_store') ||
        name === 'thumbs.db' ||
        name === 'ehthumbs.db' ||
        name === 'desktop.ini'
      ) {
        return false;
      }

      // Validasi ekstensi gambar web
      const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif', 'bmp', 'jfif'];
      const extMatch = name.match(/\.([a-z0-9]+)$/i);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      
      return validExtensions.includes(ext);
    };

    const validFiles = files.filter(isSupportedWebImage);

    if (validFiles.length === 0) {
      toast.error('Gagal: Tidak ada gambar format web yang valid (JPG, PNG, WEBP, GIF, SVG, AVIF, JFIF) ditemukan.');
      return;
    }

    // 2. Urutkan file secara natural (thumb/cover didahulukan, lalu urutan angka natural)
    const sorted = [...validFiles].sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aIsThumb = aName.includes('thumb') || aName.includes('cover');
      const bIsThumb = bName.includes('thumb') || bName.includes('cover');

      if (aIsThumb && !bIsThumb) return -1;
      if (!aIsThumb && bIsThumb) return 1;

      return aName.localeCompare(bName, undefined, { numeric: true, sensitivity: 'base' });
    });

    // 3. Simpan dengan preview URL yang stabil (tidak re-create setiap render)
    if (isEdit) {
      const newItems = sorted.map(file => ({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        type: 'file',
        data: file,
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
      setEditImages(prev => append ? [...prev, ...newItems] : newItems);
    } else {
      const newItems = sorted.map(file => ({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        file: file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
      setImageFiles(prev => append ? [...prev, ...newItems] : newItems);
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

  const handleLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_auth');
    navigate('/zaqlyneroth');
  };

  const handleBackToHome = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    localStorage.removeItem('admin_auth');
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };



  const removeImage = (index, isEdit) => {
    if (isEdit) {
      setEditImages(prev => {
        const item = prev[index];
        if (item?.preview && item.preview.startsWith('blob:')) {
          try { URL.revokeObjectURL(item.preview); } catch {}
        }
        return prev.filter((_, i) => i !== index);
      });
      setEditForm(prev => ({
        ...prev,
        imageLabels: prev.imageLabels ? prev.imageLabels.filter((_, i) => i !== index) : []
      }));
    } else {
      setImageFiles(prev => {
        const item = prev[index];
        if (item?.preview && item.preview.startsWith('blob:')) {
          try { URL.revokeObjectURL(item.preview); } catch {}
        }
        return prev.filter((_, i) => i !== index);
      });
      setUploadForm(prev => ({
        ...prev,
        imageLabels: prev.imageLabels ? prev.imageLabels.filter((_, i) => i !== index) : []
      }));
    }
  };

  const handleDragSort = (isEdit = false) => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const swap = (prev) => {
      if (!Array.isArray(prev)) return prev;
      if (from < 0 || from >= prev.length || to < 0 || to >= prev.length) return prev;
      const arr = [...prev];
      const [removed] = arr.splice(from, 1);
      if (removed === undefined) return prev;
      arr.splice(to, 0, removed);
      return arr;
    };

    if (isEdit) {
      setEditImages(swap);
      setEditForm(prev => ({ ...prev, imageLabels: swap(prev.imageLabels || []) }));
    } else {
      setImageFiles(swap);
      setUploadForm(prev => ({ ...prev, imageLabels: swap(prev.imageLabels || []) }));
    }
    dragItem.current = null;
    dragOverItem.current = null;
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
      if (!file || !(file instanceof Blob)) {
        resolve(file);
        return;
      }
      if (file.type === 'image/gif' || file.type === 'image/svg+xml' || file.name?.endsWith('.svg') || file.name?.endsWith('.gif')) {
        resolve(file);
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const scale = Math.min(1, maxWidth / (img.width || maxWidth));
          const canvas = document.createElement('canvas');
          canvas.width = (img.width || maxWidth) * scale;
          canvas.height = (img.height || maxWidth) * scale;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => resolve(blob ? new File([blob], file.name, { type: 'image/jpeg' }) : file), 'image/jpeg', quality);
          } else {
            resolve(file);
          }
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });

  const handleCancelUpload = () => {
    imageFiles.forEach(item => {
      if (item?.preview && item.preview.startsWith('blob:')) {
        try { URL.revokeObjectURL(item.preview); } catch {}
      }
    });
    setUploadForm({ title: '', category: 'illustration', description: '', year: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false, imageLabels: [] });
    setImageFiles([]);
    setIsUploadModalOpen(false);
  };

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (imageFiles.length === 0) { toast.error('Pilih gambar terlebih dahulu.'); return; }
    if (!uploadForm.title?.trim()) { toast.error('Judul wajib diisi.'); return; }
    if (!uploadForm.category?.trim()) { toast.error('Kategori wajib diisi.'); return; }
    setLoading(true);
    try {
      const isDevProject = isDevCategory(uploadForm.category);
      const uploadedUrls = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const item = imageFiles[i];
        const file = item.file || item;
        const compressed = await compressImage(file);
        const url = await uploadProjectImage(compressed);
        const cleanUrl = url.includes('|') ? url.split('|').pop().trim() : url.trim();
        const customLabel = isDevProject && uploadForm.imageLabels?.[i]
          ? uploadForm.imageLabels[i].replace(/,/g, ' - ').replace(/\|/g, '-').trim()
          : '';
        uploadedUrls.push(customLabel ? `${customLabel}|${cleanUrl}` : cleanUrl);
      }

      const publicUrl = uploadedUrls.join(',');
      const parsedTags = uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean);

      const projectData = {
        title: uploadForm.title.trim(),
        category: uploadForm.category.trim(),
        description: isCertCategory(uploadForm.category) && uploadForm.year ? `${uploadForm.description} - ${uploadForm.year}` : uploadForm.description,
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

      const uploadCatTrim = uploadForm.category.trim();
      if (uploadCatTrim && !categoriesList.some(c => c.toLowerCase() === uploadCatTrim.toLowerCase())) {
        const next = [...categoriesList, uploadCatTrim];
        setCategoriesList(next);
        setStoredCategories(next);
      }

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
    if (!editForm.title?.trim()) { toast.error('Judul wajib diisi.'); return; }
    if (!editForm.category?.trim()) { toast.error('Kategori wajib diisi.'); return; }
    setLoading(true);
    try {
      const isDevProject = isDevCategory(editForm.category);
      const parsedTags = editForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      const projectData = {
        title: editForm.title.trim(),
        category: editForm.category.trim(),
        description: isCertCategory(editForm.category) && editForm.year ? `${editForm.description} - ${editForm.year}` : editForm.description,
        tags: parsedTags,
        techStack: editForm.techStack ? editForm.techStack.split(',').map(t => t.trim()).filter(Boolean) : [],
        liveUrl: editForm.liveUrl,
        githubUrl: editForm.githubUrl,
        isFeatured: editForm.isFeatured,
      };

      const finalUrls = [];
      for (let i = 0; i < editImages.length; i++) {
        const item = editImages[i];
        let rawUrl = '';
        if (item.type === 'file') {
          const compressed = await compressImage(item.data || item.file);
          rawUrl = await uploadProjectImage(compressed);
        } else {
          rawUrl = item.url || item.data || item.preview || '';
        }
        const cleanUrl = rawUrl.includes('|') ? rawUrl.split('|').pop().trim() : rawUrl.trim();
        const customLabel = isDevProject && editForm.imageLabels?.[i]
          ? editForm.imageLabels[i].replace(/,/g, ' - ').replace(/\|/g, '-').trim()
          : '';
        finalUrls.push(customLabel ? `${customLabel}|${cleanUrl}` : cleanUrl);
      }
      projectData.image_url = finalUrls.join(',');

      await updateProject(editingId, projectData);

      const editCatTrim = editForm.category.trim();
      if (editCatTrim && !categoriesList.some(c => c.toLowerCase() === editCatTrim.toLowerCase())) {
        const next = [...categoriesList, editCatTrim];
        setCategoriesList(next);
        setStoredCategories(next);
      }

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
    let desc = project.description || '';
    let year = '';
    // Support both old slash format and new dash format for backwards compatibility
    if (project.category === 'certificate') {
      if (desc.includes(' - ')) {
        const parts = desc.split(' - ');
        year = parts.pop();
        desc = parts.join(' - ');
      } else if (desc.includes(' / ')) {
        const parts = desc.split(' / ');
        year = parts.pop();
        desc = parts.join(' / ');
      }
    }
    setEditForm({
      title: project.title,
      category: project.category,
      description: desc,
      year: year,
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
      techStack: Array.isArray(project.tech_stack || project.techStack) ? (project.tech_stack || project.techStack).join(', ') : '',
      liveUrl: project.live_url || project.liveUrl || '',
      githubUrl: project.github_url || project.githubUrl || '',
      isFeatured: project.is_featured || project.isFeatured || false,
      imageLabels: [],
    });
    setEditingId(project.id);
    setEditingProject(project);
    const parsed = parseProjectImages(project.image_url || project.image || '');
    const existingImgs = [];
    const existingLabels = [];
    parsed.forEach((item) => {
      existingLabels.push(item.label || '');
      existingImgs.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        type: 'url',
        data: item.url,
        url: item.url,
        preview: item.url,
        name: 'Project Image',
      });
    });
    setEditImages(existingImgs);
    setEditForm(prev => ({ ...prev, imageLabels: existingLabels }));
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    editImages.forEach(item => {
      if (item?.preview && item.preview.startsWith('blob:')) {
        try { URL.revokeObjectURL(item.preview); } catch {}
      }
    });
    setEditForm({ title: '', category: 'illustration', description: '', tags: '', techStack: '', liveUrl: '', githubUrl: '', isFeatured: false, imageLabels: [] });
    setEditingId(null);
    setEditingProject(null);
    setEditImages([]);
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

  const filtered = projects.filter(p => {
    const matchesSearch = !searchQuery || p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (p.category || '').toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });


  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Toaster position="top-center" />
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBackToHome} className="text-[#0071e3] hover:underline text-sm font-medium flex items-center gap-1">
              <ArrowLeft size={14} /> Beranda
            </button>
            <span className="text-[#d2d2d7]">|</span>
            <h1 className="text-sm font-bold text-[#1d1d1f]">Admin</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-medium text-[#86868b] hover:text-red-500 transition-colors">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <div className="flex flex-col gap-6 mb-8">
            {/* Header: Judul & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#1d1d1f] tracking-tight">
                Proyek <span className="text-[#86868b] font-normal text-lg">({filtered.length})</span>
              </h2>

              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => handleOpenCategoryManager(null)} className="px-4 py-2.5 bg-white border border-[#d2d2d7] hover:border-[#0071e3] text-[#1d1d1f] hover:text-[#0071e3] font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm whitespace-nowrap">
                  <Tags size={17} />
                  Kelola Kategori
                </button>
                <button onClick={openFeaturedSort} className="px-4 py-2.5 bg-white border border-[#d2d2d7] hover:border-[#0071e3] text-[#1d1d1f] hover:text-[#0071e3] font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 text-sm whitespace-nowrap">
                  <LayoutGrid size={17} />
                  Urutkan Featured
                </button>
                <button onClick={() => setIsUploadModalOpen(true)} className="px-5 py-2.5 bg-[#1d1d1f] hover:bg-black text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-xl flex items-center gap-2 text-sm whitespace-nowrap">
                  <Plus size={17} />
                  Tambah Proyek
                </button>
              </div>
            </div>

            {/* Search Bar & Custom Category Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
                <input
                  type="text"
                  placeholder="Cari proyek berdasarkan judul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#d2d2d7] rounded-xl text-[#1d1d1f] text-sm outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all placeholder:text-[#86868b]"
                />
              </div>

              {/* Custom Apple-style Category Dropdown */}
              <CategoryFilterDropdown
                categories={categoriesList}
                projects={projects}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {initialLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-white/10 rounded-xl flex-shrink-0"></div>
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                    <div className="flex gap-3 self-end">
                      <div className="h-4 w-4 bg-white/10 rounded"></div>
                      <div className="h-4 w-4 bg-white/10 rounded"></div>
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
                        src={getFirstProjectImage(project.image_url || project.image)}
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
                    <div className="text-center">
                      <p className="text-[#86868b] text-sm">
                        {searchQuery || selectedCategory !== 'all' ? (
                          <>
                            Tidak ada proyek {selectedCategory !== 'all' ? `di kategori "${selectedCategory}"` : ''} {searchQuery ? `dengan kata kunci "${searchQuery}"` : ''}.
                          </>
                        ) : (
                          'Belum ada project.'
                        )}
                      </p>
                      {(searchQuery || selectedCategory !== 'all') && (
                        <button
                          type="button"
                          onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                          className="mt-3 px-4 py-1.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-semibold text-xs rounded-lg transition-colors"
                        >
                          Reset Filter
                        </button>
                      )}
                    </div>
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
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
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

            <div className="p-6 overflow-y-auto minimal-scrollbar flex-grow">
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                      Gambar Project
                    </label>
                    <div className="flex items-center gap-3">
                      {imageFiles.length > 0 && (
                        <div className="flex gap-3">
                          <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('append-upload-file').click(); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1">
                            <Plus size={14} /> Tambah File
                          </button>
                          <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('append-upload-folder').click(); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1">
                            <Plus size={14} /> Tambah Folder
                          </button>
                        </div>
                      )}
                      {imageFiles.length > 1 && (
                        <button type="button" onClick={() => { setGridSortType('upload'); setIsGridSortOpen(true); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1 border-l border-[#d2d2d7] pl-3">
                          <LayoutGrid size={14} /> Edit Susunan
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      multiple={true}
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), false); e.target.value = ''; }}
                      className="hidden"
                      id="file-upload"
                    />
                    <input
                      type="file"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), false); e.target.value = ''; }}
                      className="hidden"
                      id="folder-upload"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      multiple={true}
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), false, true); e.target.value = ''; }}
                      className="hidden"
                      id="append-upload-file"
                    />
                    <input
                      type="file"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), false, true); e.target.value = ''; }}
                      className="hidden"
                      id="append-upload-folder"
                    />
                    <div
                      className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-[#d2d2d7] rounded-2xl bg-[#f5f5f7] transition-all overflow-hidden relative"
                    >
                      {imageFiles.length > 0 ? (
                        <>
                          <div
                            className="flex w-full h-full overflow-x-auto gap-2 p-2"
                            onDragOver={handleDragOverScroll}
                          >
                            {imageFiles.map((item, i) => (
                              <div
                                key={item.id || i}
                                className="relative h-full shrink-0 group/img cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => { e.stopPropagation(); dragItem.current = i; }}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); dragOverItem.current = i; }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDragEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleDragSort(false); }}
                              >
                                <img src={item.preview} alt={item.name || 'Preview'} className="h-full w-auto object-contain rounded-lg pointer-events-none" draggable={false} />
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

                <FormFields form={uploadForm} setForm={setUploadForm} imageCount={imageFiles.length} categoriesList={categoriesList} onManageCategories={() => handleOpenCategoryManager('upload')} />

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
              className="flex-1 overflow-y-auto minimal-scrollbar p-6 md:p-8"
              onDragOver={handleDragOverScrollVertical}
              onWheel={(e) => { if (dragItem.current !== null) e.currentTarget.scrollBy({ top: e.deltaY, behavior: 'auto' }); }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {(gridSortType === 'upload' ? imageFiles : editImages).map((item, i) => {
                  const isEdit = gridSortType !== 'upload';
                  const src = item.preview || '';

                  return (
                    <div
                      key={item.id || i}
                      data-grid-index={i}
                      className={`relative aspect-square bg-white rounded-2xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing group border-2 transition-all ${
                        activeDragIndex === i
                          ? 'opacity-30 scale-95 border-[#0071e3]'
                          : dragOverIndex === i
                          ? 'border-[#0071e3] ring-2 ring-[#0071e3]/40 scale-105'
                          : 'border-transparent hover:border-[#0071e3]/30'
                      }`}
                      onPointerDown={(e) => handlePointerDown(e, i)}
                    >
                      <img src={src} alt={item.name || `Grid Item ${i + 1}`} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                      <div className="absolute top-2 left-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1d1d1f] text-xs font-bold shadow-sm pointer-events-none">
                        {i + 1}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewImage(src); }}
                        title="Preview Full Image"
                        onPointerDown={(e) => e.stopPropagation()}
                        className="absolute top-2 right-10 p-1.5 bg-white/90 backdrop-blur-sm text-[#0071e3] hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(i, isEdit); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-[#1d1d1f] hover:text-red-500 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
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


      {/* ===== CATEGORY MANAGER MODAL ===== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={handleCloseCategoryModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#f5f5f7]">
              <div>
                <h2 className="text-xl font-bold text-[#1d1d1f] flex items-center gap-2 tracking-tight">
                  <Tags size={18} className="text-[#0071e3]" />
                  Kelola Kategori
                </h2>
                <p className="text-xs text-[#86868b] mt-0.5">Ubah nama, tambah, atau hapus kategori apapun</p>
              </div>
              <button onClick={handleCloseCategoryModal} className="p-2 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto minimal-scrollbar flex-grow space-y-6">
              {/* Tambah Kategori Baru */}
              <div>
                <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                  Tambah Kategori Baru
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Contoh: 3D Art, Mural, Packaging..."
                    className={inputClass}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-5 bg-[#1d1d1f] hover:bg-black text-white text-sm font-semibold rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5"
                  >
                    <Plus size={16} /> Tambah
                  </button>
                </div>
              </div>

              {/* List Semua Kategori */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                    Daftar Semua Kategori ({categoriesList.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const inUse = categoriesList.filter(cat => 
                        projects.some(p => (p.category || '').toLowerCase() === cat.toLowerCase())
                      );
                      const cleaned = inUse.length > 0 ? inUse : categoriesList.slice(0, 1);
                      setCategoriesList(cleaned);
                      setStoredCategories(cleaned);
                      toast.success('Kategori yang tidak digunakan berhasil dibersihkan.');
                    }}
                    className="text-xs text-[#0071e3] hover:underline font-semibold"
                  >
                    Bersihkan Yang Tidak Dipakai
                  </button>
                </div>

                {categoriesList.length === 0 ? (
                  <div className="text-center py-8 bg-[#f5f5f7] rounded-2xl border border-dashed border-[#d2d2d7]">
                    <p className="text-sm text-[#86868b]">Belum ada kategori tersimpan.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categoriesList.map((cat) => {
                      const count = projects.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase()).length;
                      const isEditing = editingCategory?.name === cat;

                      return (
                        <div
                          key={cat}
                          className="flex items-center justify-between p-3.5 bg-[#f5f5f7] border border-[#d2d2d7]/60 rounded-xl gap-2"
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={editingCategory.value}
                                onChange={(e) => setEditingCategory({ ...editingCategory, value: e.target.value })}
                                className="flex-1 px-3 py-1.5 bg-white border border-[#0071e3] rounded-lg text-sm outline-none font-medium"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') { e.preventDefault(); handleSaveEditCategory(); }
                                  if (e.key === 'Escape') { setEditingCategory(null); }
                                }}
                              />
                              <button
                                type="button"
                                onClick={handleSaveEditCategory}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Simpan"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="p-2 text-[#86868b] hover:bg-black/5 rounded-lg transition-colors"
                                title="Batal"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-sm text-[#1d1d1f] truncate">{cat}</span>
                                  <span className="text-[11px] text-[#86868b] bg-white px-2 py-0.5 rounded-full border border-[#d2d2d7]/50 font-medium">
                                    {count} proyek
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingCategory({ name: cat, value: cat })}
                                  className="p-2 text-[#86868b] hover:text-[#0071e3] hover:bg-white rounded-lg transition-colors"
                                  title="Edit Nama Kategori"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => promptDeleteCategory(cat, count)}
                                  className="p-2 text-[#86868b] hover:text-red-500 hover:bg-white rounded-lg transition-colors"
                                  title="Hapus Kategori"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#f5f5f7] border-t border-[#d2d2d7]/50 flex justify-end">
              <button
                type="button"
                onClick={handleCloseCategoryModal}
                className="px-6 py-2.5 bg-[#1d1d1f] hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
              >
                {returnToModal ? 'Selesai & Kembali' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY DELETE CONFIRMATION MODAL (NO BROWSER ALERT) */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setCategoryToDelete(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Hapus Kategori?</h3>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Hapus kategori <span className="font-bold text-[#1d1d1f]">"{categoryToDelete.name}"</span>?
                {categoryToDelete.count > 0 ? (
                  <span className="block text-amber-600 font-medium text-xs mt-2 bg-amber-50 py-1.5 px-3 rounded-lg border border-amber-200/60">
                    ⚠️ {categoryToDelete.count} proyek terkait akan dialihkan ke kategori lain agar tidak hilang.
                  </span>
                ) : (
                  <span className="block text-[#86868b] text-xs mt-1">
                    Kategori ini tidak sedang digunakan oleh proyek manapun.
                  </span>
                )}
              </p>
            </div>
            <div className="flex border-t border-[#f5f5f7]">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-4 text-sm font-semibold text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-colors border-r border-[#f5f5f7]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteCategory}
                className="flex-1 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
{/* ===== EDIT MODAL ===== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCancelEdit}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
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
            <div className="p-6 overflow-y-auto minimal-scrollbar flex-grow">
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Edit Image Upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                      Ganti Gambar Project
                    </label>
                    <div className="flex items-center gap-3">
                      {editImages.length > 0 && (
                        <div className="flex gap-3">
                          <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('edit-append-file').click(); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1">
                            <Plus size={14} /> Tambah File
                          </button>
                          <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById('edit-append-folder').click(); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1">
                            <Plus size={14} /> Tambah Folder
                          </button>
                        </div>
                      )}
                      {editImages.length > 1 ? (
                        <button type="button" onClick={() => { setGridSortType('edit'); setIsGridSortOpen(true); }} className="text-xs text-[#0071e3] hover:underline font-semibold flex items-center gap-1 border-l border-[#d2d2d7] pl-3">
                          <LayoutGrid size={14} /> Edit Susunan
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="relative group mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple={true}
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), true); e.target.value = ''; }}
                      className="hidden"
                      id="edit-file-upload"
                    />
                    <input
                      type="file"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), true); e.target.value = ''; }}
                      className="hidden"
                      id="edit-folder-upload"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      multiple={true}
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), true, true); e.target.value = ''; }}
                      className="hidden"
                      id="edit-append-file"
                    />
                    <input
                      type="file"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={(e) => { handleFileSelection(Array.from(e.target.files), true, true); e.target.value = ''; }}
                      className="hidden"
                      id="edit-append-folder"
                    />
                    <div
                      className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed border-[#d2d2d7] rounded-2xl bg-[#f5f5f7] transition-all overflow-hidden relative"
                    >
                      {editImages.length > 0 ? (
                        <>
                          <div
                            className="flex w-full h-full overflow-x-auto gap-2 p-2"
                            onDragOver={handleDragOverScroll}
                          >
                            {editImages.map((item, i) => {
                              const src = item.preview || '';
                              return (
                              <div
                                key={item.id || i}
                                className="relative h-full shrink-0 group/img cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => { e.stopPropagation(); dragItem.current = i; }}
                                onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); dragOverItem.current = i; }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                onDragEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleDragSort(true); }}
                              >
                                <img src={src} alt={item.name || 'Preview'} className="h-full w-auto object-contain rounded-lg pointer-events-none" draggable={false} />
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeImage(i, true); }} className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-[#1d1d1f] hover:text-red-500 hover:bg-white rounded-full shadow-md opacity-0 group-hover/img:opacity-100 transition-all z-10">
                                  <X size={14} />
                                </button>
                              </div>
                            )})}
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

                <FormFields form={editForm} setForm={setEditForm} isEdit imageCount={editImages.length} categoriesList={categoriesList} onManageCategories={() => handleOpenCategoryManager('edit')} />
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
                Apakah Anda yakin ingin menghapus <br /><span className="font-semibold text-[#1d1d1f]">"{projectToDelete.title}"</span>?<br />Tindakan ini tidak dapat dibatalkan.
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
      {/* ===== FEATURED SORT MODAL ===== */}
      {isFeaturedSortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col p-4 md:p-8 bg-white/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#f5f5f7]">
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-[#f5f5f7]">
              <div>
                <h2 className="text-2xl font-bold text-[#1d1d1f]">Urutkan Project Beranda</h2>
                <p className="text-sm text-[#86868b] mt-1">Geser project untuk mengatur urutan penampilannya di halaman depan</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsFeaturedSortOpen(false)} className="px-6 py-2.5 bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-semibold rounded-xl transition-all text-sm">
                  Batal
                </button>
                <button onClick={saveFeaturedOrder} disabled={loading} className="px-8 py-2.5 bg-[#0071e3] hover:bg-[#0077ED] text-white font-semibold rounded-xl transition-all text-sm shadow-md shadow-[#0071e3]/20 flex items-center gap-2">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Simpan Urutan
                </button>
              </div>
            </div>
            
            <div
              className="flex-1 overflow-y-auto minimal-scrollbar p-6 md:p-8"
              onDragOver={handleDragOverScrollVertical}
              onWheel={(e) => { if (dragItem.current !== null) e.currentTarget.scrollBy({ top: e.deltaY, behavior: 'auto' }); }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredProjects.map((project, i) => {
                  const coverImage = getFirstProjectImage(project.image_url || project.image);
                  return (
                    <div
                      key={project.id}
                      data-grid-index={i}
                      className={`relative aspect-square bg-white rounded-2xl shadow-sm overflow-hidden cursor-grab active:cursor-grabbing group border-2 transition-all ${
                        activeDragIndex === i
                          ? 'opacity-30 scale-95 border-[#0071e3]'
                          : dragOverIndex === i
                          ? 'border-[#0071e3] ring-2 ring-[#0071e3]/40 scale-105'
                          : 'border-[#e8e8ed] hover:border-[#0071e3]/50'
                      }`}
                      onPointerDown={(e) => handlePointerDown(e, i)}
                    >
                      <img src={coverImage} alt={project.title} className="w-full h-full object-cover pointer-events-none" draggable={false} />
                      <div className="absolute top-2 left-2 w-7 h-7 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#1d1d1f] text-xs font-bold shadow-sm pointer-events-none">
                        {i + 1}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                        <p className="text-white text-xs font-bold truncate drop-shadow-md">{project.title}</p>
                        <p className="text-white/80 text-[10px] uppercase font-bold tracking-wider">{project.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW LIGHTBOX */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            onClick={() => setPreviewImage(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={previewImage} 
            alt="Preview Full" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
