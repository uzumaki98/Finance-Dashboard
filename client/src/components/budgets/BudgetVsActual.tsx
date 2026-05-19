import { useState } from 'react';
import { useBudgetVsActual } from '../../hooks/useMonthlySpending';
import { useUpsertBudget } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { fmtINR } from '../../api/client';

export function BudgetVsActual({ month }: { month: string }) {
  const { data, isLoading } = useBudgetVsActual(month);
  const cats = useCategories();
  const upsert = useUpsertBudget();

  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !amount) return;
    upsert.mutate({
      categoryId: Number(categoryId),
      month,
      amountPaise: Math.round(Number(amount) * 100),
    }, { onSuccess: () => setAmount('') });
  }

  return (
    <Card
      title="Budget vs Actual"
      action={
        <form onSubmit={save} className="flex items-center gap-2">
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs">
            <option value="">Category…</option>
            {cats.data?.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <input
            type="number" step="0.01" placeholder="Budget ₹"
            value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-28 rounded-md border border-slate-300 px-2 py-1 text-xs"
          />
          <Button type="submit" className="!py-1 !text-xs">Set</Button>
        </form>
      }
    >
      {isLoading ? <Spinner /> : !data || data.length === 0 ? (
        <p className="text-sm text-slate-500">No budgets or spending yet for this month.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((b) => {
            const pct = b.budgetPaise > 0 ? Math.min(100, Math.round((b.spentPaise / b.budgetPaise) * 100)) : 0;
            const over = b.budgetPaise > 0 && b.spentPaise > b.budgetPaise;
            return (
              <li key={b.categoryId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <span className="font-medium text-slate-800">{b.name}</span>
                  </span>
                  <span className={over ? 'text-rose-600' : 'text-slate-600'}>
                    {fmtINR(b.spentPaise)} {b.budgetPaise > 0 ? <span className="text-slate-400">/ {fmtINR(b.budgetPaise)}</span> : <span className="text-slate-400">(no budget)</span>}
                  </span>
                </div>
                {b.budgetPaise > 0 && (
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${over ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
