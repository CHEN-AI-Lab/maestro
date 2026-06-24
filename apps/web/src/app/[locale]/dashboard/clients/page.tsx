'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  category: string | null;
  level: string | null;
  notes: string | null;
  createdAt: string;
}

const CATEGORIES = [
  '个人客户',
  '企业客户',
  'VIP客户',
  '潜在客户',
  '合作伙伴',
];

const LEVELS = [
  '初级',
  '中级',
  '高级',
  '专业',
  '至尊',
];

export default function ClientsPage() {
  const t = useTranslations();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', category: '', level: '', notes: '' });

  const loadClients = () => {
    fetch('/api/clients')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setClients(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadClients, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ name: '', email: '', phone: '', category: '', level: '', notes: '' });
        loadClients();
      }
    } catch {}
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除客户「${name}」？`)) return;
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      loadClients();
    } catch {}
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
        加载失败: {error}
        <button onClick={() => { setError(null); setLoading(true); loadClients(); }} className="ml-2 underline">重试</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard.clients')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + 添加客户
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400 text-sm">
          暂无客户，点击上方按钮添加第一位客户
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => (
            <div key={c.id} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800">{c.name}</div>
                <div className="text-sm text-gray-500">
                  {c.category || '未分类'} · {c.level || '未设置'} · {c.email || ''}
                </div>
                {c.notes && (
                  <div className="text-xs text-gray-400 mt-1 truncate">{c.notes}</div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">添加客户</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="姓名 *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="邮箱"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="电话"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">选择分类</option>
                {CATEGORIES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                <option value="">选择级别</option>
                {LEVELS.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="备注"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm">取消</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">确认添加</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
