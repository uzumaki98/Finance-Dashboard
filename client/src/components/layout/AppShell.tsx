import type { ReactNode } from 'react';
import { MonthPicker } from './MonthPicker';

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="glass-header sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-violet-500 text-xl">◈</span>
            <h1 className="text-base font-semibold text-slate-700 tracking-wide">Finance Dashboard</h1>
          </div>
          <MonthPicker />
        </div>
      </header>
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
      <footer className="max-w-6xl mx-auto w-full px-4 py-4 border-t border-slate-200/60 text-xs text-slate-400 flex justify-end">
        <a
          href="/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-violet-500 transition-colors underline underline-offset-2"
        >
          Help / README
        </a>
      </footer>
    </div>
  );
}
