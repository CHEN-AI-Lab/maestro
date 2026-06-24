'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Stats {
  totalClients: number;
  totalEvents: number;
  upcomingEvents: number;
  totalRevenue: number;
  pendingInvoices: number;
  eventsThisMonth: number;
}

export default function DashboardPage() {
  const t = useTranslations();
  const [stats, setStats] = useState<Stats>({
    totalClients: 0, totalEvents: 0, upcomingEvents: 0,
    totalRevenue: 0, pendingInvoices: 0, eventsThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = () => {
    setLoading(true);
    setError(null);
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then((d) => { if (!d.error) setStats(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadStats, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
        {t('error.title')}: {error}
        <button onClick={loadStats} className="ml-2 underline">{t('error.retry')}</button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-xl">👥</div>
            <div className="text-2xl font-bold text-indigo-600">{stats.totalClients}</div>
          </div>
          <div className="text-sm text-gray-500">{t('dashboard.clients')}</div>
        </div>

        <div className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">📅</div>
            <div className="text-2xl font-bold text-blue-600">{stats.upcomingEvents}</div>
          </div>
          <div className="text-sm text-gray-500">{t('dashboard.events')}</div>
        </div>

        <div className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">💰</div>
            <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(0)}</div>
          </div>
          <div className="text-sm text-gray-500">{t('dashboard.revenue')}</div>
        </div>

        <div className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-xl">📄</div>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingInvoices}</div>
          </div>
          <div className="text-sm text-gray-500">{t('dashboard.pendingInvoices')}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">{t('dashboard.thisMonth')}</h2>
        <div className="flex gap-12">
          <div>
            <div className="text-3xl font-bold text-gray-800">{stats.eventsThisMonth}</div>
            <div className="text-sm text-gray-500">{t('dashboard.events')}</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">{stats.totalEvents}</div>
            <div className="text-sm text-gray-500">{t('dashboard.allTime')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
