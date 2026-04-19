import type { PatientAIRequest, NurseAIRequest, AIResponse, ClinicalAIResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchJSON<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }

  return response.json();
}

export async function checkPatientInteraction(data: PatientAIRequest): Promise<AIResponse> {
  return fetchJSON<AIResponse>('/api/ai/patient', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function generateClinicalReport(data: NurseAIRequest): Promise<ClinicalAIResponse> {
  return fetchJSON<ClinicalAIResponse>('/api/ai/nurse', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function checkHealth(): Promise<{ status: string; aiConnected: boolean }> {
  return fetchJSON('/api/health', { method: 'GET' });
}
