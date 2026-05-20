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
    <label className="flex items-center gap-2 text-sm text-slate-500">
      <span className="text-slate-400 text-xs uppercase tracking-widest">Month</span>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="rounded-lg border border-violet-200 bg-white/60 px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-300/70 transition-all"
      />
    </label>
  );
}
