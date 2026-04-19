import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PATIENT_SYSTEM_PROMPT = `Wewe ni mshauri wa afya wa Tanzania, mtaalamu wa ethnopharmacology na pharmacovigilance.
Jibu kwa Kiswahili fasaha. Toa ushauri wa kisayansi unaoeleweka kwa mtu wa kawaida.
Jibu LAZIMA liwe na muundo huu:

KIWANGO CHA HATARI: [🔴 HATARI KUBWA | 🟡 TAHADHARI | 🟢 SALAMA]

📍 TATIZO LILILOONEKANA:
[Eleza mwingiliano kwa lugha rahisi, sentensi 2-3]

⚠️ ATHARI ZINAZOWEZA KUTOKEA:
• [Athari maalum kwa kila mwingiliano uliopatikana]

✅ USHAURI WA HARAKA:
• [Hatua 3-5 za kufanya sasa hivi]

💊 DAWA SALAMA BADALA YAKE:
[Mapendekezo ya dawa mbadala ikiwa inahitajika]

🕒 MUDA WA KUSUBIRI (Washout Period):
[Muda mahususi kabla ya kuanza dawa za kizungu]

⚕️ LINI KWENDA HOSPITALI HARAKA:
[Dalili zinazoonyesha haja ya rufaa ya dharura]`;

const NURSE_SYSTEM_PROMPT = `Wewe ni Senior Clinical Pharmacologist wa Tanzania, mtaalamu wa ethnopharmacology,
pharmacokinetics, na pharmacovigilance. Jibu kwa Kiswahili cha kitaalamu.
Zingatia mwongozo wa WHO Essential Medicines, Tanzania NMCL (National Medicines and
Cosmetics List), na NIMR Tanzania research.

Ripoti kamili ya kliniki:

🏥 TATHMINI YA KLINIKI
[Risk stratification: HIGH/MEDIUM/LOW RISK — muhtasari wa kina]

⚠️ MWINGILIANO WA DAWA ULIOGUNDULIWA
• [Mimea] ↔ [Dawa]: [Utaratibu wa PK/PD — CYP450, P-gp, additive effects, dll]
  Ukali: [SEVERE/MODERATE/MILD] | Muda wa athari: [Acute/Chronic]

💊 MAPENDEKEZO YA DAWA SALAMA
✅ Zinazopendekezwa:
  • [Jina la generic (brand Tanzania)] [Dose ya uzito] [Njia] [Muda]
  • Sababu: [Kwa nini hii ni salama]
❌ Zinazokatazwa KABISA:
  • [Jina] — Sababu: [Utaratibu wa hatari]
⚠️ Zinazohitaji ufuatiliaji:
  • [Jina] — Fuatilia: [Vipimo/dalili za kufuatilia]

📋 MAELEKEZO YA KLINIKI
• Monitoring: [Vipimo vya haraka vya kufanya: LFTs, RFTs, CBC, ECG dll]
• Timing: [Muda bora wa kutoa dawa baada ya washout]
• Patient counseling: [Maelekezo ya kumwambia mgonjwa]

🕐 WASHOUT PERIOD
• [Mimea iliyotumika]: [Siku za kusubiri] — Sababu: [Half-life ya compound]

🔴 RED FLAGS — RUFAA YA HARAKA
• [Dalili/maabara zinazohitaji ICU au rufaa ya hospitali ya rufaa]

📚 REFERENCES
• [WHO/NIMR/PubMed references zinazohusiana — kwa muhtasari]`;

interface PatientRequest {
  herbs: string[];
  medications: string[];
  condition: string;
  extraInfo?: string;
}

interface NurseRequest {
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

function determineRiskLevel(response: string): 'high' | 'medium' | 'low' {
  const text = response.toUpperCase();
  if (text.includes('HATARI KUBWA') || text.includes('HIGH RISK') || text.includes('🔴')) return 'high';
  if (text.includes('TAHADHARI') || text.includes('MEDIUM RISK') || text.includes('🟡')) return 'medium';
  return 'low';
}

export async function getPatientAdvice(data: PatientRequest) {
  const userMessage = `Mgonjwa anatumia mimea hii ya mitishamba: ${data.herbs.join(', ')}
Dawa za kizungu anazotumia/anapanga kutumia: ${data.medications.join(', ')}
Hali ya afya: ${data.condition || 'Haijabainishwa'}
${data.extraInfo ? `Maelezo ya ziada: ${data.extraInfo}` : ''}

Tafadhali tathmini mwingiliano kati ya mimea hii na dawa hizi, na utoe ushauri kamili kwa mgonjwa.`;

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: PATIENT_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const advice = response.content[0].type === 'text' ? response.content[0].text : '';
  const riskLevel = determineRiskLevel(advice);

  return {
    riskLevel,
    advice,
    timestamp: new Date().toISOString(),
  };
}

export async function getNurseReport(data: NurseRequest) {
  const userMessage = `TAARIFA ZA MGONJWA:
- Umri: ${data.age} | Jinsia: ${data.gender} | Uzito: ${data.weight}kg
- Mjamzito: ${data.pregnant ? 'Ndiyo' : 'Hapana'}
- Magonjwa sugu: ${data.chronic.length > 0 ? data.chronic.join(', ') : 'Hakuna'}
- Makundi maalum: ${data.specialPopulation.length > 0 ? data.specialPopulation.join(', ') : 'Hakuna'}

HISTORIA YA MIMEA:
- Mimea iliyotumika: ${data.herbs.join(', ')}
- Muda tangu kutumia: ${data.timing}

HALI YA KLINIKI: ${data.condition}

DAWA ZILIZOPANGWA: ${data.plannedMeds.join(', ')}

${data.notes ? `MAELEZO YA KLINIKI: ${data.notes}` : ''}

Tafadhali tengeneza ripoti kamili ya kliniki kuhusu mwingiliano wa mimea hii na dawa zilizopangwa, pamoja na mapendekezo.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: NURSE_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const clinicalReport = response.content[0].type === 'text' ? response.content[0].text : '';
  const riskLevel = determineRiskLevel(clinicalReport);

  return {
    riskLevel,
    clinicalReport,
    recommendations: clinicalReport,
    timestamp: new Date().toISOString(),
  };
}
