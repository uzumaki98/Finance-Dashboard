import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { api, fmtINR } from '../../api/client';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import type { IncomeSavingsMonth } from '../../types';

function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-violet-100 shadow-lg px-3 py-2 text-xs min-w-[180px]"
         style={{ background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)' }}>
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color ?? p.stroke }}>{p.name}</span>
          <span className={`font-medium ${p.dataKey === 'savings' && p.value < 0 ? 'text-rose-500' : 'text-slate-600'}`}>
            {fmtINR(Math.round(p.value * 100))}
          </span>
        </div>
      ))}
    </div>
  );
};

export function IncomeSavingsChart({ month }: Readonly<{ month: string }>) {
  const { data, isLoading } = useQuery({
    queryKey: ['income-savings', month],
    queryFn: () => api.get<IncomeSavingsMonth[]>(`/api/reports/income-savings?month=${month}`),
  });

  if (isLoading) return <Card title="Income & Savings Trend"><Spinner /></Card>;

  const hasData = data?.some((d) => d.incomePaise > 0 || d.expensePaise > 0);

  if (!hasData) {
    return (
      <Card title="Income & Savings Trend">
        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
          <span className="text-3xl">💰</span>
          <p className="text-sm font-medium text-slate-600">No income data yet</p>
          <p className="text-xs text-slate-400">
            Record income transactions to see your savings trend across months.
          </p>
        </div>
      </Card>
    );
  }

  const chartData = (data ?? []).map((d) => ({
    month: monthLabel(d.month),
    income:   +(d.incomePaise   / 100).toFixed(2),
    expenses: +(d.expensePaise  / 100).toFixed(2),
    savings:  +(d.savingsPaise  / 100).toFixed(2),
  }));

  const savingsRate = chartData.at(-1)
    ? chartData.at(-1)!.income > 0
      ? ((chartData.at(-1)!.savings / chartData.at(-1)!.income) * 100).toFixed(1)
      : null
    : null;

  return (
    <Card
      title="Income & Savings Trend"
      action={
        savingsRate !== null
          ? <span className="text-xs text-slate-400">
              Latest savings rate: <span className={`font-semibold ${Number(savingsRate) >= 0 ? 'text-emerald-500' : 'text-rose-400'}`}>{savingsRate}%</span>
            </span>
          : undefined
      }
    >
      {/* SVG defs */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6ee7b7" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#818cf8" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#818cf8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
      </svg>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
            <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1} />

            <Area
              type="monotone" dataKey="income" name="Income"
              stroke="#10b981" strokeWidth={2.5}
              fill="url(#incomeGrad)"
              dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
              activeDot={{ r: 6, style: { filter: 'drop-shadow(0 0 6px #10b981)' } }}
            />
            <Area
              type="monotone" dataKey="savings" name="Savings"
              stroke="#818cf8" strokeWidth={2.5}
              fill="url(#savingsGrad)"
              dot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
              activeDot={{ r: 6, style: { filter: 'drop-shadow(0 0 6px #818cf8)' } }}
            />
            <Line
              type="monotone" dataKey="expenses" name="Expenses"
              stroke="#f87171" strokeWidth={2} strokeDasharray="5 3"
              dot={{ r: 3, fill: '#f87171', strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stat row */}
      {chartData.length > 0 && (() => {
        const last = chartData.at(-1)!;
        const stats = [
          { label: 'Income',   value: last.income,   color: '#10b981' },
          { label: 'Expenses', value: last.expenses, color: '#f87171' },
          { label: 'Savings',  value: last.savings,  color: last.savings >= 0 ? '#818cf8' : '#f87171' },
        ];
        return (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-slate-100 bg-white/50 px-3 py-2 text-center">
                <p className="text-[10px] text-slate-400 mb-0.5">{s.label} (latest)</p>
                <p className="text-sm font-bold" style={{ color: s.color }}>{fmtINR(s.value * 100)}</p>
              </div>
            ))}
          </div>
        );
      })()}
    </Card>
  );
}
