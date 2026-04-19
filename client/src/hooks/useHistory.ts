import { useState, useEffect, useCallback } from 'react';
import {
  getConsultations,
  saveConsultation,
  deleteConsultation,
  exportConsultationsCSV,
} from '../db/indexeddb';
import type { Consultation } from '../types';

export function useHistory() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConsultations(100);
      setConsultations(data);
    } catch (err) {
      console.error('Failed to load consultations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addConsultation = useCallback(
    async (consultation: Omit<Consultation, 'id'>) => {
      await saveConsultation(consultation);
      await refresh();
    },
    [refresh],
  );

  const removeConsultation = useCallback(
    async (id: number) => {
      await deleteConsultation(id);
      await refresh();
    },
    [refresh],
  );

  const exportCSV = useCallback(async () => {
    const csv = await exportConsultationsCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dawasalama-historia-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    consultations,
    loading,
    addConsultation,
    removeConsultation,
    exportCSV,
    refresh,
  };
}
