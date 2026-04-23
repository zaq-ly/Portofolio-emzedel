import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { Upload, Plus, LogOut, Loader2, CheckCircle2, AlertCircle, Trash2, LayoutGrid, MessageSquare, Mail as MailIcon } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' or 'messages'
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: 'illustration',
    description: '',
    tags: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  useEffect(() => {
    fetchProjects();
    fetchMessages();
    // ... (realtime logic remains)

    // Mengaktifkan Realtime Subscription
    const projectsChannel = supabase
      .channel('projects-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    const messagesChannel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetch projects:', error);
    }
    if (data) setProjects(data);
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: sortOrder === 'asc' });
    
    if (error) {
      console.error('Error fetch messages:', error);
      setStatus({ type: 'error', message: `Gagal mengambil pesan: ${error.message}` });
    } else {
      setMessages(data || []);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [sortOrder]);

  // Auto-dismiss status alert setelah 5 detik
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleUpload = async (e) => {
    // ... (upload logic)
    e.preventDefault();
    if (!imageFile) {
      setStatus({ type: 'error', message: 'Silakan pilih gambar terlebih dahulu.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('projects')
        .insert([{
          title: form.title,
          category: form.category,
          description: form.description,
          image_url: publicUrl,
          tags: form.tags.split(',').map(tag => tag.trim()),
        }]);

      if (insertError) throw insertError;

      setStatus({ type: 'success', message: 'Karya berhasil diupload!' });
      setForm({ title: '', category: 'illustration', description: '', tags: '' });
      setImageFile(null);
      fetchProjects();
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
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

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Hapus pesan ini?')) return;
    try {
      await supabase.from('messages').delete().eq('id', id);
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAllMessages = async () => {
    if (!window.confirm('HAPUS SEMUA PESAN? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('messages')
        .delete()
        .neq('id', 0); // Delete all rows where id != 0 (standard trick)
      
      if (error) throw error;
      fetchMessages();
      setStatus({ type: 'success', message: 'Semua pesan telah dihapus.' });
    } catch (error) {
      setStatus({ type: 'error', message: `Gagal menghapus semua pesan: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Kelola portofolio dan lihat pesan masuk</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 bg-dark-card border border-dark-border hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 rounded-xl transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-dark-card p-1 rounded-2xl border border-dark-border mb-8 max-w-sm">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'projects' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <LayoutGrid size={18} />
            Portofolio
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all relative ${
              activeTab === 'messages' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <MessageSquare size={18} />
            Pesan
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {messages.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'projects' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <div className="bg-dark-card border border-dark-border p-6 rounded-3xl sticky top-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-primary" />
                  Tambah Karya Baru
                </h2>

                {status.message && (
                  <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm ${
                    status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
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
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-dark-border group-hover:border-primary/50 rounded-2xl cursor-pointer bg-dark/50 transition-all overflow-hidden"
                      >
                        {imageFile ? (
                          <div className="text-center p-4">
                            <p className="text-xs text-primary font-bold truncate max-w-[200px]">{imageFile.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1">Klik untuk ganti</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="text-gray-500 mb-2 group-hover:text-primary" size={24} />
                            <span className="text-xs text-gray-500 font-medium">Klik atau drop file</span>
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
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      className="w-full px-4 py-3 bg-dark border border-dark-border focus:border-primary outline-none rounded-xl text-sm"
                      placeholder="Contoh: Logo Branding ABC"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategori</label>
                    <select 
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full px-4 py-3 bg-dark border border-dark-border focus:border-primary outline-none rounded-xl text-sm appearance-none"
                    >
                      <option value="illustration">Illustration</option>
                      <option value="branding">Branding</option>
                      <option value="vector">Vector</option>
                      <option value="print">Print</option>
                      <option value="graffiti">Graffiti</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tags (Pisahkan dengan koma)</label>
                    <input 
                      type="text" 
                      value={form.tags}
                      onChange={(e) => setForm({...form, tags: e.target.value})}
                      className="w-full px-4 py-3 bg-dark border border-dark-border focus:border-primary outline-none rounded-xl text-sm"
                      placeholder="Digital Art, Logo, Figma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Deskripsi</label>
                    <textarea 
                      rows="3"
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      className="w-full px-4 py-3 bg-dark border border-dark-border focus:border-primary outline-none rounded-xl text-sm resize-none"
                      placeholder="Jelaskan sedikit tentang karya ini..."
                    ></textarea>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Upload Karya"}
                  </button>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-6">Daftar Karya Anda ({projects.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-dark-card border border-dark-border p-4 rounded-2xl flex gap-4 group">
                    <div className="w-20 h-20 bg-dark rounded-xl overflow-hidden flex-shrink-0">
                      <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm truncate">{project.title}</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{project.category}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(project.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors self-end"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-dark-card border border-dark-border border-dashed rounded-3xl">
                    <p className="text-gray-500">Belum ada karya yang diupload.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Messages Tab Content */
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MailIcon className="text-primary" size={20} />
                Pesan Masuk ({messages.length})
              </h2>
              
              <div className="flex items-center gap-3">
                {/* Sort Toggle */}
                <button 
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-dark-border rounded-xl text-xs font-bold hover:bg-dark-border transition-all"
                >
                  {sortOrder === 'desc' ? 'Terbaru First' : 'Terlama First'}
                </button>
                
                {/* Delete All Button */}
                {messages.length > 0 && (
                  <button 
                    onClick={handleDeleteAllMessages}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                    Hapus Semua
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-dark-card border border-dark-border p-6 rounded-3xl relative group">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-white">{msg.full_name}</h3>
                      <p className="text-primary text-sm">{msg.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}</p>
                    </div>
                  </div>
                  <div className="bg-dark/50 p-4 rounded-xl border border-dark-border/50 mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Subjek: {msg.subject}</p>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="absolute top-6 right-6 md:opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Hapus Pesan"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="py-20 text-center bg-dark-card border border-dark-border border-dashed rounded-3xl">
                  <p className="text-gray-500">Kotak masuk kosong. Belum ada pesan dari pengunjung.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

