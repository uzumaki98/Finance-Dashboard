import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useSelectedMonth } from '../components/layout/MonthPicker';
import { SpendingByCategoryChart } from '../components/charts/SpendingByCategoryChart';
import { BudgetVsActual } from '../components/budgets/BudgetVsActual';
import { RecentTransactionsTable } from '../components/transactions/RecentTransactionsTable';
import { AddTransactionForm } from '../components/transactions/AddTransactionForm';
import { MonthlySummary } from '../components/MonthlySummary';
import { ExpenseProjectionChart } from '../components/charts/ExpenseProjectionChart';
import { IncomeSavingsChart } from '../components/charts/IncomeSavingsChart';
import { AlertBanner } from '../components/AlertBanner';

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

const itemTransition = { duration: 0.4, ease: 'easeOut' as const };

export default function Dashboard() {
  const [month] = useSelectedMonth();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={month}
        variants={stagger}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        {([
          { span: true,  el: <AlertBanner month={month} /> },
          { span: true,  el: <MonthlySummary month={month} /> },
          { span: false, el: <SpendingByCategoryChart month={month} /> },
          { span: false, el: <BudgetVsActual month={month} /> },
          { span: false, el: <ExpenseProjectionChart month={month} /> },
          { span: false, el: <IncomeSavingsChart month={month} /> },
          { span: true,  el: <AddTransactionForm /> },
          { span: true,  el: <RecentTransactionsTable month={month} /> },
        ] as const).map(({ span, el }, i) => (
          <motion.div
            key={i}
            variants={item}
            transition={itemTransition}
            className={span ? 'lg:col-span-2' : undefined}
          >
            {el}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
