import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh'] as const,
  defaultLocale: 'zh' as const,
  localePrefix: 'always' as const,
});
