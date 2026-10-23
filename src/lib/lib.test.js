import { describe, expect, test } from 'vitest';
import { isoWeek } from './isoWeek.js';
import { fetchMetrics, normalizeNodes } from './metrics.js';
import { fetchStatus, ledsForUnit } from './status.js';
import { buildMailto } from './mailto.js';
import { createConsentStore } from './consent.js';

describe('isoWeek (values from the old site function)', () => {
  test.each([
    ['2021-01-01T12:00:00', 53],
    ['2024-12-30T12:00:00', 1],
    ['2026-01-01T12:00:00', 1],
    ['2026-10-23T12:00:00', 43],
  ])('%s -> week %i', (date, week) => {
    expect(isoWeek(new Date(date))).toBe(week);
  });
});

describe('normalizeNodes', () => {
  test('passes through nodes', () => {
    const nodes = [{ instance: 'a', name: 'A', cpu: 1, memory: 2, cpuLabel: 'c', memLabel: 'm' }];
    expect(normalizeNodes({ nodes })).toBe(nodes);
  });

  test('supports the legacy Prometheus shape', () => {
    expect(
      normalizeNodes({ cpu: [{ metric: { instance: 'x:9100' }, value: [0, '12.5'] }], memory: [{ value: [0, '40'] }] }),
    ).toEqual([{ instance: 'x:9100', name: 'Server', cpu: 12.5, memory: 40, cpuLabel: 'CPU', memLabel: 'RAM' }]);
  });

  test('empty -> []', () => {
    expect(normalizeNodes({})).toEqual([]);
  });
});

describe('fetch helpers', () => {
  test('non-OK response rejects with the old message', async () => {
    await expect(fetchMetrics('u', { fetchImpl: async () => ({ ok: false }) })).rejects.toThrow('Failed to fetch metrics');
    await expect(fetchStatus('u', { fetchImpl: async () => ({ ok: false }) })).rejects.toThrow('Failed to fetch status');
  });

  test('timeout rejects with "Request timed out"', async () => {
    const hang = (url, { signal }) =>
      new Promise((_, reject) => signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
    await expect(fetchStatus('u', { timeoutMs: 10, fetchImpl: hang })).rejects.toThrow('Request timed out');
  });
});

describe('ledsForUnit', () => {
  const unit = { monitors: [{ id: 2, label: 'Web' }, { id: 99, label: 'Gone' }] };

  test('maps statuses; missing monitor is unknown', () => {
    const summary = { monitors: [{ id: 2, status: 'up' }] };
    expect(ledsForUnit(unit, summary)).toEqual([
      { id: 2, label: 'Web', status: 'up' },
      { id: 99, label: 'Gone', status: 'unknown' },
    ]);
  });

  test('no summary -> all unknown', () => {
    expect(ledsForUnit(unit, null).map((l) => l.status)).toEqual(['unknown', 'unknown']);
  });

  test('unexpected status value -> unknown', () => {
    expect(ledsForUnit(unit, { monitors: [{ id: 2, status: 'weird' }] })[0].status).toBe('unknown');
  });
});

describe('buildMailto', () => {
  test('same format as the old contact page', () => {
    expect(buildMailto('Jo & Ann', 'Hi\nthere')).toBe(
      'mailto:jozef@waldhauser.sk?subject=Contact%20Form%20Submission&body=----- Contact Form Submission ----- %0A%0AName:%20Jo%20%26%20Ann%0A%0AMessage:%0AHi%0Athere%0A%0A-----------------------------------',
    );
  });

  test('encodes non-ASCII and #', () => {
    expect(buildMailto('Šťastný #1', 'x')).toContain('Name:%20%C5%A0%C5%A5astn%C3%BD%20%231');
  });
});

describe('consent store', () => {
  test('accept stores cookiesAccepted=true', () => {
    const data = {};
    const storage = { getItem: (k) => data[k] ?? null, setItem: (k, v) => (data[k] = v) };
    const store = createConsentStore(storage);
    expect(store.isAccepted()).toBe(false);
    store.accept();
    expect(data.cookiesAccepted).toBe('true');
    expect(store.isAccepted()).toBe(true);
  });

  test('throwing storage does not crash', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
    };
    const store = createConsentStore(storage);
    expect(store.isAccepted()).toBe(false);
    expect(() => store.accept()).not.toThrow();
  });
});
