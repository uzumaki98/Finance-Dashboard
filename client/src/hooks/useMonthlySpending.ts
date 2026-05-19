import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { MonthlySpend, BudgetVsActual } from '../types';

export function useMonthlySpending(month: string) {
  return useQuery({
    queryKey: ['monthly-spend', month],
    queryFn: () => api.get<MonthlySpend[]>(`/api/reports/monthly-spend?month=${month}`),
  });
}

export function useBudgetVsActual(month: string) {
  return useQuery({
    queryKey: ['budget-vs-actual', month],
    queryFn: () => api.get<BudgetVsActual[]>(`/api/reports/budget-vs-actual?month=${month}`),
  });
}
