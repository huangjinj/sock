import en from './locales/en-US.json'
import zh from './locales/zh-CN.json'

const locales = {
  'en-US': en,
  'zh-CN': zh
}

export const supportedLocales = Object.keys(locales)

export function selectLocale(locale) {
  return supportedLocales.includes(locale) ? locale : 'en-US'
}

export function loadTranslations(locale) {
  return locales[selectLocale(locale)]
}
