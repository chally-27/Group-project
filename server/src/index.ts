import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { aiRouter } from './routes/ai.routes';
import { healthRouter } from './routes/health.routes';
import { rateLimiter } from './middleware/rateLimit.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// Rate limiting
app.use('/api/', rateLimiter);

// Routes
app.use('/api/ai', aiRouter);
app.use('/api', healthRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`DawaSalama API running on port ${PORT}`);
});

export default app;
