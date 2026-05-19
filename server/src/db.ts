import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({ connectionString: env.DATABASE_URL });

// pg returns BIGINT as string by default; coerce to number for our money fields.
// Safe here because paise stays well within Number.MAX_SAFE_INTEGER for personal use.
pg.types.setTypeParser(20, (v) => (v === null ? null : Number(v)));
