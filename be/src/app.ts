import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createApiRouter } from './presentation/routes/apiRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', createApiRouter());

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const message = err?.message || err?.toString?.() || 'Lỗi server!';
  res.status(err?.statusCode || 500).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
