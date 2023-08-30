import i18n from 'i18next';

import main from '@i18n/locales/en/main.json';
import header from '@i18n/locales/en/header.json';
import mainDe from '@i18n/locales/de/main.json';
import headerDe from '@i18n/locales/de/header.json';

import { configI18n } from '@i18n/config.ts';

export const resources = {
  en: {
    main,
    header,
  },
  de: {
    main: mainDe,
    header: headerDe,
  },
};

i18n.init({
  ...configI18n,
  resources,
});

export default i18n;
