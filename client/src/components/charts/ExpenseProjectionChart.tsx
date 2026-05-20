import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api, fmtINR } from '../../api/client';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import type { MonthlySpend } from '../../types';

const CATEGORIES = [
  { name: 'Dining',     color: '#f87171', glow: '#f87171', inflation: 0.030, note: '+3.0% food & labour costs',      chartLine: true  },
  { name: 'Groceries',  color: '#34d399', glow: '#34d399', inflation: 0.085, note: '+3.5% food CPI + 5% monsoon onset', chartLine: true  },
  { name: 'Rent',       color: '#818cf8', glow: '#818cf8', inflation: 0.000, note: 'Fixed contract',                 chartLine: false },
  { name: 'Utilities',  color: '#fbbf24', glow: '#fbbf24', inflation: 0.025, note: '+2.5% tariff hike, peak summer', chartLine: true  },
];

const CHART_CATS = CATEGORIES.filter((c) => c.chartLine);

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const isProj = payload[0]?.payload?.projected;
  return (
    <div className="rounded-xl border border-violet-100 shadow-lg px-3 py-2 text-xs min-w-[170px]"
         style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)' }}>
      <p className="font-semibold text-slate-700 mb-1.5">
        {label}{isProj ? ' (projected)' : ''}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.dataKey}</span>
          <span className="font-medium text-slate-600">{fmtINR(p.value * 100)}</span>
        </div>
      ))}
    </div>
  );
};

export function ExpenseProjectionChart({ month }: Readonly<{ month: string }>) {
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

  const hasAnyData = results.some((r) => r.data?.some((d) => d.spentPaise > 0));

  if (!hasAnyData) {
    return (
      <Card title="Expense Trend & Projection">
        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
          <span className="text-3xl">📈</span>
          <p className="text-sm font-medium text-slate-600">No spending data yet</p>
          <p className="text-xs text-slate-400">
            Once you record transactions across a few months, your expense trend and projections will appear here.
          </p>
        </div>
      </Card>
    );
  }

  const chartData = allActualMonths.map((m, i) => {
    const row: Record<string, any> = { month: monthLabel(m), projected: false };
    for (const cat of CATEGORIES) {
      row[cat.name] = results[i].data ? spendForCategory(results[i].data!, cat.name) : 0;
    }
    return row;
  });

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
      {/* SVG defs for line glow filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {CHART_CATS.map((cat) => (
            <filter key={cat.name} id={`glow-${cat.name}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>
      </svg>
      <p className="text-xs text-slate-400 mb-1">Rent (₹{projRow['Rent']?.toLocaleString('en-IN') ?? '—'}/mo, fixed) excluded from chart scale</p>

      <div style={{ width: '100%', height: 220, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <ReferenceLine
              x={monthLabel(month)}
              stroke="#cbd5e1"
              strokeDasharray="4 3"
              label={{ value: 'projected →', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8' }}
            />
            {CHART_CATS.map((cat) => (
              <Line
                key={cat.name}
                type="monotone"
                dataKey={cat.name}
                stroke={cat.color}
                strokeWidth={2.5}
                filter={`url(#glow-${cat.name})`}
                dot={(props: any) => {
                  const isProj = props.payload?.projected;
                  return (
                    <circle
                      key={`${cat.name}-${props.index}`}
                      cx={props.cx} cy={props.cy}
                      r={isProj ? 6 : 4}
                      fill={isProj ? 'rgba(240,239,248,0.95)' : cat.color}
                      stroke={cat.color}
                      strokeWidth={isProj ? 2.5 : 0}
                      style={{ filter: `drop-shadow(0 0 4px ${cat.glow})` }}
                    />
                  );
                }}
                activeDot={{ r: 7, style: { filter: `drop-shadow(0 0 8px ${cat.glow})` } }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Per-category projection delta cards */}
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {CATEGORIES.map((cat, i) => {
          const actual    = chartData[chartData.length - 2][cat.name] as number;
          const projected = projRow[cat.name] as number;
          const delta     = projected - actual;
          return (
            <motion.div
              key={cat.name}
              className="rounded-xl border border-slate-100 bg-white/50 px-3 py-2 relative overflow-hidden"
              style={{  }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full blur-xl opacity-30"
                   style={{ background: cat.color }} />
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color, boxShadow: `0 0 6px ${cat.glow}` }} />
                <span className="text-xs font-medium text-slate-600">{cat.name}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{fmtINR(projected * 100)}</p>
              <p className="text-xs text-slate-400">
                {delta > 0 ? '+' : ''}{fmtINR(delta * 100)} ({(cat.inflation * 100).toFixed(1)}%)
              </p>
            </motion.div>
          );
        })}
      </div>

      <details className="mt-3">
        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors select-none">
          Inflation assumptions ▾
        </summary>
        <table className="mt-2 w-full text-xs text-slate-500">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-1 pr-4 font-medium">Category</th>
              <th className="py-1 pr-4 font-medium">Rate</th>
              <th className="py-1 font-medium">Basis</th>
            </tr>
          </thead>
          <tbody>
            {CATEGORIES.map((cat) => (
              <tr key={cat.name} className="border-b border-slate-100/60">
                <td className="py-1 pr-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                </td>
                <td className="py-1 pr-4 font-medium text-amber-500">+{(cat.inflation * 100).toFixed(1)}%</td>
                <td className="py-1 text-slate-400">{cat.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-slate-300 italic">
          Source: India CPI April 2026. Monsoon onset factor applies June–July historically.
          Projections are estimates, not financial advice.
        </p>
      </details>
    </Card>
  );
}
