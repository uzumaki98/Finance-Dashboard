import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpendingByCategoryChart } from '../components/charts/SpendingByCategoryChart';
import * as useMonthlySpendingModule from '../hooks/useMonthlySpending';

vi.mock('../hooks/useMonthlySpending');
// echarts-for-react uses canvas/WebGL which jsdom doesn't support
vi.mock('echarts-for-react', () => ({
  default: ({ option }: { option: any }) => (
    <div data-testid="echarts-mock">
      {option?.series?.[0]?.data?.map((d: any) => (
        <span key={d.name}>{d.name}</span>
      ))}
    </div>
  ),
}));
vi.mock('echarts-gl', () => ({}));

const mockUseMonthlySpending = vi.mocked(useMonthlySpendingModule.useMonthlySpending);

function makeQuery(overrides: object) {
  return { data: undefined, isLoading: false, isError: false, ...overrides } as ReturnType<typeof useMonthlySpendingModule.useMonthlySpending>;
}

describe('SpendingByCategoryChart', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner while fetching', () => {
    mockUseMonthlySpending.mockReturnValue(makeQuery({ isLoading: true }));
    render(<SpendingByCategoryChart month="2026-05" />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows empty state when data is an empty array', () => {
    mockUseMonthlySpending.mockReturnValue(makeQuery({ data: [] }));
    render(<SpendingByCategoryChart month="2026-05" />);
    expect(screen.getByText(/no expenses yet this month/i)).toBeInTheDocument();
    expect(screen.getByText(/add a transaction/i)).toBeInTheDocument();
  });

  it('shows empty state when data is undefined', () => {
    mockUseMonthlySpending.mockReturnValue(makeQuery({ data: undefined }));
    render(<SpendingByCategoryChart month="2026-05" />);
    expect(screen.getByText(/no expenses yet this month/i)).toBeInTheDocument();
  });

  it('renders the chart when data is present', () => {
    mockUseMonthlySpending.mockReturnValue(makeQuery({
      data: [{ categoryId: 1, name: 'Dining', color: '#ef4444', spentPaise: 50000 }],
    }));
    render(<SpendingByCategoryChart month="2026-05" />);
    expect(screen.queryByText(/no expenses yet this month/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
  });
});
