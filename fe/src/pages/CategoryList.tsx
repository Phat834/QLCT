import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function CategoryList() {
  const { categories, refetch } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (editingId) {
        const res = await fetch(`http://localhost:3000/api/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
          throw new Error(err.error || res.statusText);
        }
      } else {
        const id = 'cat_' + Math.random().toString(36).slice(2, 8);
        const res = await fetch('http://localhost:3000/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
          throw new Error(err.error || res.statusText);
        }
      }
      resetForm();
      setShowModal(false);
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá danh mục này?')) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
        throw new Error(err.error || res.statusText);
      }
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setName(c.name);
    setShowModal(true);
    setError('');
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 bg-[#1a1f2b] border-gray-600 text-slate-200 font-sans focus:outline-none focus:border-cyan-500/50';

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-200 font-mono tracking-wide">Danh mục</h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium px-4 py-2 rounded-lg flex items-center gap-2 font-mono tracking-wide transition"
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="border border-cyan-500/30 bg-[#0d121c]/90 rounded-2xl shadow-xl shadow-cyan-950/20 p-5 flex items-center justify-between backdrop-blur-md hover:border-cyan-400 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 font-bold">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 font-mono">{c.name}</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEdit(c)}
                className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-[#1a1f2b] rounded-lg transition"
                title="Sửa"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-[#1a1f2b] rounded-lg transition"
                title="Xoá"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-slate-400 font-mono text-center py-8 col-span-3">Chưa có danh mục nào</p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0d121c] border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-950/30">
            <div className="flex justify-between items-center mb-5 border-b border-cyan-500/20 pb-3">
              <h3 className="text-xl font-bold text-cyan-300 font-mono uppercase tracking-widest">
                {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Tên danh mục</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
              {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium py-2.5 rounded-lg transition disabled:opacity-50 font-mono tracking-wide"
                >
                  {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Lưu'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2.5 border border-cyan-500/30 rounded-lg text-slate-300 font-mono hover:bg-cyan-950/30 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
