import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpenseProjectionChart } from '../components/charts/ExpenseProjectionChart';
import * as tanstackQuery from '@tanstack/react-query';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof tanstackQuery>();
  return { ...actual, useQueries: vi.fn() };
});

const mockUseQueries = vi.mocked(tanstackQuery.useQueries);

function loadingResults() {
  return Array.from({ length: 4 }, () => ({ isLoading: true, data: undefined }));
}

function emptyResults() {
  return Array.from({ length: 4 }, () => ({ isLoading: false, data: [] }));
}

function dataResults() {
  const data = [{ categoryId: 1, name: 'Dining', color: '#ef4444', spentPaise: 500000 }];
  return Array.from({ length: 4 }, () => ({ isLoading: false, data }));
}

describe('ExpenseProjectionChart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows spinner while any month is loading', () => {
    mockUseQueries.mockReturnValue(loadingResults() as any);
    render(<ExpenseProjectionChart month="2026-05" />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows empty state when all months have zero spend', () => {
    mockUseQueries.mockReturnValue(emptyResults() as any);
    render(<ExpenseProjectionChart month="2026-05" />);
    expect(screen.getByText(/no spending data yet/i)).toBeInTheDocument();
    expect(screen.getByText(/record transactions across a few months/i)).toBeInTheDocument();
  });

  it('does not show empty state when there is spending data', () => {
    mockUseQueries.mockReturnValue(dataResults() as any);
    render(<ExpenseProjectionChart month="2026-05" />);
    expect(screen.queryByText(/no spending data yet/i)).not.toBeInTheDocument();
  });

  it('shows the card title in all states', () => {
    mockUseQueries.mockReturnValue(emptyResults() as any);
    render(<ExpenseProjectionChart month="2026-05" />);
    expect(screen.getByText('Expense Trend & Projection')).toBeInTheDocument();
  });
});
