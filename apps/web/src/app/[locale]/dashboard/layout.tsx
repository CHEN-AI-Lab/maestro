import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold">{t('nav.brand')}</Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors">{t('dashboard.title')}</Link>
              <Link href="/dashboard/clients" className="text-gray-600 hover:text-indigo-600 transition-colors">{t('dashboard.clients')}</Link>
              <Link href="/dashboard/events" className="text-gray-600 hover:text-indigo-600 transition-colors">{t('dashboard.events')}</Link>
              <Link href="/dashboard/invoices" className="text-gray-600 hover:text-indigo-600 transition-colors">{t('dashboard.invoices')}</Link>
            </nav>
          </div>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
