import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { configI18n } from './config.ts';

i18n
  .use(
    resourcesToBackend(
      async (language: string, namespace: string) => await import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .use(LanguageDetector)
  .init(configI18n);

export default i18n;
