'use client';

import { useTranslations, useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SignInPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading('resend');
    setError('');
    setSent(false);
    try {
      const result = await signIn('resend', { email, redirect: false });
      if (result?.error) {
        setError(locale === 'zh' ? '发送失败，请检查邮箱地址' : 'Failed to send, please check your email');
      } else {
        setSent(true);
      }
    } catch {
      setError(locale === 'zh' ? '发送失败，请稍后重试' : 'Failed to send, please try again');
    } finally {
      setLoading('');
    }
  };

  const handleOAuth = (provider: string) => {
    setLoading(provider);
    signIn(provider, { callbackUrl: `/${locale}/dashboard` });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">{t('nav.brand')}</Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-sm w-full mx-auto px-4">
          <div className="bg-white rounded-xl border p-8 shadow-sm">
            <h1 className="text-xl font-bold mb-6 text-center">{t('signin.title')}</h1>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleOAuth('google')}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {locale === 'zh' ? '使用 Google 登录' : 'Sign in with Google'}
              </button>

              <button
                onClick={() => handleOAuth('github')}
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-3 border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                {locale === 'zh' ? '使用 GitHub 登录' : 'Sign in with GitHub'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400">
                <span className="bg-white px-2">{locale === 'zh' ? '或者' : 'or'}</span>
              </div>
            </div>

            {/* Magic Link (Email) */}
            {sent ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 text-center">
                {locale === 'zh'
                  ? `登录链接已发送到 ${email}，请查收邮件`
                  : `Magic link sent to ${email}. Check your inbox.`}
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <div>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder={t('signin.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}
                <button
                  type="submit"
                  disabled={loading === 'resend'}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {loading === 'resend' ? (locale === 'zh' ? '发送中...' : 'Sending...') : t('signin.submit')}
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">
                {locale === 'zh' ? '还没有账号？' : "Don't have an account?"}
              </span>
              <Link href="/signup" className="text-sm text-indigo-600 hover:underline ml-1">
                {locale === 'zh' ? '注册' : 'Sign Up'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}