import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import en from '../../../../shared/messages/en.json' with { type: 'json' };
import zh from '../../../../shared/messages/zh.json' with { type: 'json' };

const messages: Record<string, any> = { en: en, zh: zh };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: messages[locale],
  };
});
