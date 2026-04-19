import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { herbs } from '../data/herbs';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import type { Herb } from '../types';

export function EducationPage() {
  const { t, i18n } = useTranslation();
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);

  const getName = (herb: Herb) =>
    i18n.language === 'en' ? herb.nameEnglish : herb.nameSwahili;

  const safetyColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-risk-low';
      case 'caution': return 'text-risk-medium';
      case 'avoid': return 'text-risk-high';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-green-deep dark:text-green-light">
        {t('education.title')}
      </h2>

      {/* Washout Info */}
      <Card className="bg-gold-light dark:bg-gold/10 border-gold">
        <h3 className="font-display font-bold text-green-deep dark:text-gold mb-2">
          {t('education.whatIsWashout')}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {t('education.washoutExplain')}
        </p>
      </Card>

      {/* Did You Know */}
      <Card className="bg-green-pale dark:bg-green-mid/10">
        <h3 className="font-display font-bold text-green-deep dark:text-green-light mb-2">
          {t('education.didYouKnow')}
        </h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          <li>🌿 Muarobaini (Neem) unatumika kwa zaidi ya magonjwa 40 nchini Tanzania, lakini unaweza kupunguza ufanisi wa dawa za malaria kwa 50%+</li>
          <li>🧄 Vitunguu Saumu vinaweza kupunguza kiwango cha dawa za ARV (Saquinavir) kwa nusu - hatari kwa wagonjwa wa VVU</li>
          <li>🌸 Catharanthus roseus (Mzuzu) una Vincristine ambayo ni dawa ya chemotherapy - usitumie bila ushauri wa daktari</li>
          <li>🫚 Tangawizi na Aspirin pamoja vinaongeza hatari ya kutoka damu ya tumbo</li>
        </ul>
      </Card>

      {/* Herb Cards */}
      <h3 className="font-display font-bold text-green-deep dark:text-green-light">
        {t('education.commonHerbs')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {herbs.map((herb) => (
          <Card key={herb.id} onClick={() => setSelectedHerb(herb)} className="cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-green-deep dark:text-green-light">{getName(herb)}</h4>
                <p className="text-xs italic text-gray-500 dark:text-gray-400">{herb.scientificName}</p>
              </div>
              <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{herb.category}</span>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>{t('education.interactions')}: <strong>{herb.knownInteractions.length}</strong></span>
              <span className={safetyColor(herb.pregnancySafety)}>Ujauzito: {herb.pregnancySafety}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Herb Detail Modal */}
      <Modal isOpen={!!selectedHerb} onClose={() => setSelectedHerb(null)} title={selectedHerb ? getName(selectedHerb) : ''}>
        {selectedHerb && (
          <div className="space-y-4">
            <p className="text-sm italic text-gray-500">{selectedHerb.scientificName}</p>

            <div>
              <h4 className="text-sm font-semibold mb-1">{t('education.uses')}</h4>
              <div className="flex flex-wrap gap-1">
                {selectedHerb.commonUses.map((use) => (
                  <span key={use} className="px-2 py-0.5 bg-green-pale dark:bg-green-mid/20 text-green-deep dark:text-green-light text-xs rounded-full">{use}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-1">{t('education.safety')}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Ujauzito: <span className={`font-semibold ${safetyColor(selectedHerb.pregnancySafety)}`}>{selectedHerb.pregnancySafety}</span></div>
                <div>Watoto: <span className={`font-semibold ${safetyColor(selectedHerb.pediatricSafety)}`}>{selectedHerb.pediatricSafety}</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">{t('education.interactions')} ({selectedHerb.knownInteractions.length})</h4>
              <div className="space-y-2">
                {selectedHerb.knownInteractions.map((interaction, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <strong>{selectedHerb.nameSwahili} ↔ {interaction.drug}</strong>
                      <Badge risk={interaction.severity === 'severe' ? 'high' : interaction.severity === 'moderate' ? 'medium' : 'low'} />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{interaction.effect}</p>
                    <p className="text-green-mid font-medium">{interaction.recommendation}</p>
                    <p className="text-xs text-gray-400 mt-1">Washout: {interaction.washoutDays} siku</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedHerb.contraindications.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-1 text-risk-high">Vikwazo</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                  {selectedHerb.contraindications.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
