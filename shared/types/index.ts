// ============================================================
// SaaS Starter — Shared Types (cross-platform)
// ============================================================

// --- Enums ---
export type UserRole = 'ADMIN' | 'MEMBER' | 'CLIENT';
export type EventStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'REFUNDED';
export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

// --- Core Models ---
export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: string | null;
}

export interface Organization {
  id: string;
  userId: string;
  name: string | null;
  rate: number;
  currency: string;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Client {
  id: string;
  userId: string | null;
  orgId: string;
  name: string;
  email: string | null;
  phone: string | null;
  category: string | null;
  level: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  user?: User;
  _count?: { events: number; invoices: number };
}

export interface Event {
  id: string;
  orgId: string;
  clientId: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: EventStatus;
  notes: string | null;
  price: number;
  invoiceId: string | null;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  client?: Client;
  invoice?: Invoice;
}

export interface Invoice {
  id: string;
  orgId: string;
  clientId: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt: string | null;
  stripeInvoiceId: string | null;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  client?: Client;
  events?: Event[];
  _count?: { events: number };
}

// --- API Response ---
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  totalClients: number;
  totalEvents: number;
  upcomingEvents: number;
  totalRevenue: number;
  pendingInvoices: number;
  eventsThisMonth: number;
}

// --- Form Input ---
export interface ClientInput {
  name: string;
  email?: string;
  phone?: string;
  category?: string;
  level?: string;
  notes?: string;
}

export interface EventInput {
  clientId: string;
  title: string;
  startTime: string;
  endTime: string;
  duration?: number;
  notes?: string;
  price?: number;
}

export interface InvoiceInput {
  clientId: string;
  amount: number;
  dueDate: string;
}
