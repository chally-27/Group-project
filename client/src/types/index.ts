export interface Herb {
  id: string;
  nameSwahili: string;
  nameEnglish: string;
  scientificName: string;
  category: 'antimalarial' | 'digestive' | 'immune' | 'cardiovascular' | 'analgesic' | 'respiratory' | 'other';
  commonUses: string[];
  activeCompounds: string[];
  knownInteractions: HerbDrugInteraction[];
  contraindications: string[];
  pregnancySafety: SafetyLevel;
  pediatricSafety: SafetyLevel;
}

export type SafetyLevel = 'safe' | 'caution' | 'avoid' | 'unknown';

export interface HerbDrugInteraction {
  drug: string;
  severity: 'mild' | 'moderate' | 'severe';
  mechanism: string;
  effect: string;
  recommendation: string;
  washoutDays: number;
}

export interface Drug {
  id: string;
  nameGeneric: string;
  nameBrand: string[];
  category: string;
  commonUsesTz: string[];
}

export interface Consultation {
  id?: number;
  type: 'patient' | 'nurse';
  herbs: string[];
  medications: string[];
  condition?: string;
  riskLevel: 'high' | 'medium' | 'low';
  aiResponse: string;
  isOffline: boolean;
  createdAt: Date;
  patientRef?: string;
}

export interface PatientRecord {
  id?: number;
  name: string;
  age?: number;
  gender?: string;
  weight?: number;
  createdAt: Date;
}

export interface PendingItem {
  id?: number;
  type: string;
  payload: string;
  createdAt: Date;
}

export interface PatientAIRequest {
  herbs: string[];
  medications: string[];
  condition: string;
  extraInfo?: string;
}

export interface NurseAIRequest {
  herbs: string[];
  timing: string;
  condition: string;
  plannedMeds: string[];
  age: number;
  gender: string;
  weight: number;
  pregnant: boolean;
  chronic: string[];
  specialPopulation: string[];
  notes?: string;
}

export interface AIResponse {
  riskLevel: 'high' | 'medium' | 'low';
  advice: string;
  timestamp: string;
}

export interface ClinicalAIResponse {
  riskLevel: 'high' | 'medium' | 'low';
  clinicalReport: string;
  recommendations: string;
  timestamp: string;
}

export type RiskLevel = 'high' | 'medium' | 'low';

export interface OfflineResult {
  riskLevel: RiskLevel;
  interactions: {
    herb: string;
    drug: string;
    severity: string;
    effect: string;
    recommendation: string;
    washoutDays: number;
  }[];
  advice: string;
  isOffline: true;
}
