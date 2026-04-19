import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import type { AIResponse, ClinicalAIResponse, OfflineResult, RiskLevel } from '../../types';

interface PatientResultProps {
  result: AIResponse | ClinicalAIResponse | OfflineResult;
  onSave: () => void;
}

export function PatientResult({ result, onSave }: PatientResultProps) {
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);

  const isOffline = 'isOffline' in result && result.isOffline;
  const riskLevel = result.riskLevel as RiskLevel;
  const advice = 'advice' in result ? result.advice :
    'clinicalReport' in result ? (result as ClinicalAIResponse).clinicalReport : '';

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DawaSalama - Ripoti',
          text: advice,
        });
      } catch {
        // User cancelled share
      }
    }
  };

  return (
    <div className="space-y-4">
      {isOffline && (
        <Alert type="warning">
          {t('patient.offlineWarning')}
        </Alert>
      )}

      <Card className="space-y-4">
        <div ref={reportRef}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-lg text-green-deep dark:text-green-light">
              Matokeo
            </h3>
            <Badge risk={riskLevel} />
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap text-sm font-body bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 overflow-x-auto">
              {advice}
            </pre>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 no-print">
          <Button variant="primary" size="sm" onClick={onSave}>
            {t('patient.saveReport')}
          </Button>
          <Button variant="ghost" size="sm" onClick={handlePrint}>
            {t('patient.print')}
          </Button>
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button variant="ghost" size="sm" onClick={handleShare}>
              {t('patient.share')}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
