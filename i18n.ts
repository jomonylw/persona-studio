import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'zh']
export const defaultLocale = 'en'

export default getRequestConfig(async ({ locale }) => {
  // This is a workaround for a type issue where locale can be undefined.
  const baseLocale = locales.find((l) => l === locale) || defaultLocale

  return {
    messages: (await import(`./messages/${baseLocale}.json`)).default,
    locale: baseLocale,
  }
})
