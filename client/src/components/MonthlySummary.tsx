import { useQuery } from '@tanstack/react-query';
import { api, fmtINR } from '../api/client';
import type { Transaction } from '../types';

function useMonthlySummary(month: string) {
  return useQuery({
    queryKey: ['summary', month],
    queryFn: () => api.get<Transaction[]>(`/api/transactions?month=${month}&limit=500`),
    select: (txns) => {
      let income = 0, expenses = 0;
      for (const t of txns) {
        if (t.amountPaise > 0) income += t.amountPaise;
        else expenses += -t.amountPaise;
      }
      const net = income - expenses;
      const savingsRate = income > 0 ? Math.round((net / income) * 100) : null;
      return { income, expenses, net, savingsRate, count: txns.length };
    },
  });
}

function StatCard({
  label, value, sub, color, accent,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  accent: string;
}) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm px-5 py-4 border-l-4 ${accent}`}>
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export function MonthlySummary({ month }: { month: string }) {
  const { data, isLoading } = useMonthlySummary(month);
  const ph = '—';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard
        label="Total Income"
        value={isLoading ? ph : fmtINR(data?.income ?? 0)}
        color="text-emerald-600"
        accent="border-l-emerald-400"
      />
      <StatCard
        label="Total Expenses"
        value={isLoading ? ph : fmtINR(data?.expenses ?? 0)}
        color="text-rose-600"
        accent="border-l-rose-400"
      />
      <StatCard
        label="Net Savings"
        value={isLoading ? ph : fmtINR(data?.net ?? 0)}
        color={!data || data.net >= 0 ? 'text-indigo-600' : 'text-rose-600'}
        accent={!data || data.net >= 0 ? 'border-l-indigo-400' : 'border-l-rose-400'}
        sub={data?.savingsRate !== null && data?.savingsRate !== undefined
          ? `${data.savingsRate}% of income saved`
          : undefined}
      />
      <StatCard
        label="Transactions"
        value={isLoading ? ph : String(data?.count ?? 0)}
        color="text-slate-700"
        accent="border-l-slate-300"
        sub={data?.savingsRate !== null && data?.savingsRate !== undefined
          ? `${data.savingsRate}% savings rate`
          : 'no income recorded'}
      />
    </div>
  );
}
