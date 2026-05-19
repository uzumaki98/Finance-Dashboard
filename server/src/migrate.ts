import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './db.js';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, '..', 'migrations');

async function run() {
  // Track applied migrations so each file runs exactly once.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name       TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const { rows: applied } = await pool.query('SELECT name FROM _migrations');
  const done = new Set(applied.map((r: { name: string }) => r.name));

  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  for (const f of files) {
    if (done.has(f)) {
      console.log(`skipping ${f} (already applied)`);
      continue;
    }
    const sql = readFileSync(join(migrationsDir, f), 'utf8');
    process.stdout.write(`applying ${f}... `);
    await pool.query(sql);
    await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [f]);
    console.log('ok');
  }
  await pool.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
