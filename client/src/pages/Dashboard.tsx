import { useSelectedMonth } from '../components/layout/MonthPicker';
import { SpendingByCategoryChart } from '../components/charts/SpendingByCategoryChart';
import { BudgetVsActual } from '../components/budgets/BudgetVsActual';
import { RecentTransactionsTable } from '../components/transactions/RecentTransactionsTable';
import { AddTransactionForm } from '../components/transactions/AddTransactionForm';
import { MonthlySummary } from '../components/MonthlySummary';
import { ExpenseProjectionChart } from '../components/charts/ExpenseProjectionChart';

export default function Dashboard() {
  const [month] = useSelectedMonth();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="lg:col-span-2">
        <MonthlySummary month={month} />
      </div>
      <SpendingByCategoryChart month={month} />
      <BudgetVsActual month={month} />
      <div className="lg:col-span-2">
        <AddTransactionForm />
      </div>
      <div className="lg:col-span-2">
        <RecentTransactionsTable month={month} />
      </div>
      <div className="lg:col-span-2">
        <ExpenseProjectionChart month={month} />
      </div>
    </div>
  );
}
