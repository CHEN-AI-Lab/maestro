// ============================================================
// SaaS Starter — Shared Utils
// ============================================================

/** Format currency amount */
export function formatCurrency(amount: number, currency = 'USD'): string {
  const symbols: Record<string, string> = { USD: '$', CNY: '¥', EUR: '€', GBP: '£', JPY: '¥' };
  const sym = symbols[currency] || '$';
  return `${sym}${amount.toFixed(2)}`;
}

/** Format date string */
export function formatDate(dateStr: string, locale = 'zh-CN'): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

/** Format date-time string */
export function formatDateTime(dateStr: string, locale = 'zh-CN'): string {
  const date = new Date(dateStr);
  return date.toLocaleString(locale, {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Format date as YYYY-MM-DD */
export function toISODate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

/** Calculate duration in minutes between two timestamps */
export function calcDuration(start: string, end: string): number {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

/** Get current week's date range (Mon–Sun) */
export function getWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

/** Get display label for a status value */
export function getStatusLabel(status: string, labels: Record<string, string>): string {
  return labels[status] || status;
}
