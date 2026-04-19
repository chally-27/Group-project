import Dexie, { type Table } from 'dexie';
import type { Consultation, PatientRecord, PendingItem } from '../types';

class DawaSalamaDB extends Dexie {
  consultations!: Table<Consultation>;
  patients!: Table<PatientRecord>;
  pendingSync!: Table<PendingItem>;

  constructor() {
    super('DawaSalamaDB');
    this.version(1).stores({
      consultations: '++id, type, createdAt, riskLevel, patientRef',
      patients: '++id, name, createdAt',
      pendingSync: '++id, type, payload, createdAt',
    });
  }
}

export const db = new DawaSalamaDB();

// Helper functions
export async function saveConsultation(consultation: Omit<Consultation, 'id'>): Promise<number> {
  return db.consultations.add(consultation as Consultation);
}

export async function getConsultations(limit = 30): Promise<Consultation[]> {
  return db.consultations.orderBy('createdAt').reverse().limit(limit).toArray();
}

export async function getConsultationById(id: number): Promise<Consultation | undefined> {
  return db.consultations.get(id);
}

export async function deleteConsultation(id: number): Promise<void> {
  await db.consultations.delete(id);
}

export async function clearAllData(): Promise<void> {
  await db.consultations.clear();
  await db.patients.clear();
  await db.pendingSync.clear();
}

export async function addPendingSync(type: string, payload: object): Promise<void> {
  await db.pendingSync.add({
    type,
    payload: JSON.stringify(payload),
    createdAt: new Date(),
  });
}

export async function getPendingSyncs(): Promise<PendingItem[]> {
  return db.pendingSync.toArray();
}

export async function clearPendingSyncs(): Promise<void> {
  await db.pendingSync.clear();
}

export async function exportConsultationsCSV(): Promise<string> {
  const consultations = await db.consultations.toArray();
  const headers = ['ID', 'Type', 'Herbs', 'Medications', 'Risk Level', 'Created At', 'Offline'];
  const rows = consultations.map((c) => [
    c.id,
    c.type,
    JSON.stringify(c.herbs),
    JSON.stringify(c.medications),
    c.riskLevel,
    c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
    c.isOffline ? 'Yes' : 'No',
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
