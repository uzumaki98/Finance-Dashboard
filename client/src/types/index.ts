export type Category = { id: number; name: string; color: string };

export type Transaction = {
  id: number;
  occurredOn: string;
  description: string;
  amountPaise: number;
  categoryId: number | null;
  categoryName: string | null;
  categoryColor: string | null;
  notes: string | null;
};

export type MonthlySpend = {
  categoryId: number;
  name: string;
  color: string;
  spentPaise: number;
};

export type BudgetVsActual = {
  categoryId: number;
  name: string;
  color: string;
  budgetPaise: number;
  spentPaise: number;
};

export type AlertStatusItem = {
  categoryId: number;
  categoryName: string;
  budgetPaise: number;
  actualPaise: number;
  overagePaise: number;
};

export type AlertStatus = {
  overBudget: boolean;
  alerts: AlertStatusItem[];
};

export type IncomeSavingsMonth = {
  month: string;
  incomePaise: number;
  expensePaise: number;
  savingsPaise: number;
};

export type Budget = {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  month: string;
  amountPaise: number;
};
