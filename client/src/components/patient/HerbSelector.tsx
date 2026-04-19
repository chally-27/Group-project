import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { herbs, searchHerbs } from '../../data/herbs';
import type { Herb } from '../../types';

interface HerbSelectorProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function HerbSelector({ selected, onChange }: HerbSelectorProps) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return herbs;
    return searchHerbs(search);
  }, [search]);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const getName = (herb: Herb) =>
    i18n.language === 'en' ? herb.nameEnglish : herb.nameSwahili;

  const categoryColors: Record<string, string> = {
    antimalarial: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    digestive: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    immune: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    cardiovascular: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    analgesic: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    respiratory: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
    other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-green-deep dark:text-green-light mb-2">
        {t('patient.selectHerbs')} ({selected.length})
      </label>
      <input
        type="text"
        placeholder={t('patient.searchHerbs')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-green-mid focus:border-transparent outline-none mb-3"
      />
      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
        {filtered.map((herb) => {
          const isSelected = selected.includes(herb.id);
          return (
            <button
              key={herb.id}
              onClick={() => toggle(herb.id)}
              className={`text-left p-3 rounded-xl border-2 transition-all text-sm ${
                isSelected
                  ? 'border-green-mid bg-green-pale dark:bg-green-mid/20'
                  : 'border-gray-100 dark:border-gray-700 hover:border-green-light'
              }`}
            >
              <div className="font-semibold text-green-deep dark:text-green-light truncate">
                {getName(herb)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 italic truncate">
                {herb.scientificName}
              </div>
              <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded-full ${categoryColors[herb.category] || categoryColors.other}`}>
                {herb.category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
