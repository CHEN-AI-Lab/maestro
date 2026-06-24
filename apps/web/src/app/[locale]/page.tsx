import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { auth } from '@/lib/auth';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const session = await auth();

  const featureKeys = ['features.items.0', 'features.items.1', 'features.items.2'] as const;
  const compRows = ['comparison.rows.0', 'comparison.rows.1', 'comparison.rows.2', 'comparison.rows.3', 'comparison.rows.4', 'comparison.rows.5', 'comparison.rows.6', 'comparison.rows.7'] as const;
  const testimonialKeys = ['testimonials.items.0', 'testimonials.items.1', 'testimonials.items.2'] as const;
  const faqKeys = ['faq.items.0', 'faq.items.1', 'faq.items.2', 'faq.items.3', 'faq.items.4', 'faq.items.5'] as const;

  const featureIcons = [
    <svg key="analytics" className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>,
    <svg key="team" className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>,
    <svg key="integrations" className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>,
  ] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">{t('nav.brand')}</Link>
          <nav className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">{t('nav.pricing')}</Link>
            {session ? (
              <Link href="/dashboard" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">{t('nav.dashboard')}</Link>
            ) : (
              <Link href="/signin" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">{t('nav.signIn')}</Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="inline-block mb-6 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">{t('hero.badge')}</div>
          <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
            {t('hero.title1')}<br/>
            <span className="text-indigo-600">{t('hero.title2')}</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">{t('hero.desc')}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/signin" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">{t('hero.cta')}</Link>
            <Link href="/pricing" className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors">{t('hero.pricing')}</Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">{t('hero.footnote')}</p>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('features.heading')}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t('features.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featureKeys.map((key, i) => (
              <div key={key} className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">{featureIcons[i]}</div>
                <h3 className="font-semibold text-lg mb-2">{t(`${key}.title`)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(`${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="bg-white border-y py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('comparison.heading')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium text-gray-600">{t('comparison.col1')}</th>
                    <th className="text-center py-3 font-medium text-indigo-600 bg-indigo-50 rounded-t-lg">{t('nav.brand')}</th>
                    <th className="text-center py-3 font-medium text-gray-400">{t('comparison.col2')}</th>
                    <th className="text-center py-3 font-medium text-gray-400">{t('comparison.col3')}</th>
                  </tr>
                </thead>
                <tbody>
                  {compRows.map((rowKey) => (
                    <tr key={rowKey} className="border-b last:border-0">
                      <td className="py-3 text-gray-700">{t(`${rowKey}.0`)}</td>
                      <td className="text-center py-3 bg-indigo-50"><span className="text-green-600 font-medium">{t(`${rowKey}.1`)}</span></td>
                      <td className="text-center py-3 text-gray-400">{t(`${rowKey}.2`)}</td>
                      <td className="text-center py-3 text-gray-400">{t(`${rowKey}.3`)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('testimonials.heading')}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonialKeys.map((key) => (
                <div key={key} className="bg-white rounded-xl p-6 border shadow-sm">
                  <p className="text-gray-700 italic mb-4 leading-relaxed">&ldquo;{t(`${key}.quote`)}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-sm">{t(`${key}.name`)}</div>
                    <div className="text-gray-500 text-xs">{t(`${key}.role`)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">{t('faq.heading')}</h2>
            <div className="space-y-4">
              {faqKeys.map((key) => (
                <details key={key} className="group bg-white rounded-xl border p-5">
                  <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                    {t(`${key}.q`)}
                    <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-gray-600 text-sm leading-relaxed">{t(`${key}.a`)}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-indigo-600 rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">{t('cta.heading')}</h2>
              <p className="text-indigo-200 mb-8">{t('cta.desc')}</p>
              <Link href="/signin" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-indigo-50 transition-colors">{t('cta.btn')}</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="font-bold text-lg">{t('nav.brand')}</span>
              <span className="text-gray-400 mx-2">&middot;</span>
              <span className="text-gray-500 text-sm">{t('footer.tagline')}</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/pricing" className="hover:text-gray-700 transition-colors">{t('footer.pricing')}</Link>
              <Link href="/signin" className="hover:text-gray-700 transition-colors">{t('footer.signIn')}</Link>
              <a href="mailto:hello@saaspro.dev" className="hover:text-gray-700 transition-colors">{t('footer.contact')}</a>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 mt-8">&copy; {new Date().getFullYear()} SaaSPro. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
