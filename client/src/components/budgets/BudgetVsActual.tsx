import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useBudgetVsActual } from '../../hooks/useMonthlySpending';
import { useUpsertBudget } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { fmtINR } from '../../api/client';

export function BudgetVsActual({ month }: Readonly<{ month: string }>) {
  const { data, isLoading } = useBudgetVsActual(month);
  const cats = useCategories();
  const upsert = useUpsertBudget();

  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !amount) return;
    upsert.mutate(
      { categoryId: Number(categoryId), month, amountPaise: Math.round(Number(amount) * 100) },
      { onSuccess: () => setAmount('') },
    );
  }

  const inputCls = 'rounded-lg border border-violet-200 bg-white/60 px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-violet-300/70';

  const formAction = (
    <form onSubmit={save} className="flex items-center gap-2">
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
        <option value="">Category…</option>
        {cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input
        type="number" step="0.01" placeholder="Budget ₹"
        value={amount} onChange={(e) => setAmount(e.target.value)}
        className={`w-28 ${inputCls}`}
      />
      <Button type="submit" className="!py-1 !text-xs">Set</Button>
    </form>
  );

  if (isLoading) return <Card title="Budget vs Actual" action={formAction}><Spinner /></Card>;

  if (!data || data.length === 0) {
    return (
      <Card title="Budget vs Actual" action={formAction}>
        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
          <span className="text-3xl">🎯</span>
          <p className="text-sm font-medium text-slate-600">No budgets set for this month</p>
          <p className="text-xs text-slate-400">Pick a category and enter an amount above to set your first budget.</p>
        </div>
      </Card>
    );
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.92)',
      borderColor: 'rgba(200,185,255,0.4)',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 12 },
      formatter: (params: any[]) =>
        `<b style="color:#475569">${params[0].axisValue}</b><br/>` +
        params.map((p: any) => `${p.marker}${p.seriesName}: ${fmtINR(Math.round(p.value * 100))}`).join('<br/>'),
    },
    legend: {
      data: ['Budget', 'Actual'],
      textStyle: { color: '#64748b', fontSize: 11 },
      top: 0,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: 36, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((b) => b.name),
      axisLabel: { color: '#94a3b8', fontSize: 11, rotate: data.length > 4 ? 30 : 0 },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 10, formatter: (v: number) => `₹${(v / 1000).toFixed(0)}k` },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
    },
    series: [
      {
        name: 'Budget',
        type: 'bar',
        data: data.map((b) => +(b.budgetPaise / 100).toFixed(2)),
        barMaxWidth: 32,
        itemStyle: { color: '#c4b5fd', borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: '#a78bfa' } },
      },
      {
        name: 'Actual',
        type: 'bar',
        data: data.map((b) => ({
          value: +(b.spentPaise / 100).toFixed(2),
          itemStyle: {
            color: b.spentPaise > b.budgetPaise ? '#fca5a5' : '#6ee7b7',
            borderRadius: [4, 4, 0, 0],
          },
        })),
        barMaxWidth: 32,
        emphasis: { itemStyle: { opacity: 0.85 } },
      },
    ],
  };

  return (
    <Card title="Budget vs Actual" action={formAction}>
      <ReactECharts option={option} style={{ height: 280 }} opts={{ renderer: 'canvas' }} />
    </Card>
  );
}
