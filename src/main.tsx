import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18next from '@i18n/i18next.ts';

import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <Router>
        <App />
      </Router>
    </I18nextProvider>
  </React.StrictMode>,
);
