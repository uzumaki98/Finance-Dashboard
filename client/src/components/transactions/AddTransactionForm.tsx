import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { useCreateTransaction, useImportCsv } from '../../hooks/useTransactions';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AddTransactionForm() {
  const cats = useCategories();
  const create = useCreateTransaction();
  const importCsv = useImportCsv();

  const [occurredOn, setDate] = useState(todayISO());
  const [description, setDesc] = useState('');
  const [amount, setAmount] = useState(''); // rupees, may be negative
  const [categoryId, setCategoryId] = useState<string>('');
  const [kind, setKind] = useState<'expense' | 'income'>('expense');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = Number(amount);
    if (!Number.isFinite(r) || r === 0) return;
    const signed = kind === 'expense' ? -Math.abs(r) : Math.abs(r);
    create.mutate(
      {
        occurredOn,
        description,
        amountPaise: Math.round(signed * 100),
        categoryId: categoryId ? Number(categoryId) : null,
      },
      {
        onSuccess: () => {
          setDesc('');
          setAmount('');
        },
      },
    );
  }

  return (
    <Card title="Add Transaction">
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end">
        <label className="text-xs text-slate-600 sm:col-span-1">
          Date
          <input type="date" value={occurredOn} onChange={(e) => setDate(e.target.value)}
                 className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </label>
        <label className="text-xs text-slate-600 sm:col-span-2">
          Description
          <input value={description} onChange={(e) => setDesc(e.target.value)} required
                 className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </label>
        <label className="text-xs text-slate-600 sm:col-span-1">
          Amount (₹)
          <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required
                 className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" />
        </label>
        <label className="text-xs text-slate-600 sm:col-span-1">
          Type
          <select value={kind} onChange={(e) => setKind(e.target.value as 'expense' | 'income')}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm">
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label className="text-xs text-slate-600 sm:col-span-1">
          Category
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm">
            <option value="">—</option>
            {cats.data?.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </label>
        <div className="sm:col-span-6 flex items-center gap-3">
          <Button type="submit" disabled={create.isPending}>{create.isPending ? 'Saving…' : 'Add'}</Button>
          <label className="text-xs text-slate-500 cursor-pointer">
            <input
              type="file" accept=".csv" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importCsv.mutate(f);
                e.target.value = '';
              }}
            />
            <span className="underline">Import CSV</span>
          </label>
          {importCsv.data && (
            <span className="text-xs text-slate-600">
              Imported {importCsv.data.inserted}{importCsv.data.errors.length ? `, ${importCsv.data.errors.length} skipped` : ''}.
            </span>
          )}
        </div>
      </form>
    </Card>
  );
}
