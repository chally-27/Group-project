import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNetwork } from '../../hooks/useNetwork';

export function NetworkStatus() {
  const { isOnline } = useNetwork();
  const { t } = useTranslation();

  return (
    <div
      className={`text-xs text-center py-1 px-2 transition-colors ${
        isOnline
          ? 'bg-risk-low/20 text-green-deep'
          : 'bg-risk-medium/20 text-risk-medium'
      }`}
    >
      {isOnline ? (
        <span>✅ {t('network.online')}</span>
      ) : (
        <span>⚠️ {t('network.offline')}</span>
      )}
    </div>
  );
}
