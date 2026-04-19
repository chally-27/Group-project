import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  const aiConnected = !!process.env.ANTHROPIC_API_KEY;
  res.json({
    status: 'ok',
    aiConnected,
    timestamp: new Date().toISOString(),
  });
});
