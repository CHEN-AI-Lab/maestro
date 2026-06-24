'use client';
import { useTranslations } from 'next-intl';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl font-bold text-red-200 mb-4">500</div>
        <h1 className="text-xl font-semibold mb-2">{t('error.title')}</h1>
        <p className="text-gray-500 mb-8 text-sm">{error.message || t('error.desc')}</p>
        <button onClick={reset} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          {t('error.retry')}
        </button>
      </div>
    </div>
  );
}
