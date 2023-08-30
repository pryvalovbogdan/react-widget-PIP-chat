import React, { PropsWithChildren } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';

import i18next from './i18nextJest.ts';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  route?: string;
}

function renderWithProviders(
  component: React.ReactElement,
  { route = '', ...renderOptions }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return (
      <Router>
        <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
      </Router>
    );
  }

  return { ...render(component, { wrapper: Wrapper, ...renderOptions }) };
}

export { renderWithProviders };
