import { herbs } from '../data/herbs';
import { findInteractions, getOverallRisk } from '../data/interactions';
import type { OfflineResult, RiskLevel } from '../types';

/**
 * Offline AI fallback: uses the static interactions database
 * to provide basic advice when there is no network connection.
 */
export function getOfflineAdvice(
  herbIds: string[],
  drugNames: string[],
  _condition: string,
): OfflineResult {
  const interactions = findInteractions(herbIds, drugNames);
  const riskLevel: RiskLevel = getOverallRisk(interactions);

  const selectedHerbs = herbs.filter((h) => herbIds.includes(h.id));

  let advice = '';

  if (interactions.length === 0) {
    advice = `Hakuna mwingiliano unaojulikana kati ya mimea na dawa ulizochagua kwenye hifadhidata yetu ya ndani.\n\n`;
    advice += `Hata hivyo, hii haimaanishi hakuna hatari. Tafadhali wasiliana na daktari au pharmacist kwa ushauri kamili wakati mtandao unapatikana.`;
  } else {
    advice = `⚠️ HALI YA NJE YA MTANDAO — Ushauri wa Msingi\n\n`;

    const riskLabel =
      riskLevel === 'high'
        ? '🔴 HATARI KUBWA'
        : riskLevel === 'medium'
          ? '🟡 TAHADHARI'
          : '🟢 SALAMA';

    advice += `KIWANGO CHA HATARI: ${riskLabel}\n\n`;
    advice += `📍 MWINGILIANO ULIOGUNDULIWA:\n\n`;

    for (const interaction of interactions) {
      const severityIcon =
        interaction.severity === 'severe'
          ? '🔴'
          : interaction.severity === 'moderate'
            ? '🟡'
            : '🟢';
      advice += `${severityIcon} ${interaction.herbName} ↔ ${interaction.drugName}\n`;
      advice += `   Athari: ${interaction.effect}\n`;
      advice += `   Ushauri: ${interaction.recommendation}\n`;
      advice += `   Muda wa kusubiri: Siku ${interaction.washoutDays}\n\n`;
    }

    advice += `✅ USHAURI WA HARAKA:\n`;
    advice += `• Usitumie mimea na dawa hizi pamoja bila ushauri wa daktari\n`;
    advice += `• Wakati mtandao unapatikana, tumia tena mfumo huu kupata ushauri kamili wa AI\n`;

    if (riskLevel === 'high') {
      advice += `• NENDA HOSPITALI HARAKA ikiwa unapata dalili zozote za hatari\n`;
    }

    // Add contraindications for selected herbs
    const contras = selectedHerbs.filter((h) => h.contraindications.length > 0);
    if (contras.length > 0) {
      advice += `\n⚠️ VIKWAZO:\n`;
      for (const herb of contras) {
        advice += `• ${herb.nameSwahili}: ${herb.contraindications.join(', ')}\n`;
      }
    }

    // Add pregnancy/pediatric warnings
    const pregWarnings = selectedHerbs.filter((h) => h.pregnancySafety === 'avoid');
    if (pregWarnings.length > 0) {
      advice += `\n🤰 UJAUZITO — EPUKA:\n`;
      for (const herb of pregWarnings) {
        advice += `• ${herb.nameSwahili} — Usitumie wakati wa ujauzito\n`;
      }
    }
  }

  return {
    riskLevel,
    interactions: interactions.map((i) => ({
      herb: i.herbName,
      drug: i.drugName,
      severity: i.severity,
      effect: i.effect,
      recommendation: i.recommendation,
      washoutDays: i.washoutDays,
    })),
    advice,
    isOffline: true,
  };
}
