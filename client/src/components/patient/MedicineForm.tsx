import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { drugs, searchDrugs } from '../../data/drugs';

interface MedicineFormProps {
  selected: string[];
  onChange: (names: string[]) => void;
}

export function MedicineForm({ selected, onChange }: MedicineFormProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return drugs;
    return searchDrugs(search);
  }, [search]);

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-green-deep dark:text-green-light mb-2">
        {t('patient.selectMeds')} ({selected.length})
      </label>
      <input
        type="text"
        placeholder={t('patient.searchMeds')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-green-mid focus:border-transparent outline-none mb-3"
      />
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
        {filtered.map((drug) => {
          const isSelected = selected.includes(drug.nameGeneric);
          return (
            <button
              key={drug.id}
              onClick={() => toggle(drug.nameGeneric)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                isSelected
                  ? 'bg-green-mid text-white border-green-mid'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-mid'
              }`}
            >
              {drug.nameGeneric}
              {drug.nameBrand.length > 0 && (
                <span className="text-xs opacity-70 ml-1">({drug.nameBrand[0]})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
