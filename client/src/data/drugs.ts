import { Drug } from '../types';

export const drugs: Drug[] = [
  { id: 'artemether-lumefantrine', nameGeneric: 'Artemether-Lumefantrine', nameBrand: ['Coartem', 'ALu'], category: 'Antimalarial', commonUsesTz: ['Malaria'] },
  { id: 'quinine', nameGeneric: 'Quinine', nameBrand: ['Quinine Sulphate'], category: 'Antimalarial', commonUsesTz: ['Malaria kali'] },
  { id: 'warfarin', nameGeneric: 'Warfarin', nameBrand: ['Coumadin', 'Marevan'], category: 'Anticoagulant', commonUsesTz: ['Blood clots', 'Atrial fibrillation'] },
  { id: 'aspirin', nameGeneric: 'Aspirin', nameBrand: ['Disprin', 'Aspro'], category: 'Antiplatelet/Analgesic', commonUsesTz: ['Maumivu', 'Homa', 'Heart protection'] },
  { id: 'metformin', nameGeneric: 'Metformin', nameBrand: ['Glucophage'], category: 'Antidiabetic', commonUsesTz: ['Kisukari aina ya 2'] },
  { id: 'glibenclamide', nameGeneric: 'Glibenclamide', nameBrand: ['Daonil', 'Glyburide'], category: 'Antidiabetic', commonUsesTz: ['Kisukari aina ya 2'] },
  { id: 'efavirenz', nameGeneric: 'Efavirenz', nameBrand: ['Stocrin', 'Sustiva'], category: 'ARV (NNRTI)', commonUsesTz: ['VVU/UKIMWI'] },
  { id: 'nevirapine', nameGeneric: 'Nevirapine', nameBrand: ['Viramune'], category: 'ARV (NNRTI)', commonUsesTz: ['VVU/UKIMWI'] },
  { id: 'saquinavir', nameGeneric: 'Saquinavir', nameBrand: ['Invirase'], category: 'ARV (PI)', commonUsesTz: ['VVU/UKIMWI'] },
  { id: 'levothyroxine', nameGeneric: 'Levothyroxine', nameBrand: ['Euthyrox', 'Synthroid'], category: 'Thyroid', commonUsesTz: ['Hypothyroidism'] },
  { id: 'digoxin', nameGeneric: 'Digoxin', nameBrand: ['Lanoxin'], category: 'Cardiac Glycoside', commonUsesTz: ['Heart failure', 'Atrial fibrillation'] },
  { id: 'furosemide', nameGeneric: 'Furosemide', nameBrand: ['Lasix'], category: 'Diuretic', commonUsesTz: ['Edema', 'Heart failure', 'Hypertension'] },
  { id: 'spironolactone', nameGeneric: 'Spironolactone', nameBrand: ['Aldactone'], category: 'Potassium-sparing Diuretic', commonUsesTz: ['Heart failure', 'Edema'] },
  { id: 'amlodipine', nameGeneric: 'Amlodipine', nameBrand: ['Norvasc', 'Amlopin'], category: 'Antihypertensive (CCB)', commonUsesTz: ['Shinikizo la damu'] },
  { id: 'nifedipine', nameGeneric: 'Nifedipine', nameBrand: ['Adalat'], category: 'Antihypertensive (CCB)', commonUsesTz: ['Shinikizo la damu'] },
  { id: 'phenytoin', nameGeneric: 'Phenytoin', nameBrand: ['Dilantin', 'Epanutin'], category: 'Antiepileptic', commonUsesTz: ['Kifafa'] },
  { id: 'propranolol', nameGeneric: 'Propranolol', nameBrand: ['Inderal'], category: 'Beta-blocker', commonUsesTz: ['Shinikizo la damu', 'Anxiety', 'Migraine'] },
  { id: 'theophylline', nameGeneric: 'Theophylline', nameBrand: ['Theo-Dur'], category: 'Bronchodilator', commonUsesTz: ['Pumu', 'COPD'] },
  { id: 'ibuprofen', nameGeneric: 'Ibuprofen', nameBrand: ['Brufen', 'Advil'], category: 'NSAID', commonUsesTz: ['Maumivu', 'Homa', 'Kuvimba'] },
  { id: 'paracetamol', nameGeneric: 'Paracetamol', nameBrand: ['Panadol', 'Tylenol'], category: 'Analgesic', commonUsesTz: ['Maumivu', 'Homa'] },
  { id: 'isoniazid', nameGeneric: 'Isoniazid', nameBrand: ['INH'], category: 'Anti-TB', commonUsesTz: ['Kifua kikuu (TB)'] },
  { id: 'cyclosporine', nameGeneric: 'Cyclosporine', nameBrand: ['Sandimmune', 'Neoral'], category: 'Immunosuppressant', commonUsesTz: ['Transplant rejection', 'Autoimmune'] },
  { id: 'cyclophosphamide', nameGeneric: 'Cyclophosphamide', nameBrand: ['Endoxan'], category: 'Chemotherapy', commonUsesTz: ['Cancer'] },
  { id: 'methotrexate', nameGeneric: 'Methotrexate', nameBrand: ['Trexall'], category: 'Chemotherapy/Immunosuppressant', commonUsesTz: ['Cancer', 'Rheumatoid arthritis'] },
  { id: 'ferrous-sulfate', nameGeneric: 'Ferrous Sulfate', nameBrand: ['Fefol', 'Fer-In-Sol'], category: 'Iron Supplement', commonUsesTz: ['Upungufu wa damu (Anemia)'] },
  { id: 'phenelzine', nameGeneric: 'Phenelzine', nameBrand: ['Nardil'], category: 'MAOI Antidepressant', commonUsesTz: ['Depression'] },
  { id: 'amitriptyline', nameGeneric: 'Amitriptyline', nameBrand: ['Elavil', 'Tryptanol'], category: 'Tricyclic Antidepressant', commonUsesTz: ['Depression', 'Neuropathic pain'] },
  { id: 'clopidogrel', nameGeneric: 'Clopidogrel', nameBrand: ['Plavix'], category: 'Antiplatelet', commonUsesTz: ['Heart attack prevention', 'Stroke prevention'] },
];

export function searchDrugs(query: string): Drug[] {
  const q = query.toLowerCase();
  return drugs.filter(
    (d) =>
      d.nameGeneric.toLowerCase().includes(q) ||
      d.nameBrand.some((b) => b.toLowerCase().includes(q)) ||
      d.category.toLowerCase().includes(q),
  );
}

export function getDrugById(id: string): Drug | undefined {
  return drugs.find((d) => d.id === id);
}
