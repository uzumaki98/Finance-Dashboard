import express from 'express';
import cors from 'cors';
import { env } from './env.js';
import { errorHandler } from './middleware/error.js';
import { categoriesRouter } from './routes/categories.js';
import { transactionsRouter } from './routes/transactions.js';
import { budgetsRouter } from './routes/budgets.js';
import { reportsRouter } from './routes/reports.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/reports', reportsRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`server listening on http://localhost:${env.PORT}`);
});
