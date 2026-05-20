import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BudgetVsActual } from '../components/budgets/BudgetVsActual';
import * as useMonthlySpendingModule from '../hooks/useMonthlySpending';
import * as useBudgetsModule from '../hooks/useBudgets';
import * as useCategoriesModule from '../hooks/useCategories';

vi.mock('../hooks/useMonthlySpending');
vi.mock('../hooks/useBudgets');
vi.mock('../hooks/useCategories');
vi.mock('echarts-for-react', () => ({
  default: ({ option }: { option: any }) => (
    <div data-testid="echarts-mock">
      {option?.series?.map((s: any) => (
        <span key={s.name}>{s.name}</span>
      ))}
    </div>
  ),
}));
vi.mock('echarts-gl', () => ({}));

const mockUseBudgetVsActual = vi.mocked(useMonthlySpendingModule.useBudgetVsActual);
const mockUseUpsertBudget   = vi.mocked(useBudgetsModule.useUpsertBudget);
const mockUseCategories     = vi.mocked(useCategoriesModule.useCategories);

function makeQuery(overrides: object) {
  return { data: undefined, isLoading: false, isError: false, ...overrides } as ReturnType<typeof useMonthlySpendingModule.useBudgetVsActual>;
}

const stubUpsert = { mutate: vi.fn(), isPending: false } as unknown as ReturnType<typeof useBudgetsModule.useUpsertBudget>;
const stubCats   = { data: [{ id: 1, name: 'Dining', color: '#ef4444' }] } as ReturnType<typeof useCategoriesModule.useCategories>;

describe('BudgetVsActual', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUpsertBudget.mockReturnValue(stubUpsert);
    mockUseCategories.mockReturnValue(stubCats);
  });

  it('shows loading spinner while fetching', () => {
    mockUseBudgetVsActual.mockReturnValue(makeQuery({ isLoading: true }));
    render(<BudgetVsActual month="2026-05" />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows empty state when data is an empty array', () => {
    mockUseBudgetVsActual.mockReturnValue(makeQuery({ data: [] }));
    render(<BudgetVsActual month="2026-05" />);
    expect(screen.getByText(/no budgets set for this month/i)).toBeInTheDocument();
    expect(screen.getByText(/pick a category/i)).toBeInTheDocument();
  });

  it('shows empty state when data is undefined', () => {
    mockUseBudgetVsActual.mockReturnValue(makeQuery({ data: undefined }));
    render(<BudgetVsActual month="2026-05" />);
    expect(screen.getByText(/no budgets set for this month/i)).toBeInTheDocument();
  });

  it('renders the chart when data is present', () => {
    mockUseBudgetVsActual.mockReturnValue(makeQuery({
      data: [{
        categoryId: 1, name: 'Groceries', color: '#10b981',
        budgetPaise: 500000, spentPaise: 300000,
      }],
    }));
    render(<BudgetVsActual month="2026-05" />);
    expect(screen.queryByText(/no budgets set/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('echarts-mock')).toBeInTheDocument();
  });

  it('always renders the budget set form', () => {
    mockUseBudgetVsActual.mockReturnValue(makeQuery({ data: [] }));
    render(<BudgetVsActual month="2026-05" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/budget ₹/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /set/i })).toBeInTheDocument();
  });
});
