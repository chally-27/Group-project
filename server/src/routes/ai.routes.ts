import { Router, Request, Response } from 'express';
import { getPatientAdvice, getNurseReport } from '../services/claude.service';

export const aiRouter = Router();

aiRouter.post('/patient', async (req: Request, res: Response) => {
  try {
    const { herbs, medications, condition, extraInfo } = req.body;

    if (!herbs || !Array.isArray(herbs) || herbs.length === 0) {
      res.status(400).json({ error: 'Tafadhali chagua angalau mmea mmoja' });
      return;
    }
    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      res.status(400).json({ error: 'Tafadhali chagua angalau dawa moja' });
      return;
    }

    const result = await getPatientAdvice({ herbs, medications, condition, extraInfo });
    res.json(result);
  } catch (error: any) {
    console.error('Patient AI error:', error.message);
    res.status(500).json({ error: 'Hitilafu ya mfumo wa AI. Tafadhali jaribu tena.' });
  }
});

aiRouter.post('/nurse', async (req: Request, res: Response) => {
  try {
    const {
      herbs, timing, condition, plannedMeds,
      age, gender, weight, pregnant, chronic,
      specialPopulation, notes,
    } = req.body;

    if (!herbs || !Array.isArray(herbs) || herbs.length === 0) {
      res.status(400).json({ error: 'Tafadhali chagua angalau mmea mmoja' });
      return;
    }

    const result = await getNurseReport({
      herbs, timing, condition, plannedMeds,
      age, gender, weight, pregnant,
      chronic: chronic || [],
      specialPopulation: specialPopulation || [],
      notes,
    });
    res.json(result);
  } catch (error: any) {
    console.error('Nurse AI error:', error.message);
    res.status(500).json({ error: 'Hitilafu ya mfumo wa AI. Tafadhali jaribu tena.' });
  }
});
