import '@testing-library/jest-dom';

// Recharts' ResponsiveContainer calls `new ResizeObserver(...)` — jsdom doesn't provide it.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverStub;
