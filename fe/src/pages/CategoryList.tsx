import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function CategoryList() {
  const { categories, refetch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);
    try {
      if (editingId) {
        // Update existing category
        const res = await fetch(`http://localhost:3000/api/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, icon: icon || 'default-icon' }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
          throw new Error(err.error || res.statusText);
        }
      } else {
        // Create new category
        const id = 'cat_' + Math.random().toString(36).slice(2, 8);
        const res = await fetch('http://localhost:3000/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, name, icon: icon || 'default-icon' }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Lỗi không xác định' }));
          throw new Error(err.error || res.statusText);
        }
      }
      setName('');
      setIcon('');
      setEditingId(null); // Reset editing state
      setShowForm(false);
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xoá danh mục này?')) return;
    setError('');
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
    setIcon(c.icon || '');
    setShowForm(true); // Show form for editing
    setError('');
  };

  const resetForm = () => {
    setName('');
    setIcon('');
    setEditingId(null);
    setError('');
  };

  const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-white dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';
  const labelClass = 'block text-sm font-medium light:text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">Danh mục</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={16} /> Thêm
        </button>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={handleCreate} className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6 max-w-md space-y-4">
          <div>
            <label className={labelClass}>Tên danh mục</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Icon</label>
            <input value={icon} onChange={(e) => setIcon(e.target.value)} className={inputClass} placeholder="food-icon" />
          </div>
          {error && <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Lưu'}
            </button>
            <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="border light:border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg light:text-gray-700 dark:text-gray-300">Hủy</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
           <div key={c.id} className="light:bg-white dark:bg-gray-900 rounded-lg shadow p-5 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                 {c.name.charAt(0).toUpperCase()}
               </div>
               <div>
                 <h3 className="font-semibold light:text-gray-800 dark:text-white">{c.name}</h3>
               </div>
             </div>
             <div className="flex items-center gap-2">
                <button onClick={() => startEdit(c)} className="text-indigo-600 hover:text-indigo-800">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800">
                  <Trash2 size={16} />
                </button>
             </div>
           </div>
        ))}
        {categories.length === 0 && (
          <p className="light:text-gray-400 dark:text-gray-500 col-span-3 text-center py-8">Chưa có danh mục nào</p>
        )}
      </div>
    </div>
  );
}