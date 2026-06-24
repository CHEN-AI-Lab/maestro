'use client';

import { useTranslations, useMessages } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useSession } from 'next-auth/react';

const planKeys = ['free', 'pro', 'enterprise'] as const;
const priceKeys: Record<string, string> = {
  free: '',
  pro: 'PRO_MONTHLY',
  enterprise: 'STUDIO_MONTHLY',
};

export default function PricingPage() {
  const t = useTranslations();
  const messages = useMessages();
  const { data: session, status } = useSession();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const pricingMsgs = messages.pricing as any;

  const prices: Record<string, number> = {
    free: 0,
    pro: 29,
    enterprise: 99,
  };

  const yearlyMultiplier = billing === 'yearly' ? 10 : 1;

  const handleSubscribe = async (planKey: string) => {
    const priceKey = priceKeys[planKey];
    if (!priceKey) {
      window.location.href = '/signin';
      return;
    }

    const effectivePriceKey = billing === 'yearly'
      ? priceKey.replace('MONTHLY', 'YEARLY')
      : priceKey;

    setLoading(planKey);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceKey: effectivePriceKey,
          successUrl: `${window.location.origin}/dashboard?checkout=success`,
          cancelUrl: `${window.location.origin}/pricing?checkout=canceled`,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(t('pricing.checkoutFailed'));
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(t('pricing.networkError'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">{t('nav.brand')}</Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
            {status === 'authenticated' ? (
              <Link href="/dashboard" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">{t('nav.dashboard')}</Link>
            ) : (
              <Link href="/signin" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">{t('nav.signIn')}</Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{t('pricing.title')}</h1>
          <p className="text-gray-500">{t('pricing.subtitle')}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-3 mb-12">
          <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-gray-800' : 'text-gray-400'}`}>{t('pricing.monthly')}</span>
          <button
            onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
            className={`w-12 h-6 rounded-full relative transition-colors ${billing === 'yearly' ? 'bg-indigo-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billing === 'yearly' ? 'translate-x-6.5' : 'translate-x-0.5'}`} />
          </button>
          <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-gray-800' : 'text-gray-400'}`}>
            {t('pricing.yearly')} <span className="text-green-600 text-xs">{t('pricing.saveMonths')}</span>
          </span>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planKeys.map((key) => {
            const price = prices[key] * yearlyMultiplier;
            const featured = key === 'pro';
            const isCurrentPlan = false;
            const features: string[] = pricingMsgs.features[key] || [];

            return (
              <div key={key} className={`rounded-2xl border p-8 flex flex-col ${featured ? 'border-indigo-400 ring-2 ring-indigo-200 bg-white shadow-lg relative' : 'bg-white shadow-sm hover:shadow-md transition-shadow'}`}>
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">{t('pricing.mostPopular')}</span>
                )}
                <h3 className="text-lg font-bold text-gray-800">{t(`pricing.${key}`)}</h3>
                <div className="mt-4 mb-1">
                  <span className="text-3xl font-bold text-gray-800">${price}</span>
                  <span className="text-sm text-gray-500">{t('pricing.perMonth')}</span>
                </div>
                {isCurrentPlan && (
                  <span className="text-xs text-green-600 font-medium mt-1">{t('pricing.currentPlan')}</span>
                )}
                <ul className="mt-6 space-y-3 flex-1">
                  {features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(key)}
                  disabled={loading === key || isCurrentPlan}
                  className={`mt-8 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                  }`}
                >
                  {loading === key ? t('pricing.processing') : t(`pricing.${key === 'free' ? 'freeStart' : key === 'pro' ? 'subscribePro' : 'contactSales'}`)}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
