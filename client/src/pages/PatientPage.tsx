import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HerbSelector } from '../components/patient/HerbSelector';
import { MedicineForm } from '../components/patient/MedicineForm';
import { PatientResult } from '../components/patient/PatientResult';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { usePatientAI } from '../hooks/useAI';
import { useHistory } from '../hooks/useHistory';

const CONDITIONS = [
  'malaria', 'hiv', 'diabetes', 'hypertension', 'tuberculosis',
  'asthma', 'epilepsy', 'heartDisease', 'kidneyDisease', 'liverDisease',
  'pregnancy', 'infection', 'pain', 'other',
];

export function PatientPage() {
  const { t } = useTranslation();
  const { checkInteraction, loading, error, result, reset } = usePatientAI();
  const { addConsultation } = useHistory();

  const [selectedHerbs, setSelectedHerbs] = useState<string[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [condition, setCondition] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async () => {
    setValidationError('');
    if (selectedHerbs.length === 0) {
      setValidationError(t('patient.noHerbsSelected'));
      return;
    }
    if (selectedMeds.length === 0) {
      setValidationError(t('patient.noMedsSelected'));
      return;
    }

    await checkInteraction({
      herbs: selectedHerbs,
      medications: selectedMeds,
      condition,
      extraInfo,
    });
  };

  const handleSave = async () => {
    if (!result) return;
    const riskLevel = result.riskLevel;
    const advice = 'advice' in result ? result.advice : JSON.stringify(result);
    const isOffline = 'isOffline' in result && result.isOffline;

    await addConsultation({
      type: 'patient',
      herbs: selectedHerbs,
      medications: selectedMeds,
      condition,
      riskLevel,
      aiResponse: advice,
      isOffline,
      createdAt: new Date(),
    });
  };

  const handleReset = () => {
    setSelectedHerbs([]);
    setSelectedMeds([]);
    setCondition('');
    setExtraInfo('');
    setValidationError('');
    reset();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-green-deep dark:text-green-light">
        {t('patient.title')}
      </h2>

      {!result ? (
        <>
          <Card>
            <HerbSelector selected={selectedHerbs} onChange={setSelectedHerbs} />
          </Card>

          <Card>
            <MedicineForm selected={selectedMeds} onChange={setSelectedMeds} />
          </Card>

          <Card>
            <label className="block text-sm font-semibold text-green-deep dark:text-green-light mb-2">
              {t('patient.condition')}
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-green-mid outline-none"
            >
              <option value="">{t('patient.selectCondition')}</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{t(`conditions.${c}`)}</option>
              ))}
            </select>
          </Card>

          <Card>
            <label className="block text-sm font-semibold text-green-deep dark:text-green-light mb-2">
              {t('patient.extraInfo')}
            </label>
            <textarea
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              placeholder={t('patient.extraInfoPlaceholder')}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-green-mid outline-none resize-none"
            />
          </Card>

          {validationError && <Alert type="error">{validationError}</Alert>}
          {error && <Alert type="warning">{error}</Alert>}

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
            onClick={handleSubmit}
          >
            {loading ? t('patient.checking') : t('patient.checkInteraction')}
          </Button>
        </>
      ) : (
        <>
          <PatientResult result={result} onSave={handleSave} />
          <Button variant="ghost" className="w-full" onClick={handleReset}>
            {t('common.back')}
          </Button>
        </>
      )}
    </div>
  );
}
