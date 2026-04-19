import React from 'react';
import { useTranslation } from 'react-i18next';
import { NetworkStatus } from './NetworkStatus';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 bg-green-deep text-white shadow-md no-print">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <div>
            <h1 className="font-display text-lg font-bold leading-tight">{t('app.name')}</h1>
            <p className="text-xs text-green-pale opacity-80">{t('app.tagline')}</p>
          </div>
        </div>
      </div>
      <NetworkStatus />
    </header>
  );
}
