import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMonthlySpending } from '../../hooks/useMonthlySpending';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { fmtINR } from '../../api/client';

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) => {
  if (percent < 0.04) return null; // skip labels on tiny slices
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
          fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function SpendingByCategoryChart({ month }: { month: string }) {
  const { data, isLoading } = useMonthlySpending(month);

  return (
    <Card title="Spending by Category">
      {isLoading ? <Spinner /> : !data || data.length === 0 ? (
        <p className="text-sm text-slate-500">No expenses recorded for this month.</p>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data.map((d) => ({ ...d, value: d.spentPaise / 100 }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="70%"
                paddingAngle={2}
                labelLine={false}
                label={renderCustomLabel}
              >
                {data.map((d) => (
                  <Cell key={d.categoryId} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => fmtINR(Math.round(v * 100))} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value, entry: any) => (
                  <span className="text-xs text-slate-700">
                    {value} — {fmtINR(entry.payload.spentPaise)}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
