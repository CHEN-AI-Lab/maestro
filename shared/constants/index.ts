// ============================================================
// SaaS Starter — Shared Constants
// ============================================================

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const SUBSCRIPTION_TIERS = {
  FREE: { price: 0, maxItems: 10, features: ['Basic features', 'Community support'] },
  PRO: { price: 29, maxItems: Infinity, features: ['Unlimited items', 'Advanced analytics', 'Priority support'] },
  ENTERPRISE: { price: 99, maxItems: Infinity, features: ['All Pro features', 'Custom branding', 'API access', 'Dedicated support'] },
} as const;

export const EVENT_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  OVERDUE: 'Overdue',
  REFUNDED: 'Refunded',
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: '#F59E0B',
  PAID: '#10B981',
  OVERDUE: '#EF4444',
  REFUNDED: '#6B7280',
};

export const EVENT_STATUS_COLORS: Record<string, string> = {
  SCHEDULED: '#3B82F6',
  COMPLETED: '#10B981',
  CANCELLED: '#9CA3AF',
  NO_SHOW: '#EF4444',
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};