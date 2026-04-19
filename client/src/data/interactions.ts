import { herbs } from './herbs';
import type { RiskLevel } from '../types';

export interface InteractionLookup {
  herbId: string;
  herbName: string;
  drugName: string;
  severity: string;
  effect: string;
  recommendation: string;
  washoutDays: number;
}

/**
 * Build a flat lookup table of all known herb-drug interactions
 * from the static herbs database (for offline use).
 */
export function getAllInteractions(): InteractionLookup[] {
  const result: InteractionLookup[] = [];
  for (const herb of herbs) {
    for (const interaction of herb.knownInteractions) {
      result.push({
        herbId: herb.id,
        herbName: herb.nameSwahili,
        drugName: interaction.drug,
        severity: interaction.severity,
        effect: interaction.effect,
        recommendation: interaction.recommendation,
        washoutDays: interaction.washoutDays,
      });
    }
  }
  return result;
}

/**
 * Find interactions between selected herbs and drugs.
 */
export function findInteractions(
  herbIds: string[],
  drugNames: string[],
): InteractionLookup[] {
  const allInteractions = getAllInteractions();
  const drugNamesLower = drugNames.map((d) => d.toLowerCase());

  return allInteractions.filter(
    (i) =>
      herbIds.includes(i.herbId) &&
      drugNamesLower.some(
        (d) =>
          i.drugName.toLowerCase().includes(d) ||
          d.includes(i.drugName.toLowerCase()),
      ),
  );
}

/**
 * Determine overall risk level from a set of interactions.
 */
export function getOverallRisk(interactions: InteractionLookup[]): RiskLevel {
  if (interactions.some((i) => i.severity === 'severe')) return 'high';
  if (interactions.some((i) => i.severity === 'moderate')) return 'medium';
  if (interactions.length > 0) return 'low';
  return 'low';
}
