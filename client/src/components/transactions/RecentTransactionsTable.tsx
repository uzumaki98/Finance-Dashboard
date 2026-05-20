import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTransactions, useDeleteTransaction } from '../../hooks/useTransactions';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { fmtINR } from '../../api/client';

type SortDir = 'asc' | 'desc' | null;

function SortIcon({ dir }: Readonly<{ dir: SortDir }>) {
  return (
    <span className="inline-flex flex-col ml-1 leading-none">
      <span className={`text-[9px] ${dir === 'asc'  ? 'text-violet-500' : 'text-slate-300'}`}>▲</span>
      <span className={`text-[9px] ${dir === 'desc' ? 'text-violet-500' : 'text-slate-300'}`}>▼</span>
    </span>
  );
}

export function RecentTransactionsTable({ month }: Readonly<{ month: string }>) {
  const { data, isLoading } = useTransactions({ month, limit: 500 });
  const del = useDeleteTransaction();
  const [query, setQuery]     = useState('');
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function cycleSort() {
    setSortDir((d) => d === null ? 'desc' : d === 'desc' ? 'asc' : null);
  }

  const filtered = query.trim()
    ? (data ?? []).filter((t) => t.description.toLowerCase().includes(query.toLowerCase()))
    : (data ?? []);

  const sorted = sortDir === null
    ? filtered
    : [...filtered].sort((a, b) =>
        sortDir === 'desc' ? b.amountPaise - a.amountPaise : a.amountPaise - b.amountPaise
      );

  const inputCls = 'rounded-lg border border-violet-200 bg-white/60 px-2 py-1.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-300/70 transition-all';

  return (
    <Card title="Recent Transactions">
      <div className="mb-3 relative">
        <input
          type="text" placeholder="Search transactions…"
          value={query} onChange={(e) => setQuery(e.target.value)}
          className={`w-full pl-8 pr-8 ${inputCls}`}
        />
        <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300"
             width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        {query && (
          <button onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-xs transition-colors"
            aria-label="Clear search">✕</button>
        )}
      </div>

      {isLoading ? <Spinner /> : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
          <span className="text-3xl">{query ? '🔍' : '📭'}</span>
          <p className="text-sm text-slate-400">
            {query ? `No transactions matching "${query}".` : 'No transactions for this month.'}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-200/60">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Description</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium text-right">
                    <button onClick={cycleSort}
                      className="inline-flex items-center hover:text-violet-500 transition-colors"
                      title="Sort by amount">
                      Amount<SortIcon dir={sortDir} />
                    </button>
                  </th>
                  <th className="py-2 pr-2" />
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {sorted.map((t) => {
                    const isExpense = t.amountPaise < 0;
                    const desc = query ? highlightMatch(t.description, query) : t.description;
                    return (
                      <motion.tr key={t.id}
                        className="border-b border-slate-100/80 last:border-0 hover:bg-white/40 transition-colors"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <td className="py-2 pr-4 text-slate-400 whitespace-nowrap tabular-nums">{t.occurredOn}</td>
                        <td className="py-2 pr-4 text-slate-700">{desc}</td>
                        <td className="py-2 pr-4">
                          {t.categoryName ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                              style={{ backgroundColor: `${t.categoryColor}22`, color: t.categoryColor ?? '#64748b' }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.categoryColor ?? '#94a3b8' }} />
                              {t.categoryName}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                        <td className={`py-2 pr-4 text-right font-medium tabular-nums whitespace-nowrap ${isExpense ? 'text-rose-400' : 'text-emerald-500'}`}>
                          {fmtINR(t.amountPaise)}
                        </td>
                        <td className="py-2 pr-2 text-right">
                          <motion.button onClick={() => del.mutate(t.id)}
                            className="text-slate-300 hover:text-rose-400 text-xs transition-colors"
                            aria-label="Delete" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>✕
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {(query || sortDir) && (
            <p className="mt-2 text-xs text-slate-400">
              {sorted.length} of {data?.length ?? 0} transactions
              {sortDir && <span> · sorted by amount {sortDir === 'desc' ? '(high → low)' : '(low → high)'}</span>}
            </p>
          )}
        </>
      )}
    </Card>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-violet-100 text-violet-700 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
