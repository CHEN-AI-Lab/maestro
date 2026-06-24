import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-7xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-xl font-semibold mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">页面未找到 · The page doesn&apos;t exist.</p>
        <Link href="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Back to Home · 返回首页
        </Link>
      </div>
    </div>
  );
}
