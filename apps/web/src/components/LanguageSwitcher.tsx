'use client';

import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';

const labels: Record<string, string> = { en: 'EN', zh: '中文' };

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname(); // next-intl's usePathname returns path without locale prefix

  const toggle = () => {
    const next = locale === 'en' ? 'zh' : 'en';
    // Full page reload to re-render Server Components with the new locale
    const target = '/' + next + (pathname === '/' ? '' : pathname);
    window.location.href = target;
  };

  return (
    <button
      onClick={toggle}
      className="text-xs font-medium px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500"
      aria-label="Switch language"
    >
      {labels[locale === 'en' ? 'zh' : 'en']}
    </button>
  );
}