import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/index.js';
import { AppRouter } from './routes/AppRouter.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading restaurant...</div>}>
          <AppRouter />
        </Suspense>
        <Toaster position="top-right" />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
