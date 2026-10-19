import express, { Application, Request, Response } from 'express';
import { SuccessMessage, SuccessStatus } from './constants/successMessages';

const app: Application = express();

app.use(express.json());

// Routes will be added here
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: SuccessStatus.OK, message: SuccessMessage.BACKEND_RUNNING });
});

export default app;
