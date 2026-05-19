import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import type { Transaction } from '../types';

export function useTransactions(opts: { month?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (opts.month) params.set('month', opts.month);
  if (opts.limit) params.set('limit', String(opts.limit));
  const qs = params.toString();
  return useQuery({
    queryKey: ['transactions', opts.month ?? null, opts.limit ?? null],
    queryFn: () => api.get<Transaction[]>(`/api/transactions${qs ? `?${qs}` : ''}`),
  });
}

type CreateBody = {
  occurredOn: string;
  description: string;
  amountPaise: number;
  categoryId: number | null;
  notes?: string | null;
};

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBody) => api.post<Transaction>('/api/transactions', body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['monthly-spend'] });
      qc.invalidateQueries({ queryKey: ['budget-vs-actual'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.del(`/api/transactions/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['monthly-spend'] });
      qc.invalidateQueries({ queryKey: ['budget-vs-actual'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useImportCsv() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => api.upload<{ inserted: number; errors: { row: number; message: string }[] }>(
      '/api/transactions/import', file,
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['monthly-spend'] });
      qc.invalidateQueries({ queryKey: ['budget-vs-actual'] });
      qc.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}
