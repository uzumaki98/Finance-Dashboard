import { useSearchParams } from 'react-router-dom';

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function useSelectedMonth(): [string, (m: string) => void] {
  const [sp, setSp] = useSearchParams();
  const month = sp.get('month') ?? currentMonth();
  const set = (m: string) => {
    const next = new URLSearchParams(sp);
    next.set('month', m);
    setSp(next, { replace: true });
  };
  return [month, set];
}

export function MonthPicker() {
  const [month, setMonth] = useSelectedMonth();
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <span>Month</span>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="rounded-md border border-slate-300 px-2 py-1 text-sm"
      />
    </label>
  );
}
