import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { afterEach, describe, expect, test, vi } from 'vitest';

// Control reduced-motion per test; keep the rest of motion real.
const motionState = vi.hoisted(() => ({ reduce: true }));
vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => motionState.reduce };
});

// Metrics unit does network on mount; stub it.
vi.mock('../../hooks/useMetrics.js', () => ({ useMetrics: () => ({ nodes: [], error: null }) }));

const { RackView } = await import('./Rack.jsx');
const { default: RackUnit } = await import('./RackUnit.jsx');

function LocationProbe() {
  return <div data-testid="path">{useLocation().pathname}</div>;
}

function renderHome(ui) {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={ui} />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );
}

const unit = { id: 'about', title: 'About', to: '/about', tag: 'U1', caption: 'whoami', monitors: [] };

afterEach(() => {
  motionState.reduce = true;
  vi.useRealTimers();
});

describe('RackView', () => {
  test('without status every LED is unknown and units still work', async () => {
    renderHome(<RackView summary={null} statusError="Request timed out" />);
    const leds = screen.getAllByRole('img', { name: /: unknown$/ });
    expect(leds.length).toBeGreaterThan(0);
    expect(screen.getByRole('status')).toHaveTextContent('status: offline');

    await userEvent.click(screen.getByRole('link', { name: /Open About/ }));
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });

  test('a down monitor shows red and is announced', () => {
    renderHome(<RackView summary={{ monitors: [{ id: 10, status: 'down' }, { id: 8, status: 'up' }] }} />);
    expect(screen.getByRole('img', { name: 'ERP: down' })).toHaveAttribute('data-status', 'down');
    expect(screen.getByRole('img', { name: 'CDN: up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Services (1 service down)' })).toBeInTheDocument();
  });

  test('shows the version on the serial label', () => {
    renderHome(<RackView summary={null} />);
    expect(screen.getByText(new RegExp(`v${__APP_VERSION__.replace(/\./g, '\\.')}`))).toBeInTheDocument();
  });
});

describe('RackUnit', () => {
  test('Enter key navigates', async () => {
    renderHome(<RackUnit unit={unit} leds={[]} />);
    screen.getByRole('link', { name: 'Open About' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });

  test('Space key navigates', async () => {
    renderHome(<RackUnit unit={unit} leds={[]} />);
    screen.getByRole('link', { name: 'Open About' }).focus();
    await userEvent.keyboard(' ');
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });

  test('with animation: navigates once after the drawer opens, even on double click', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderHome(<RackUnit unit={unit} leds={[]} />);
    const link = screen.getByRole('link', { name: 'Open About' });

    fireEvent.click(link);
    fireEvent.click(link);
    // Still on the rack while the drawer animates.
    expect(screen.queryByTestId('path')).not.toBeInTheDocument();
    expect(link).toHaveAttribute('data-opening', 'true');

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });
});
