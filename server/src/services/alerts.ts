import { pool } from '../db.js';
import { monthBounds } from '../schemas/index.js';

export type AlertStatusItem = {
  categoryId: number;
  categoryName: string;
  budgetPaise: number;
  actualPaise: number;
  overagePaise: number;
};

export type AlertStatus = {
  overBudget: boolean;
  alerts: AlertStatusItem[];
};

export async function alertStatus(month: string): Promise<AlertStatus> {
  const { start, nextStart } = monthBounds(month);
  const { rows } = await pool.query<{
    categoryId: number;
    categoryName: string;
    budgetPaise: number;
    actualPaise: number;
  }>(
    `SELECT c.id    AS "categoryId",
            c.name  AS "categoryName",
            b.amount_paise::bigint AS "budgetPaise",
            COALESCE(SUM(CASE WHEN t.amount_paise < 0 THEN -t.amount_paise ELSE 0 END), 0)::bigint AS "actualPaise"
       FROM categories c
       JOIN budgets b
         ON b.category_id = c.id
        AND b.month = $1
       LEFT JOIN transactions t
              ON t.category_id = c.id
             AND t.occurred_on >= $1
             AND t.occurred_on <  $2
      GROUP BY c.id, c.name, b.amount_paise
     HAVING COALESCE(SUM(CASE WHEN t.amount_paise < 0 THEN -t.amount_paise ELSE 0 END), 0) > b.amount_paise
      ORDER BY "actualPaise" DESC`,
    [start, nextStart],
  );

  const alerts: AlertStatusItem[] = rows.map((r) => ({
    ...r,
    overagePaise: r.actualPaise - r.budgetPaise,
  }));

  return { overBudget: alerts.length > 0, alerts };
}
