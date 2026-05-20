import { pool } from '../db.js';
import { monthBounds } from '../schemas/index.js';

export async function incomeSavingsHistory(anchorMonth: string, n: number) {
  const rows = [];
  let [y, m] = anchorMonth.split('-').map(Number);
  for (let i = n - 1; i >= 0; i--) {
    let my = y, mm = m - i;
    while (mm <= 0) { mm += 12; my--; }
    const ym = `${my}-${String(mm).padStart(2, '0')}`;
    const { start, nextStart } = monthBounds(ym);
    const { rows: r } = await pool.query(
      `SELECT
         COALESCE(SUM(CASE WHEN amount_paise > 0 THEN  amount_paise ELSE 0 END), 0)::bigint AS "incomePaise",
         COALESCE(SUM(CASE WHEN amount_paise < 0 THEN -amount_paise ELSE 0 END), 0)::bigint AS "expensePaise"
       FROM transactions
       WHERE occurred_on >= $1 AND occurred_on < $2`,
      [start, nextStart],
    );
    const inc = Number(r[0].incomePaise);
    const exp = Number(r[0].expensePaise);
    rows.push({ month: ym, incomePaise: inc, expensePaise: exp, savingsPaise: inc - exp });
  }
  return rows;
}

export async function monthlySpend(month: string) {
  const { start, nextStart } = monthBounds(month);
  const { rows } = await pool.query(
    `SELECT c.id              AS "categoryId",
            c.name            AS name,
            c.color           AS color,
            COALESCE(SUM(CASE WHEN t.amount_paise < 0 THEN -t.amount_paise ELSE 0 END), 0)::bigint AS "spentPaise"
       FROM categories c
       LEFT JOIN transactions t
              ON t.category_id = c.id
             AND t.occurred_on >= $1
             AND t.occurred_on <  $2
      GROUP BY c.id, c.name, c.color
      HAVING COALESCE(SUM(CASE WHEN t.amount_paise < 0 THEN -t.amount_paise ELSE 0 END), 0) > 0
      ORDER BY "spentPaise" DESC`,
    [start, nextStart],
  );
  return rows;
}

export async function budgetVsActual(month: string) {
  const { start, nextStart } = monthBounds(month);
  const { rows } = await pool.query(
    `SELECT c.id    AS "categoryId",
            c.name  AS name,
            c.color AS color,
            COALESCE(b.amount_paise, 0)::bigint AS "budgetPaise",
            COALESCE(SUM(CASE WHEN t.amount_paise < 0 THEN -t.amount_paise ELSE 0 END), 0)::bigint AS "spentPaise"
       FROM categories c
       LEFT JOIN budgets b
              ON b.category_id = c.id
             AND b.month       = $1
       LEFT JOIN transactions t
              ON t.category_id = c.id
             AND t.occurred_on >= $1
             AND t.occurred_on <  $2
      GROUP BY c.id, c.name, c.color, b.amount_paise
      HAVING COALESCE(b.amount_paise, 0) > 0
          OR COALESCE(SUM(CASE WHEN t.amount_paise < 0 THEN -t.amount_paise ELSE 0 END), 0) > 0
      ORDER BY c.name`,
    [start, nextStart],
  );
  return rows;
}
