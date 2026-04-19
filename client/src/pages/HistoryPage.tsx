import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from '../hooks/useHistory';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import type { Consultation, RiskLevel } from '../types';

type Filter = 'all' | 'patient' | 'nurse' | 'high' | 'medium' | 'low';

export function HistoryPage() {
  const { t } = useTranslation();
  const { consultations, loading, removeConsultation, exportCSV } = useHistory();
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  const filtered = consultations.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'patient' || filter === 'nurse') return c.type === filter;
    return c.riskLevel === filter;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('history.filterAll') },
    { key: 'patient', label: t('history.filterPatient') },
    { key: 'nurse', label: t('history.filterNurse') },
    { key: 'high', label: t('history.filterHigh') },
    { key: 'medium', label: t('history.filterMedium') },
    { key: 'low', label: t('history.filterLow') },
  ];

  const handleDelete = async (id: number) => {
    if (confirm(t('history.confirmDelete'))) {
      await removeConsultation(id);
    }
  };

  if (loading) return <LoadingSpinner text={t('common.loading')} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-green-deep dark:text-green-light">
          {t('history.title')}
        </h2>
        {consultations.length > 0 && (
          <Button variant="ghost" size="sm" onClick={exportCSV}>
            {t('history.export')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-all ${
              filter === f.key
                ? 'bg-green-mid text-white border-green-mid'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">📋</p>
          <p>{t('history.noHistory')}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <Badge risk={c.riskLevel as RiskLevel} />
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {c.type === 'patient' ? '🧑‍⚕️' : '👩‍⚕️'} {c.type}
                  </span>
                  {c.isOffline && <span className="ml-1 text-xs text-risk-medium">offline</span>}
                </div>
                <span className="text-xs text-gray-400">
                  {c.createdAt instanceof Date
                    ? c.createdAt.toLocaleDateString('sw-TZ')
                    : new Date(c.createdAt).toLocaleDateString('sw-TZ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Mimea:</strong> {c.herbs.join(', ')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Dawa:</strong> {c.medications.join(', ')}
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedConsultation(c)}>
                  {t('history.viewReport')}
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(c.id!)}>
                  {t('history.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
        title={t('history.viewReport')}
      >
        {selectedConsultation && (
          <pre className="whitespace-pre-wrap text-sm font-body bg-gray-50 dark:bg-gray-900 p-4 rounded-xl overflow-x-auto">
            {selectedConsultation.aiResponse}
          </pre>
        )}
      </Modal>
    </div>
  );
}
