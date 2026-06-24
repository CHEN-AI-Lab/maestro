'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

interface Invoice {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  createdAt: string;
  student?: { name: string };
  client?: { name: string };
  _count?: { events: number; lessons: number };
}

interface Client {
  id: string;
  name: string;
}

const STATUS_CLASS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
};

export default function InvoicesPage() {
  const t = useTranslations();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientId: '', amount: '', dueDate: '' });

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/invoices').then((r) => r.json()),
      fetch('/api/clients').then((r) => r.json()),
    ])
      .then(([invoicesData, clientsData]) => {
        if (invoicesData.error) throw new Error(invoicesData.error);
        if (clientsData.error) throw new Error(clientsData.error);
        setInvoices(invoicesData);
        setClients(clientsData);
      })
      .catch((e) => {
        // If one API failed, try to salvage partial results
        setError(e.message || String(e));
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const totalRevenue = invoices
    .filter((i) => i.status === 'PAID')
    .reduce((s, i) => s + i.amount, 0);
  const pendingCount = invoices.filter((i) => i.status === 'PENDING').length;
  const overdueCount = invoices.filter((i) => i.status === 'OVERDUE').length;

  const statusLabel = (status: string): string => {
    const key = `invoices.status.${status}`;
    const label = t(key);
    // fallback: if the key wasn't translated (returned raw key), show status directly
    return label === key ? status : label;
  };

  const clientName = (inv: Invoice): string => {
    return inv.client?.name || inv.student?.name || t('invoices.noClient') || 'Unknown';
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId || !form.amount) return;
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: form.clientId,
          amount: parseFloat(form.amount),
          dueDate:
            form.dueDate ||
            new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        }),
      });
      if (res.ok) {
        setShowForm(false);
        setForm({ clientId: '', amount: '', dueDate: '' });
        loadData();
      }
    } catch {
      /* swallow */
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
        {t('error.desc')}: {error}
        <button
          onClick={loadData}
          className="ml-2 underline font-medium hover:text-red-900"
        >
          {t('error.retry')}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard.invoices')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + {t('invoices.addNew') || 'New Invoice'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            ${totalRevenue.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t('invoices.totalRevenue') || 'Total Revenue'}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {pendingCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t('invoices.pending') || 'Pending'}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {overdueCount}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {t('invoices.overdue') || 'Overdue'}
          </div>
        </div>
      </div>

      {/* List / Empty State */}
      {invoices.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center text-gray-400 text-sm">
          {t('invoices.empty') || 'No invoices yet'}
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-xl border p-4 flex justify-between items-center hover:shadow-sm transition-shadow"
            >
              <div>
                <div className="font-semibold text-gray-800">
                  {clientName(inv)}
                </div>
                <div className="text-sm text-gray-500">
                  {t('invoices.dueDate') || 'Due'}:{' '}
                  {inv.dueDate
                    ? new Date(inv.dueDate).toLocaleDateString()
                    : '-'}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-gray-800">
                  ${inv.amount.toFixed(2)}
                </div>
                <span
                  className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                    STATUS_CLASS[inv.status] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {statusLabel(inv.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Invoice Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {t('invoices.addTitle') || 'New Invoice'}
            </h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm"
                value={form.clientId}
                onChange={(e) =>
                  setForm({ ...form, clientId: e.target.value })
                }
                required
              >
                <option value="">
                  {t('invoices.selectClient') || 'Select client'}
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                type="number"
                step="0.01"
                placeholder={`${t('invoices.amount') || 'Amount'} *`}
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm"
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({ ...form, dueDate: e.target.value })
                }
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                >
                  {t('invoices.cancel') || 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  {t('invoices.confirm') || 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
