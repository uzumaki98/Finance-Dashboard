import ReactECharts from 'echarts-for-react';
import { useMonthlySpending } from '../../hooks/useMonthlySpending';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { fmtINR } from '../../api/client';

export function SpendingByCategoryChart({ month }: Readonly<{ month: string }>) {
  const { data, isLoading } = useMonthlySpending(month);

  if (isLoading) return <Card title="Spending by Category"><Spinner /></Card>;

  if (!data || data.length === 0) {
    return (
      <Card title="Spending by Category">
        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
          <span className="text-3xl">🧾</span>
          <p className="text-sm font-medium text-white/60">No expenses yet this month</p>
          <p className="text-xs text-white/35">Add a transaction below to see your spending breakdown here.</p>
        </div>
      </Card>
    );
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.94)',
      borderColor: 'rgba(200,185,255,0.40)',
      borderWidth: 1,
      textStyle: { color: '#334155', fontSize: 12 },
      formatter: (p: any) =>
        `<div style="font-weight:600;margin-bottom:4px">${p.name}</div>` +
        `${fmtINR(Math.round(p.value * 100))}&nbsp;&nbsp;<span style="opacity:0.55">${p.percent?.toFixed(1)}%</span>`,
    },
    legend: {
      orient: 'vertical',
      right: '4%',
      top: 'middle',
      textStyle: { color: '#64748b', fontSize: 11, lineHeight: 20 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 10,
      formatter: (name: string) => {
        const d = data.find((x) => x.name === name);
        return d ? `${name}  {sub|${fmtINR(d.spentPaise)}}` : name;
      },
      rich: {
        sub: { color: 'rgba(255,255,255,0.3)', fontSize: 10 },
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '70%'],   // donut — inner ring gives depth feel
        center: ['38%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: 'rgba(255,255,255,0.04)',
          borderWidth: 2,
          shadowBlur: 18,
          shadowOffsetY: 6,
          shadowColor: 'rgba(0,0,0,0.35)',
        },
        label: {
          show: true,
          position: 'outside',
          color: '#94a3b8',
          fontSize: 11,
          formatter: '{d}%',
        },
        labelLine: {
          length: 10,
          length2: 8,
          lineStyle: { color: '#cbd5e1', width: 1 },
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowBlur: 28,
            shadowColor: 'rgba(0,0,0,0.5)',
            borderWidth: 0,
          },
          label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#fff' },
        },
        data: data.map((d) => ({
          name: d.name,
          value: +(d.spentPaise / 100).toFixed(2),
          itemStyle: { color: d.color },
        })),
        animationType: 'scale',
        animationEasing: 'cubicOut',
        animationDuration: 900,
      },
    ],
  };

  return (
    <Card title="Spending by Category">
      <ReactECharts option={option} style={{ height: 300 }} opts={{ renderer: 'canvas' }} />
    </Card>
  );
}
