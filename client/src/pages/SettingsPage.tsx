import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { clearAllData } from '../db/indexeddb';

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('dawasalama-dark') === 'true';
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDark = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem('dawasalama-dark', String(newVal));
    if (newVal) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('dawasalama-lang', lang);
  };

  const handleClear = async () => {
    if (confirm(t('settings.clearDataConfirm'))) {
      await clearAllData();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-green-deep dark:text-green-light">
        {t('settings.title')}
      </h2>

      {/* Language */}
      <Card className="space-y-3">
        <h3 className="font-semibold text-green-deep dark:text-green-light">{t('settings.language')}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => changeLang('sw')}
            className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
              i18n.language === 'sw'
                ? 'border-green-mid bg-green-pale dark:bg-green-mid/20 text-green-deep'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
            }`}
          >
            🇹🇿 Kiswahili
          </button>
          <button
            onClick={() => changeLang('en')}
            className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
              i18n.language === 'en'
                ? 'border-green-mid bg-green-pale dark:bg-green-mid/20 text-green-deep'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </Card>

      {/* Dark Mode */}
      <Card className="flex items-center justify-between">
        <h3 className="font-semibold text-green-deep dark:text-green-light">{t('settings.darkMode')}</h3>
        <button
          onClick={toggleDark}
          className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-green-mid' : 'bg-gray-300'} relative`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : ''}`} />
        </button>
      </Card>

      {/* Clear Data */}
      <Card className="space-y-3">
        <h3 className="font-semibold text-green-deep dark:text-green-light">{t('settings.clearData')}</h3>
        <Button variant="danger" size="sm" onClick={handleClear}>
          {t('settings.clearData')}
        </Button>
        {cleared && <Alert type="success">{t('settings.cleared')}</Alert>}
      </Card>

      {/* About */}
      <Card className="space-y-2">
        <h3 className="font-semibold text-green-deep dark:text-green-light">{t('settings.about')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.aboutText')}</p>
        <p className="text-xs text-gray-400">{t('settings.version')}: 1.0.0</p>
      </Card>
    </div>
  );
}
