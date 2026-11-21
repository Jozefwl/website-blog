import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router';
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
    expect(screen.getByRole('img', { name: 'ERP: off' })).toHaveAttribute('data-status', 'down');
    expect(screen.getByRole('img', { name: 'CDN: on' })).toBeInTheDocument();
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

  test('with animation: stays on the rack while the drawer slides, then navigates', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderHome(<RackUnit unit={unit} leds={[]} />);
    const link = screen.getByRole('link', { name: 'Open About' });

    fireEvent.click(link);
    expect(screen.queryByTestId('path')).not.toBeInTheDocument();
    expect(link).toHaveAttribute('data-opening', 'true');

    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });

  test('second click during slide-out navigates once, immediately', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    let renders = 0;
    function CountingProbe() {
      renders += 1;
      return <LocationProbe />;
    }
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<RackUnit unit={unit} leds={[]} />} />
          <Route path="*" element={<CountingProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Open About' });
    fireEvent.click(link);
    fireEvent.click(link);
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
    const afterSkip = renders;
    act(() => vi.advanceTimersByTime(2000));
    expect(renders).toBe(afterSkip); // the fallback timer did not navigate again
  });
});

// A content page that "navigates home" the way the navbar does (PUSH with rack state).
function PageThatGoesHome({ state }) {
  const navigate = useNavigate();
  return (
    <>
      <LocationProbe />
      <button type="button" onClick={() => navigate('/', { state })}>
        go-home
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        go-back
      </button>
    </>
  );
}

function renderReturn(state) {
  return render(
    <MemoryRouter initialEntries={['/projects']}>
      <Routes>
        <Route path="/" element={<RackView summary={null} />} />
        <Route path="*" element={<PageThatGoesHome state={state} />} />
      </Routes>
    </MemoryRouter>,
  );
}

// Lets activeTransition().then(...) run, then advances fake time.
async function tick(ms) {
  await act(async () => {
    await Promise.resolve();
    vi.advanceTimersByTime(ms);
  });
}

describe('Animated return choreography', () => {
  test('close: the drawer comes back parked, then releases its morph name', async () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderReturn({ from: '/projects' });
    fireEvent.click(screen.getByRole('button', { name: 'go-home' }));
    const projects = screen.getByRole('link', { name: /Open Projects/ });
    expect(projects.style.viewTransitionName).toBe('unit-header');
    await tick(0);
    expect(projects.style.viewTransitionName).toBe('');
    await tick(2000);
    // The rack is usable again afterwards.
    fireEvent.click(screen.getByRole('link', { name: /Open About/ }));
    await tick(2000);
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });

  test('hop with animation: next unit opens and the rack entry is replaced', async () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderReturn({ from: '/projects', next: '/contact' });
    fireEvent.click(screen.getByRole('button', { name: 'go-home' }));
    await tick(0);
    await tick(1000); // push-in (fallback)
    await tick(1000); // pull-out of the next unit (fallback)
    expect(screen.getByTestId('path')).toHaveTextContent('/contact');
    fireEvent.click(screen.getByRole('button', { name: 'go-back' }));
    expect(screen.getByTestId('path')).toHaveTextContent('/projects');
  });

  test('a press anywhere during the push-in skips straight to the next page', async () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderReturn({ from: '/projects', next: '/contact' });
    fireEvent.click(screen.getByRole('button', { name: 'go-home' }));
    await tick(0);
    fireEvent.pointerDown(document.body);
    await tick(0);
    expect(screen.getByTestId('path')).toHaveTextContent('/contact');
  });
});

describe('Skip and modifier clicks', () => {
  test('a press anywhere during the slide-out navigates immediately', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderHome(<RackView summary={null} />);
    fireEvent.click(screen.getByRole('link', { name: /Open About/ }));
    fireEvent.pointerDown(document.body);
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });

  test('ctrl-click on a rack unit is left to the browser', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderHome(<RackView summary={null} />);
    const link = screen.getByRole('link', { name: /Open About/ });
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(link).not.toHaveAttribute('data-opening');
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.queryByTestId('path')).not.toBeInTheDocument();
  });
});

describe('Loose screw', () => {
  test('exactly one loose screw, linking to /casino', () => {
    renderHome(<RackView summary={null} />);
    const screws = screen.getAllByRole('link', { name: 'Loose screw' });
    expect(screws).toHaveLength(1);
    expect(screws[0]).toHaveAttribute('href', '/casino');
  });

  test('loose screw is keyboard reachable', async () => {
    renderHome(<RackView summary={null} />);
    screen.getByRole('link', { name: 'Loose screw' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByTestId('path')).toHaveTextContent('/casino');
  });
});

describe('Rack choreography', () => {
  test('clicking another unit while one opens is ignored', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    renderHome(<RackView summary={null} />);
    fireEvent.click(screen.getByRole('link', { name: /Open About/ }));
    fireEvent.click(screen.getByRole('link', { name: /Open Projects/ }));
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByTestId('path')).toHaveTextContent('/about');
  });

  test('POP to / with leftover next state does nothing', () => {
    motionState.reduce = false;
    vi.useFakeTimers();
    render(
      <MemoryRouter initialEntries={[{ pathname: '/', state: { from: '/projects', next: '/contact' } }]}>
        <Routes>
          <Route path="/" element={<RackView summary={null} />} />
          <Route path="*" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByTestId('path')).not.toBeInTheDocument();
  });
});
