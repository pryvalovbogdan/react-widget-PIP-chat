import { resources } from '@jestUtils/i18nextJest.ts';

export type TranslationKeys = keyof (typeof resources)['en']['main'];

export interface IButtonWithTranslateProps {
  i18Key: TranslationKeys;
  handle: () => void;
  i18Value?: number;
  backgroundColor?: string;
}
