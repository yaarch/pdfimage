// Polyfill global Iterator for browser runtime environment safety
if (typeof (globalThis as any).Iterator === 'undefined') {
  class Iterator {}
  (globalThis as any).Iterator = Iterator;
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

