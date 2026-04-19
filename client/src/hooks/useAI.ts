import { useState } from 'react';
import { checkPatientInteraction, generateClinicalReport } from '../services/api';
import { getOfflineAdvice } from '../services/offlineAI';
import { useNetwork } from './useNetwork';
import type { PatientAIRequest, NurseAIRequest, AIResponse, ClinicalAIResponse, OfflineResult } from '../types';

export function usePatientAI() {
  const { isOnline } = useNetwork();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIResponse | OfflineResult | null>(null);

  const checkInteraction = async (data: PatientAIRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (isOnline) {
        const response = await checkPatientInteraction(data);
        setResult(response);
        return response;
      } else {
        const offlineResult = getOfflineAdvice(data.herbs, data.medications, data.condition);
        setResult(offlineResult);
        return offlineResult;
      }
    } catch (err) {
      // Fall back to offline if API fails
      const offlineResult = getOfflineAdvice(data.herbs, data.medications, data.condition);
      setResult(offlineResult);
      setError('Mtandao haupatikani. Unatumia ushauri wa msingi.');
      return offlineResult;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { checkInteraction, loading, error, result, reset, isOnline };
}

export function useNurseAI() {
  const { isOnline } = useNetwork();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClinicalAIResponse | OfflineResult | null>(null);

  const generateReport = async (data: NurseAIRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (isOnline) {
        const response = await generateClinicalReport(data);
        setResult(response);
        return response;
      } else {
        const offlineResult = getOfflineAdvice(
          data.herbs,
          data.plannedMeds,
          data.condition,
        );
        setResult(offlineResult);
        return offlineResult;
      }
    } catch (err) {
      const offlineResult = getOfflineAdvice(
        data.herbs,
        data.plannedMeds,
        data.condition,
      );
      setResult(offlineResult);
      setError('Mtandao haupatikani. Unatumia ushauri wa msingi.');
      return offlineResult;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { generateReport, loading, error, result, reset, isOnline };
}
