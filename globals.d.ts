import { resources } from '@jestUtils/i18nextJest.ts';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'main';
    resources: (typeof resources)['en'];
  }
}

declare module '*.json' {
  const value: any;
  export default value;
}
