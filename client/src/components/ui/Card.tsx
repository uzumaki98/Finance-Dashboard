import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function Card({ title, action, children }: Readonly<{ title?: string; action?: ReactNode; children: ReactNode }>) {
  return (
    <motion.section
      className="glass-card p-5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      {(title || action) && (
        <header className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-500">
              {title}
            </h2>
          )}
          {action}
        </header>
      )}
      {children}
    </motion.section>
  );
}
