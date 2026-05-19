import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Budget } from '../types';

export function useBudgets(month: string) {
  return useQuery({
    queryKey: ['budgets', month],
    queryFn: () => api.get<Budget[]>(`/api/budgets?month=${month}`),
  });
}

export function useUpsertBudget() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { categoryId: number; month: string; amountPaise: number }) =>
      api.put<Budget>('/api/budgets', body),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['budgets', vars.month] });
      qc.invalidateQueries({ queryKey: ['budget-vs-actual', vars.month] });
    },
  });
}
