'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register(`${basePath}/sw.js`)
          .then((registration) => {
            console.log('Service Worker registered:', registration.scope);
            registration.update();
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return null;
}
