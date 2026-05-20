import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAlertStatus } from '../hooks/useAlertStatus';
import { fmtINR } from '../api/client';

export function AlertBanner({ month }: Readonly<{ month: string }>) {
  const { data } = useAlertStatus(month);
  const [minimized, setMinimized] = useState(false);

  if (!data?.overBudget) return null;

  const count = data.alerts.length;

  return (
    <motion.div
      className="rounded-2xl border border-amber-200 overflow-hidden"
      style={{ background: 'rgba(254,243,199,0.70)', backdropFilter: 'blur(16px)' }}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-2 px-5 py-3">
        <span className="text-amber-500 text-lg leading-none">⚠</span>
        <p className="text-sm font-semibold text-amber-800 flex-1 uppercase tracking-wide">
          Over Budget —{' '}
          <span className="normal-case font-normal text-amber-600">
            {count} {count === 1 ? 'category' : 'categories'}
          </span>
        </p>
        <motion.button
          onClick={() => setMinimized((m) => !m)}
          aria-label={minimized ? 'Expand alert' : 'Minimize alert'}
          className="text-amber-500 hover:text-amber-700 text-xs font-medium transition-colors flex items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {minimized ? 'Show details' : 'Collapse'}
          <motion.span
            animate={{ rotate: minimized ? 0 : 180 }}
            transition={{ duration: 0.25 }}
            className="inline-block"
          >▾</motion.span>
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {!minimized && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-5 pb-4">
              {data.alerts.map((item, i) => (
                <motion.div
                  key={item.categoryId}
                  className="rounded-xl border border-amber-200 bg-white/60 px-4 py-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.28 }}
                >
                  <p className="text-xs font-semibold text-slate-700 truncate mb-2">{item.categoryName}</p>
                  <div className="space-y-0.5 text-xs tabular-nums">
                    <div className="flex justify-between text-slate-500">
                      <span>Budget</span><span>{fmtINR(item.budgetPaise)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Actual</span><span>{fmtINR(item.actualPaise)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-rose-500 pt-1 border-t border-amber-100">
                      <span>Over by</span><span>{fmtINR(item.overagePaise)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
