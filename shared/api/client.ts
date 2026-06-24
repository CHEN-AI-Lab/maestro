// ============================================================
// SaaS Starter — API Client (cross-platform)
// ============================================================

import type {
  Client, ClientInput,
  Event, EventInput,
  Invoice, InvoiceInput,
  DashboardStats,
  ApiResponse,
} from '../types';

const BASE = 'http://localhost:3000/api';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// --- Clients ---
export function fetchClients(): Promise<Client[]> {
  return request<Client[]>('/clients');
}

export function fetchClient(id: string): Promise<Client> {
  return request<Client>(`/clients/${id}`);
}

export function createClient(data: ClientInput): Promise<Client> {
  return request<Client>('/clients', { method: 'POST', body: JSON.stringify(data) });
}

export function updateClient(id: string, data: Partial<ClientInput>): Promise<Client> {
  return request<Client>(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export function deleteClient(id: string): Promise<void> {
  return request<void>(`/clients/${id}`, { method: 'DELETE' });
}

// --- Events ---
export function fetchEvents(params?: { start?: string; end?: string }): Promise<Event[]> {
  const qs = new URLSearchParams();
  if (params?.start) qs.set('start', params.start);
  if (params?.end) qs.set('end', params.end);
  const query = qs.toString();
  return request<Event[]>(`/events${query ? `?${query}` : ''}`);
}

export function createEvent(data: EventInput): Promise<Event> {
  return request<Event>('/events', { method: 'POST', body: JSON.stringify(data) });
}

export function updateEvent(id: string, data: Partial<EventInput>): Promise<Event> {
  return request<Event>(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

// --- Invoices ---
export function fetchInvoices(): Promise<Invoice[]> {
  return request<Invoice[]>('/invoices');
}

export function createInvoice(data: InvoiceInput): Promise<Invoice> {
  return request<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(data) });
}

// --- Dashboard ---
export function fetchDashboardStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/dashboard/stats');
}
