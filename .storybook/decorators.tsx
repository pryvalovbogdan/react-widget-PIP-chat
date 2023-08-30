import { ReactNode, Suspense, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { PartialStoryFn as StoryFunction, Renderer, StoryContext } from '@storybook/types';

import i18n from '../src/jestUtils/i18nextJest';

const lang = localStorage.getItem('i18nextLng');

export const globalTypes = {
  storybookLocale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: lang || 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'es', right: '🇪🇸', title: 'Español' },
        { value: 'de', right: '🇩🇪', title: 'Deutsch' },
      ],
    },
  },
};

export const withI18next = (StoryFn: StoryFunction<Renderer>, context: StoryContext) => {
  const { globals } = context;
  const { storybookLocale } = globals;

  useEffect(() => {
    i18n.changeLanguage(storybookLocale);
  }, [storybookLocale]);

  return (
    <Suspense fallback={<div>loading translations...</div>}>
      <I18nextProvider i18n={i18n}>{StoryFn(context) as ReactNode}</I18nextProvider>
    </Suspense>
  );
};
