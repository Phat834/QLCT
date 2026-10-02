import { useState, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import SortableList from '../components/SortableList';
import ConfirmModal from '../components/ConfirmModal';

export default function CategoryList() {
  const { categories, refetch, setCategories } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const handleReorderCategories = useCallback(async (newCategories: typeof categories) => {
    // Optimistic update: update UI immediately
    setCategories(newCategories);
    
    const items = newCategories.map((cat, index) => ({ id: cat.id, sortOrder: index }));
    try {
      await api.reorderCategories(items);
    } catch (err) {
      console.error('Reorder failed:', err);
      // Rollback on error
      await refetch();
    }
  }, [refetch, setCategories]);

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
        await api.updateCategory(editingId, { name });
      } else {
        const id = 'cat_' + Math.random().toString(36).slice(2, 8);
        await api.createCategory({ id, name });
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

  const openDeleteConfirm = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ open: false, id: '' });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    if (!id) return;
    closeDeleteConfirm();
    setLoading(true);
    try {
      await api.deleteCategory(id);
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

  const renderCategoryCard = (c: any) => (
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
          className="flex items-center gap-1.5 px-3 py-1.5 border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-mono text-sm rounded-lg hover:bg-cyan-500/20 transition"
          title="Sửa"
        >
          <Pencil size={14} /> Sửa
        </button>
        <button
          onClick={() => openDeleteConfirm(c.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/40 bg-red-500/10 text-red-400 font-mono text-sm rounded-lg hover:bg-red-500/20 transition"
          title="Xoá"
        >
          <Trash2 size={14} /> Xoá
        </button>
      </div>
    </div>
  );

  const inputClass = 'w-full border rounded-lg px-3 py-2 bg-[#1a1f2b] border-gray-600 text-slate-200 font-sans focus:outline-none focus:border-cyan-500/50';

  return (
    <div className="h-full max-w-full overflow-x-hidden flex flex-col bg-[#0b0e14] text-slate-200 font-sans">
      <div className="flex shrink-0 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-200 font-mono tracking-wide flex items-center gap-3">
          Danh mục
          <span className="text-sm font-normal text-slate-400 bg-[#1a1f2b] px-2 py-0.5 rounded font-mono">
            {categories.length}
          </span>
        </h2>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-[#0b0e14] font-medium px-4 py-2 rounded-lg flex items-center gap-2 font-mono tracking-wide transition"
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      <SortableList
        items={categories}
        getId={(c) => c.id}
        renderItem={renderCategoryCard}
        onReorder={handleReorderCategories}
        emptyMessage="Chưa có danh mục nào"
      />

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

      <ConfirmModal
        open={deleteConfirm.open}
        title="Xoá danh mục"
        message="Bạn có chắc chắn muốn xoá danh mục này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteConfirm}
        confirmText="Xoá"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
