import type { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };

export function Button({ className = '', ...rest }: Readonly<Props>) {
  return (
    <motion.button
      {...(rest as any)}
      whileHover={{ scale: 1.045, boxShadow: '0 0 18px rgba(167,139,250,0.45)' }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`inline-flex items-center justify-center rounded-lg bg-violet-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    />
  );
}
