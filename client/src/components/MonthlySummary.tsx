import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
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

function StatCard({ label, value, sub, glowColor, index }: Readonly<{
  label: string; value: string; sub?: string; glowColor: string; index: number;
}>) {
  return (
    <motion.div
      className="glass-card px-5 py-4 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-30 blur-2xl pointer-events-none"
        style={{ background: glowColor }}
      />
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold tabular-nums text-slate-800">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </motion.div>
  );
}

export function MonthlySummary({ month }: Readonly<{ month: string }>) {
  const { data, isLoading } = useMonthlySummary(month);
  const ph = '—';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard index={0} label="Total Income"   glowColor="#6ee7b7"
        value={isLoading ? ph : fmtINR(data?.income ?? 0)} />
      <StatCard index={1} label="Total Expenses" glowColor="#fca5a5"
        value={isLoading ? ph : fmtINR(data?.expenses ?? 0)} />
      <StatCard index={2} label="Net Savings"    glowColor="#c4b5fd"
        value={isLoading ? ph : fmtINR(data?.net ?? 0)}
        sub={data?.savingsRate !== null && data?.savingsRate !== undefined
          ? `${data.savingsRate}% of income saved` : undefined} />
      <StatCard index={3} label="Transactions"   glowColor="#fed7aa"
        value={isLoading ? ph : String(data?.count ?? 0)}
        sub={data?.savingsRate !== null && data?.savingsRate !== undefined
          ? `${data.savingsRate}% savings rate` : 'no income recorded'} />
    </div>
  );
}
