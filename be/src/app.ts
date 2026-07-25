import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { createApiRouter } from './presentation/routes/apiRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', createApiRouter());

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Lỗi server!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
