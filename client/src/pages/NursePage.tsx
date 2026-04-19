import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HerbSelector } from '../components/patient/HerbSelector';
import { MedicineForm } from '../components/patient/MedicineForm';
import { PatientResult } from '../components/patient/PatientResult';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { useNurseAI } from '../hooks/useAI';
import { useHistory } from '../hooks/useHistory';

const CONDITIONS = [
  'malaria', 'hiv', 'diabetes', 'hypertension', 'tuberculosis',
  'asthma', 'epilepsy', 'heartDisease', 'kidneyDisease', 'liverDisease',
  'pregnancy', 'infection', 'pain', 'other',
];

const TIMING_OPTIONS = ['today', 'yesterday', 'thisWeek', 'lastWeek', 'lastMonth', 'moreThanMonth'];

const SPECIAL_POPS = ['pediatric', 'elderly', 'renalImpairment', 'hepaticImpairment'];

export function NursePage() {
  const { t } = useTranslation();
  const { generateReport, loading, error, result, reset } = useNurseAI();
  const { addConsultation } = useHistory();

  const [selectedHerbs, setSelectedHerbs] = useState<string[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<string[]>([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [pregnant, setPregnant] = useState(false);
  const [condition, setCondition] = useState('');
  const [timing, setTiming] = useState('');
  const [chronic, setChronic] = useState<string[]>([]);
  const [specialPop, setSpecialPop] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleSpecialPop = (pop: string) => {
    setSpecialPop((prev) =>
      prev.includes(pop) ? prev.filter((p) => p !== pop) : [...prev, pop],
    );
  };

  const handleSubmit = async () => {
    await generateReport({
      herbs: selectedHerbs,
      timing,
      condition,
      plannedMeds: selectedMeds,
      age: parseInt(age) || 0,
      gender,
      weight: parseFloat(weight) || 0,
      pregnant,
      chronic,
      specialPopulation: specialPop,
      notes,
    });
  };

  const handleSave = async () => {
    if (!result) return;
    const advice = 'advice' in result ? result.advice :
      'clinicalReport' in result ? (result as any).clinicalReport : '';
    const isOffline = 'isOffline' in result && result.isOffline;

    await addConsultation({
      type: 'nurse',
      herbs: selectedHerbs,
      medications: selectedMeds,
      condition,
      riskLevel: result.riskLevel,
      aiResponse: advice,
      isOffline,
      createdAt: new Date(),
    });
  };

  const handleReset = () => {
    setSelectedHerbs([]);
    setSelectedMeds([]);
    setAge('');
    setGender('');
    setWeight('');
    setPregnant(false);
    setCondition('');
    setTiming('');
    setChronic([]);
    setSpecialPop([]);
    setNotes('');
    reset();
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-green-deep dark:text-green-light">
        {t('nurse.title')}
      </h2>

      {!result ? (
        <>
          {/* Patient Info */}
          <Card className="space-y-4">
            <h3 className="font-semibold text-green-deep dark:text-green-light">{t('nurse.patientInfo')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('nurse.age')}</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-green-mid" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('nurse.gender')}</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-green-mid">
                  <option value="">-</option>
                  <option value="male">{t('nurse.male')}</option>
                  <option value="female">{t('nurse.female')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('nurse.weight')}</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-green-mid" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('nurse.pregnant')}</label>
                <div className="flex gap-3 mt-1">
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name="pregnant" checked={pregnant} onChange={() => setPregnant(true)} className="accent-green-mid" />
                    {t('nurse.yes')}
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input type="radio" name="pregnant" checked={!pregnant} onChange={() => setPregnant(false)} className="accent-green-mid" />
                    {t('nurse.no')}
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Herb History */}
          <Card>
            <HerbSelector selected={selectedHerbs} onChange={setSelectedHerbs} />
          </Card>

          {/* Timing */}
          <Card>
            <label className="block text-sm font-semibold text-green-deep dark:text-green-light mb-2">{t('nurse.timing')}</label>
            <select value={timing} onChange={(e) => setTiming(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-green-mid">
              <option value="">-</option>
              {TIMING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{t(`nurse.timingOptions.${opt}`)}</option>
              ))}
            </select>
          </Card>

          {/* Condition & Planned Meds */}
          <Card>
            <label className="block text-sm font-semibold text-green-deep dark:text-green-light mb-2">{t('patient.condition')}</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-green-mid">
              <option value="">{t('patient.selectCondition')}</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{t(`conditions.${c}`)}</option>
              ))}
            </select>
          </Card>

          <Card>
            <MedicineForm selected={selectedMeds} onChange={setSelectedMeds} />
          </Card>

          {/* Special Populations */}
          <Card className="space-y-3">
            <h3 className="text-sm font-semibold text-green-deep dark:text-green-light">{t('nurse.specialPopulations')}</h3>
            <div className="flex flex-wrap gap-2">
              {SPECIAL_POPS.map((pop) => (
                <button
                  key={pop}
                  onClick={() => toggleSpecialPop(pop)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    specialPop.includes(pop)
                      ? 'bg-green-mid text-white border-green-mid'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {t(`nurse.${pop}`)}
                </button>
              ))}
            </div>
          </Card>

          {/* Clinical Notes */}
          <Card>
            <label className="block text-sm font-semibold text-green-deep dark:text-green-light mb-2">{t('nurse.clinicalNotes')}</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder={t('nurse.clinicalNotesPlaceholder')} rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-green-mid resize-none" />
          </Card>

          {error && <Alert type="warning">{error}</Alert>}

          <Button variant="primary" size="lg" className="w-full" loading={loading} onClick={handleSubmit}>
            {loading ? t('nurse.generating') : t('nurse.generateReport')}
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
