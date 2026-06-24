'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STATUS_MAP: Record<string, string> = { SCHEDULED: 'Scheduled', COMPLETED: 'Completed', CANCELLED: 'Cancelled', NO_SHOW: 'No Show' };
const STATUS_COLOR: Record<string, string> = { SCHEDULED: 'bg-blue-500', COMPLETED: 'bg-green-500', CANCELLED: 'bg-gray-400', NO_SHOW: 'bg-red-500' };

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  client?: { name: string; category?: string };
  student?: { name: string };
  price: number;
}

export default function EventsPage() {
  const t = useTranslations();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ title: '', clientId: '', date: '', startTime: '09:00', endTime: '10:00', price: '', notes: '' });

  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);
  const monday = new Date(now);
  monday.setDate(monday.getDate() - now.getDay() + 1);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return { name: WEEKDAYS[i], date: `${d.getMonth() + 1}/${d.getDate()}`, iso: d.toISOString().split('T')[0] };
  });

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/events').then(r => r.json()),
      fetch('/api/clients').then(r => r.json()),
    ])
      .then(([eventsData, clientsData]) => {
        if (!eventsData.error) setEvents(eventsData);
        if (!clientsData.error) setClients(clientsData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const filteredEvents = events.filter((l) => days.some((d) => l.startTime?.startsWith(d.iso)));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.clientId) return;
    const date = form.date || days[0].iso;
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          clientId: form.clientId,
          startTime: `${date}T${form.startTime}:00`,
          endTime: `${date}T${form.endTime}:00`,
          price: parseFloat(form.price) || undefined,
          notes: form.notes || undefined,
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ title: '', clientId: '', date: '', startTime: '09:00', endTime: '10:00', price: '', notes: '' });
        const r = await fetch('/api/events');
        const d = await r.json();
        if (!d.error) setEvents(d);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
        {t('error.title')}: {error}
        <button onClick={loadData} className="ml-2 underline">{t('error.retry')}</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('dashboard.events')}</h1>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">+ {t('dashboard.newEvent')}</button>
      </div>

      {/* Week Nav */}
      <div className="flex items-center gap-3 mb-4 bg-white rounded-xl border px-4 py-3">
        <button onClick={() => setWeekOffset((w) => w - 1)} className="text-gray-500 hover:text-gray-800 text-xl">‹</button>
        <span className="font-semibold text-gray-700">{days[0]?.date} – {days[6]?.date}</span>
        <button onClick={() => setWeekOffset((w) => w + 1)} className="text-gray-500 hover:text-gray-800 text-xl">›</button>
        <button onClick={() => setWeekOffset(0)} className="ml-auto text-sm text-indigo-600 hover:underline">{t('dashboard.today')}</button>
      </div>

      {/* Events */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400 text-sm">{t('dashboard.noEvents')}</div>
      ) : (
        <div className="space-y-2">
          {filteredEvents.map((l) => {
            const clientName = l.client?.name || l.student?.name || '—';
            return (
              <div key={l.id} className="bg-white rounded-xl border flex overflow-hidden hover:shadow-sm transition-shadow">
                <div className={`w-1.5 flex-shrink-0 ${STATUS_COLOR[l.status] || 'bg-blue-500'}`} />
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800">{l.title}</div>
                      <div className="text-sm text-gray-500">{clientName} · {l.duration} min</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono text-gray-600">
                        {l.startTime?.slice(11, 16)}–{l.endTime?.slice(11, 16)}
                      </div>
                      <span className="text-xs text-gray-400">{STATUS_MAP[l.status] || l.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">{t('dashboard.newEvent')}</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <select className="w-full border rounded-lg px-3 py-2 text-sm" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
                <option value="">Select client</option>
                {clients.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              <div className="flex gap-2">
                <input className="flex-1 border rounded-lg px-3 py-2 text-sm" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                <span className="self-center text-gray-400">to</span>
                <input className="flex-1 border rounded-lg px-3 py-2 text-sm" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              </div>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <textarea className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Notes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm">{t('publish.cancel') || 'Cancel'}</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">{t('publish.add') || 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
