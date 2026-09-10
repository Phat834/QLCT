import { useState, useEffect } from 'react';
import { Play, Plus, X, Pencil } from 'lucide-react';
import defaultLinks from '../data/youtubeLinks.json';

interface LinkItem {
  title: string;
  videoId: string;
  startSeconds: number;
}

const STORAGE_KEY = 'youtubeLinks';
const initialLinks: LinkItem[] = defaultLinks as LinkItem[];

function getStoredLinks(): LinkItem[] {
  if (typeof window === 'undefined') return initialLinks;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialLinks;
}

function saveLinks(links: LinkItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const timeToSeconds = (h: number, m: number, s: number): number =>
  h * 3600 + m * 60 + s;

const extractVideoId = (input: string): string => {
  const trimmed = input.trim();
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return trimmed;
};

const tryExtractTime = (input: string): { h: string; m: string; s: string } => {
  const timeMatch = input.match(/[?&]t=(\d+)/);
  if (timeMatch) {
    const totalSeconds = parseInt(timeMatch[1], 10);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h: String(h), m: String(m), s: String(s) };
  }
  return { h: '', m: '', s: '' };
};

const buildUrl = (item: LinkItem): string =>
  `https://www.youtube.com/watch?v=${item.videoId}&t=${item.startSeconds}s`;

const inputClass = 'w-full border rounded-lg px-3 py-2 light:bg-gray-100 dark:bg-gray-800 light:border-gray-300 dark:border-gray-600 light:text-gray-800 dark:text-white';

export default function YoutubeLinks() {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [urlOrId, setUrlOrId] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [error, setError] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    setLinks(getStoredLinks());
  }, []);

  const resetForm = () => {
    setTitle('');
    setUrlOrId('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setError('');
    setEditingIndex(null);
    setShowModal(false);
  };

  const handleUrlChange = (val: string) => {
    setUrlOrId(val);
    const extracted = tryExtractTime(val);
    if (extracted.h || extracted.m || extracted.s) {
      setHours(extracted.h || '0');
      setMinutes(extracted.m || '0');
      setSeconds(extracted.s || '0');
    }
  };

  const handleEdit = (index: number) => {
    const item = links[index];
    setTitle(item.title);
    setUrlOrId(item.videoId);
    setHours(String(Math.floor(item.startSeconds / 3600)));
    setMinutes(String(Math.floor((item.startSeconds % 3600) / 60)));
    setSeconds(String(item.startSeconds % 60));
    setEditingIndex(index);
    setShowModal(true);
    setError('');
  };

  const handleSubmit = () => {
    setError('');
    if (!title || !urlOrId) {
      setError('Vui lòng nhập tiêu đề và đường link / ID video!');
      return;
    }
    const h = parseInt(hours, 10) || 0;
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;

    if (m >= 60 || s >= 60) {
      setError('Phút và giây phải nhỏ hơn 60!');
      return;
    }

    const linkData: LinkItem = {
      title,
      videoId: extractVideoId(urlOrId),
      startSeconds: timeToSeconds(h, m, s),
    };

    let updated: LinkItem[];
    if (editingIndex !== null) {
      updated = [...links];
      updated[editingIndex] = linkData;
    } else {
      updated = [...links, linkData];
    }
    setLinks(updated);
    saveLinks(updated);
    resetForm();
  };

  const handleDelete = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    saveLinks(updated);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-500"><Play size={28} /></div>
          <h2 className="text-2xl font-bold light:text-gray-800 dark:text-black">VideoGA-CD</h2>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditingIndex(null); setError(''); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 font-medium"
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      <ul className="space-y-3">
        {links.map((l, i) => (
          <li
            key={i}
            className="light:bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm p-4 hover:border-gray-700 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="font-medium light:text-gray-800 dark:text-white">{l.title}</span>
              <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                {formatTime(l.startSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={buildUrl(l)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 group-hover:underline flex items-center gap-1"
              >
                <Play size={16} />
                Xem
              </a>
              <button
                onClick={() => handleEdit(i)}
                className="p-1 text-indigo-400 hover:text-indigo-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Sửa"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(i)}
                className="p-1 text-red-400 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Xoá"
              >
                <X size={14} />
              </button>
            </div>
          </li>
        ))}
        {links.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-center py-8">Chưa có video nào</p>
        )}
      </ul>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center mb-5 border-b dark:border-gray-800 pb-3">
              <h3 className="text-xl font-bold dark:text-white">{editingIndex !== null ? 'Cập nhật video' : 'Thêm video mới'}</h3>
              <button
                onClick={() => resetForm()}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Tiêu đề</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder=""
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Đường link hoặc ID video</label>
                <input
                  type="text"
                  value={urlOrId}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder=""
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Hỗ trợ paste URL đầy đủ hoặc chỉ nhập ID 11 ký tự
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Thời gian bắt đầu</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="hours"
                    className="w-16 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded light:text-gray-800 dark:text-white"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="min"
                    className="w-16 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded light:text-gray-800 dark:text-white"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    placeholder="sec"
                    className="w-16 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded light:text-gray-800 dark:text-white"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Tự động lấy thời gian từ URL nếu có
                </p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition"
                >
                  {editingIndex !== null ? 'Cập nhật' : 'Thêm video'}
                </button>
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="px-4 py-2.5 border rounded-lg dark:text-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
