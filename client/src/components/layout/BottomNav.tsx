import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navItems = [
  { to: '/', icon: '🧑‍⚕️', labelKey: 'nav.patient' },
  { to: '/nurse', icon: '👩‍⚕️', labelKey: 'nav.nurse' },
  { to: '/history', icon: '📋', labelKey: 'nav.history' },
  { to: '/education', icon: '📚', labelKey: 'nav.education' },
  { to: '/settings', icon: '⚙️', labelKey: 'nav.settings' },
];

export function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 no-print">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-1 text-xs transition-colors ${
                isActive
                  ? 'text-green-mid font-semibold'
                  : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span className="truncate max-w-[60px]">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
