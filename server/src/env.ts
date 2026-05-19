import { config as dotenvConfig } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const here = dirname(fileURLToPath(import.meta.url));
// Load .env from repo root (../../.env relative to server/src/env.ts), then fall back to cwd.
dotenvConfig({ path: resolve(here, '../../.env') });
dotenvConfig();


const Env = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(4000),
});

export const env = Env.parse(process.env);
