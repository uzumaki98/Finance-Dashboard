import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type { AlertStatus } from '../types';

export function useAlertStatus(month: string) {
  return useQuery({
    queryKey: ['alert-status', month],
    queryFn: () => api.get<AlertStatus>(`/api/alerts/status?month=${month}`),
  });
}
