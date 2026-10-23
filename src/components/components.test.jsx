import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, test, vi } from 'vitest';
import StatusLed from './rack/StatusLed.jsx';
import Gauge from './rack/Gauge.jsx';
import { LcdDisplay } from './rack/LcdClock.jsx';
import { MetricsView } from './rack/MetricsUnit.jsx';
import CookieNotice from './layout/CookieNotice.jsx';
import Navbar from './layout/Navbar.jsx';
import Imagebox from './common/Imagebox.jsx';
import WeatherWidget from './common/WeatherWidget.jsx';

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('StatusLed', () => {
  test('state is in the accessible name, not only colour', () => {
    render(<StatusLed status="down" label="ERP" />);
    const led = screen.getByRole('img', { name: 'ERP: down' });
    expect(led).toHaveAttribute('data-status', 'down');
  });
});

describe('Gauge', () => {
  test('shows value with 2 decimals', () => {
    render(<Gauge value={12.345} color="blue" label="CPU" />);
    expect(screen.getByText('12.35%')).toBeInTheDocument();
  });

  test('NaN shows 0.00%', () => {
    render(<Gauge value={NaN} color="blue" label="CPU" />);
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });
});

describe('LcdDisplay', () => {
  test('shows ISO date/time in UTC like the old infobox', () => {
    render(<LcdDisplay now={new Date('2026-10-23T12:00:00Z')} />);
    expect(screen.getByText('Date: 2026-10-23')).toBeInTheDocument();
    expect(screen.getByText('Time: 12:00:00.000Z')).toBeInTheDocument();
    expect(screen.getByText(/^It is week \d+ of the year 2026\.$/)).toBeInTheDocument();
  });
});

describe('MetricsView', () => {
  test('loading / error / empty states', () => {
    const { rerender } = render(<MetricsView nodes={null} error={null} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    rerender(<MetricsView nodes={null} error="Request timed out" />);
    expect(screen.getByText('Error: Request timed out')).toBeInTheDocument();
    rerender(<MetricsView nodes={[]} error={null} />);
    expect(screen.getByText('No metrics available')).toBeInTheDocument();
  });

  test('one card per node with CPU and RAM gauges', () => {
    const nodes = [{ instance: 'a', name: 'MSi Server', cpu: 10, memory: 20, cpuLabel: 'i7 CPU', memLabel: '16Gi RAM' }];
    render(<MetricsView nodes={nodes} error={null} />);
    expect(screen.getByText('MSi Server')).toBeInTheDocument();
    expect(screen.getByText('10.00%')).toBeInTheDocument();
    expect(screen.getByText('20.00%')).toBeInTheDocument();
  });
});

describe('CookieNotice', () => {
  test('shows first, Close hides it and it stays hidden', async () => {
    const { unmount } = renderInRouter(<CookieNotice />);
    expect(screen.getByText(/This site uses cookies/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByText(/This site uses cookies/)).not.toBeInTheDocument();
    expect(localStorage.getItem('cookiesAccepted')).toBe('true');
    unmount();
    renderInRouter(<CookieNotice />);
    expect(screen.queryByText(/This site uses cookies/)).not.toBeInTheDocument();
  });
});

describe('Navbar', () => {
  test('has all five pages', () => {
    renderInRouter(<Navbar />);
    for (const name of ['Home', 'About', 'Projects', 'Services', 'Contact']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    }
  });
});

describe('Imagebox', () => {
  afterEach(() => vi.useRealTimers());

  test('changes slide every 4.5 s and loops', () => {
    vi.useFakeTimers();
    const slides = [
      { src: '/a.jpg', alt: 'A', caption: 'First' },
      { src: '/b.jpg', alt: 'B', caption: 'Second' },
    ];
    render(<Imagebox slides={slides} />);
    expect(screen.getByText('First')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4500));
    expect(screen.getByText('Second')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4500));
    expect(screen.getByText('First')).toBeInTheDocument();
  });
});

describe('WeatherWidget', () => {
  test('iframes load only after expanding', async () => {
    render(<WeatherWidget />);
    expect(screen.queryByTitle(/Weather in/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Expand Weather' }));
    expect(screen.getAllByTitle(/Weather in/)).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Collapse Weather' })).toBeInTheDocument();
  });
});
