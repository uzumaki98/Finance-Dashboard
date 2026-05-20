import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlertBanner } from '../components/AlertBanner';
import * as useAlertStatusModule from '../hooks/useAlertStatus';

vi.mock('../hooks/useAlertStatus');

const mockUseAlertStatus = vi.mocked(useAlertStatusModule.useAlertStatus);

function makeQuery(overrides: object) {
  return { data: undefined, isLoading: false, isError: false, ...overrides } as ReturnType<typeof useAlertStatusModule.useAlertStatus>;
}

describe('AlertBanner', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders nothing when not over budget', () => {
    mockUseAlertStatus.mockReturnValue(makeQuery({ data: { overBudget: false, alerts: [] } }));
    const { container } = render(<AlertBanner month="2026-05" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing while data is undefined', () => {
    mockUseAlertStatus.mockReturnValue(makeQuery({ data: undefined }));
    const { container } = render(<AlertBanner month="2026-05" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows expanded banner with category details when over budget', () => {
    mockUseAlertStatus.mockReturnValue(makeQuery({
      data: {
        overBudget: true,
        alerts: [
          { categoryId: 1, categoryName: 'Dining', budgetPaise: 500000, actualPaise: 650000, overagePaise: 150000 },
        ],
      },
    }));

    render(<AlertBanner month="2026-05" />);

    // The <p> renders "Over Budget —" and a child <span> with "1 category"
    expect(screen.getByText(/over budget/i)).toBeInTheDocument();
    // Match the inner span exactly
    expect(screen.getByText((_, el) => el?.tagName === 'SPAN' && /^1\s+category$/.test(el.textContent ?? ''))).toBeInTheDocument();
    expect(screen.getByText('Dining')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('Actual')).toBeInTheDocument();
    expect(screen.getByText('Over by')).toBeInTheDocument();
  });

  it('shows correct plural label for multiple over-budget categories', () => {
    mockUseAlertStatus.mockReturnValue(makeQuery({
      data: {
        overBudget: true,
        alerts: [
          { categoryId: 1, categoryName: 'Dining',    budgetPaise: 500000, actualPaise: 600000, overagePaise: 100000 },
          { categoryId: 2, categoryName: 'Groceries', budgetPaise: 300000, actualPaise: 400000, overagePaise: 100000 },
        ],
      },
    }));

    render(<AlertBanner month="2026-05" />);

    expect(screen.getByText((_, el) => el?.tagName === 'SPAN' && /^2\s+categories$/.test(el.textContent ?? ''))).toBeInTheDocument();
    expect(screen.getByText('Dining')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
  });

  it('shows collapse button in expanded state', () => {
    mockUseAlertStatus.mockReturnValue(makeQuery({
      data: {
        overBudget: true,
        alerts: [
          { categoryId: 1, categoryName: 'Dining', budgetPaise: 500000, actualPaise: 650000, overagePaise: 150000 },
        ],
      },
    }));

    render(<AlertBanner month="2026-05" />);
    expect(screen.getByRole('button', { name: /minimize alert/i })).toBeInTheDocument();
  });

  it('switches to expand button when minimized', async () => {
    const user = userEvent.setup();
    mockUseAlertStatus.mockReturnValue(makeQuery({
      data: {
        overBudget: true,
        alerts: [
          { categoryId: 1, categoryName: 'Dining', budgetPaise: 500000, actualPaise: 650000, overagePaise: 150000 },
        ],
      },
    }));

    render(<AlertBanner month="2026-05" />);

    await user.click(screen.getByRole('button', { name: /minimize alert/i }));

    expect(screen.getByRole('button', { name: /expand alert/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /minimize alert/i })).not.toBeInTheDocument();
  });

  it('switches back to minimize button when expanded again', async () => {
    const user = userEvent.setup();
    mockUseAlertStatus.mockReturnValue(makeQuery({
      data: {
        overBudget: true,
        alerts: [
          { categoryId: 1, categoryName: 'Dining', budgetPaise: 500000, actualPaise: 650000, overagePaise: 150000 },
        ],
      },
    }));

    render(<AlertBanner month="2026-05" />);

    await user.click(screen.getByRole('button', { name: /minimize alert/i }));
    await user.click(screen.getByRole('button', { name: /expand alert/i }));

    expect(screen.getByRole('button', { name: /minimize alert/i })).toBeInTheDocument();
  });
});
