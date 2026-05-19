import { useState } from 'react';
import { useTransactions, useDeleteTransaction } from '../../hooks/useTransactions';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
import { fmtINR } from '../../api/client';

export function RecentTransactionsTable({ month }: { month: string }) {
  const { data, isLoading } = useTransactions({ month, limit: 500 });
  const del = useDeleteTransaction();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? (data ?? []).filter((t) =>
        t.description.toLowerCase().includes(query.toLowerCase())
      )
    : (data ?? []);

  return (
    <Card title="Recent Transactions">
      <div className="mb-3 relative">
        <input
          type="text"
          placeholder="Search transactions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <svg className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
             width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {isLoading ? <Spinner /> : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">
          {query ? `No transactions matching "${query}".` : 'No transactions for this month.'}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4 font-medium">Date</th>
                  <th className="py-2 pr-4 font-medium">Description</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium text-right">Amount</th>
                  <th className="py-2 pr-2"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const isExpense = t.amountPaise < 0;
                  const desc = query
                    ? highlightMatch(t.description, query)
                    : t.description;
                  return (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-2 pr-4 text-slate-700 whitespace-nowrap">{t.occurredOn}</td>
                      <td className="py-2 pr-4 text-slate-900">{desc}</td>
                      <td className="py-2 pr-4">
                        {t.categoryName ? (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                            style={{ backgroundColor: `${t.categoryColor}22`, color: t.categoryColor ?? '#475569' }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.categoryColor ?? '#94a3b8' }} />
                            {t.categoryName}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className={`py-2 pr-4 text-right font-medium whitespace-nowrap ${isExpense ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {fmtINR(t.amountPaise)}
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <button
                          onClick={() => del.mutate(t.id)}
                          className="text-slate-400 hover:text-rose-600 text-xs"
                          aria-label="Delete"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {query && (
            <p className="mt-2 text-xs text-slate-400">
              {filtered.length} of {data?.length ?? 0} transactions
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
      <mark className="bg-yellow-200 text-slate-900 rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}
