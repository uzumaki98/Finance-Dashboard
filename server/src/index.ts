import express from 'express';
import cors from 'cors';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';
import { errorHandler } from './middleware/error.js';
import { categoriesRouter } from './routes/categories.js';
import { transactionsRouter } from './routes/transactions.js';
import { budgetsRouter } from './routes/budgets.js';
import { reportsRouter } from './routes/reports.js';
import { alertsRouter } from './routes/alerts.js';

const here = dirname(fileURLToPath(import.meta.url));
const readmePath = resolve(here, '../../..', 'README.md');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/README.md', (_req, res) => {
  const md = readFileSync(readmePath, 'utf8');
  res.type('text/plain; charset=utf-8').send(md);
});
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/budgets', budgetsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/alerts', alertsRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`server listening on http://localhost:${env.PORT}`);
});
