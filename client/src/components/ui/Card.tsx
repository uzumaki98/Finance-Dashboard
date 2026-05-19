import type { ReactNode } from 'react';

export function Card({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      {(title || action) && (
        <header className="flex items-center justify-between mb-3">
          {title && <h2 className="text-base font-semibold text-slate-800">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
