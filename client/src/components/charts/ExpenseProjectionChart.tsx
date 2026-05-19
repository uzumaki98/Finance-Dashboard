import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useQueries } from '@tanstack/react-query';
import { api, fmtINR } from '../../api/client';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import type { MonthlySpend } from '../../types';

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Dining',     color: '#ef4444', inflation: 0.030, note: '+3.0% food & labour costs' },
  { name: 'Groceries',  color: '#10b981', inflation: 0.085, note: '+3.5% food CPI + 5% monsoon onset' },
  { name: 'Rent',       color: '#6366f1', inflation: 0.000, note: 'Fixed contract' },
  { name: 'Utilities',  color: '#f59e0b', inflation: 0.025, note: '+2.5% tariff hike, peak summer' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function prevMonths(current: string, n: number): string[] {
  const months: string[] = [];
  let [y, m] = current.split('-').map(Number);
  for (let i = 0; i < n; i++) {
    m--; if (m === 0) { m = 12; y--; }
    months.unshift(`${y}-${String(m).padStart(2, '0')}`);
  }
  return months;
}

function nextMonth(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
}

function spendForCategory(data: MonthlySpend[], catName: string): number {
  return Math.round((data.find((d) => d.name === catName)?.spentPaise ?? 0) / 100);
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const isProj = payload[0]?.payload?.projected;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs min-w-[170px]">
      <p className="font-semibold text-slate-700 mb-1.5">
        {label}{isProj ? ' (projected)' : ''}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.dataKey}</span>
          <span className="font-medium text-slate-700">{fmtINR(p.value * 100)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
export function ExpenseProjectionChart({ month }: { month: string }) {
  const historicalMonths = prevMonths(month, 3);
  const allActualMonths  = [...historicalMonths, month];
  const projMonth        = nextMonth(month);

  const results = useQueries({
    queries: allActualMonths.map((m) => ({
      queryKey: ['monthly-spend', m],
      queryFn: () => api.get<MonthlySpend[]>(`/api/reports/monthly-spend?month=${m}`),
    })),
  });

  if (results.some((r) => r.isLoading)) {
    return <Card title="Expense Trend & Projection"><Spinner /></Card>;
  }

  // Build one row per month, with a column per category
  const chartData = allActualMonths.map((m, i) => {
    const row: Record<string, any> = { month: monthLabel(m), projected: false };
    for (const cat of CATEGORIES) {
      row[cat.name] = results[i].data ? spendForCategory(results[i].data!, cat.name) : 0;
    }
    return row;
  });

  // Projected row — apply inflation to last actual month
  const lastData = results[results.length - 1].data ?? [];
  const projRow: Record<string, any> = { month: monthLabel(projMonth), projected: true };
  for (const cat of CATEGORIES) {
    projRow[cat.name] = Math.round(spendForCategory(lastData, cat.name) * (1 + cat.inflation));
  }
  chartData.push(projRow);

  return (
    <Card
      title="Expense Trend & Projection"
      action={<span className="text-xs text-slate-400">India CPI Apr 2026 + monsoon factor</span>}
    >
      {/* 50% padding-bottom = half-width square */}
      <div style={{ width: '100%', paddingBottom: '50%', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />

            {/* Separator between actuals and projection */}
            <ReferenceLine
              x={monthLabel(month)}
              stroke="#cbd5e1"
              strokeDasharray="4 3"
              label={{ value: 'projected →', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
            />

            {CATEGORIES.map((cat) => (
              <Line
                key={cat.name}
                type="monotone"
                dataKey={cat.name}
                stroke={cat.color}
                strokeWidth={2.5}
                dot={(props: any) => {
                  const isProj = props.payload?.projected;
                  return (
                    <circle
                      key={`${cat.name}-${props.index}`}
                      cx={props.cx} cy={props.cy}
                      r={isProj ? 6 : 4}
                      fill={isProj ? 'white' : cat.color}
                      stroke={cat.color}
                      strokeWidth={isProj ? 2.5 : 0}
                    />
                  );
                }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Per-category projection delta */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {CATEGORIES.map((cat) => {
          const actual    = chartData[chartData.length - 2][cat.name] as number;
          const projected = projRow[cat.name] as number;
          const delta     = projected - actual;
          return (
            <div key={cat.name} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-medium text-slate-700">{cat.name}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{fmtINR(projected * 100)}</p>
              <p className="text-xs text-slate-400">
                {delta > 0 ? '+' : ''}{fmtINR(delta * 100)} ({(cat.inflation * 100).toFixed(1)}%)
              </p>
            </div>
          );
        })}
      </div>

      <details className="mt-3">
        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 select-none">
          Inflation assumptions ▾
        </summary>
        <table className="mt-2 w-full text-xs text-slate-600">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-1 pr-4 font-medium">Category</th>
              <th className="py-1 pr-4 font-medium">Rate</th>
              <th className="py-1 font-medium">Basis</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat.name} className="border-b border-slate-50">
                <td className="py-1 pr-4 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </td>
                <td className="py-1 pr-4 font-medium text-amber-600">+{(cat.inflation * 100).toFixed(1)}%</td>
                <td className="py-1 text-slate-400">{cat.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-slate-400 italic">
          Source: India CPI April 2026 (Trading Economics, 3.48% headline).
          Monsoon onset factor (+5% food) applies June–July historically.
          Projections are estimates, not financial advice.
        </p>
      </details>
    </Card>
  );
}
