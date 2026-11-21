import { describe, expect, test, vi } from 'vitest';
import { activeTransition, isPlainLeftClick, runViewTransition, skipOnNextPress, transitionKind } from './transitions.js';

const RACK = ['/about', '/projects', '/services', '/contact'];

describe('transitionKind', () => {
  test.each([
    ['/', '/about', 'open'],
    ['/about', '/', 'close'],
    ['/projects', '/contact', 'hop'],
    ['/casino', '/about', 'fade'],
    ['/about', '/casino', 'fade'],
    ['/nope', '/', 'fade'],
    ['/about', '/about', 'none'],
  ])('%s -> %s is %s', (from, to, kind) => {
    expect(transitionKind(from, to, RACK)).toBe(kind);
  });
});

describe('runViewTransition', () => {
  test('without browser support: updates synchronously and resolves', async () => {
    const update = vi.fn();
    const { finished, skip } = runViewTransition(update, { doc: {}, reduced: false });
    expect(update).toHaveBeenCalledTimes(1);
    await expect(finished).resolves.toBeUndefined();
    expect(() => skip()).not.toThrow();
  });

  test('with browser support: runs inside startViewTransition and can be skipped', async () => {
    const update = vi.fn();
    const skipTransition = vi.fn();
    const doc = {
      startViewTransition: vi.fn((cb) => {
        cb();
        return { finished: Promise.resolve(), skipTransition };
      }),
    };
    const { finished, skip } = runViewTransition(update, { doc, reduced: false });
    expect(doc.startViewTransition).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
    skip();
    expect(skipTransition).toHaveBeenCalledTimes(1);
    await expect(finished).resolves.toBeUndefined();
  });

  test('a rejected transition still resolves finished', async () => {
    const doc = { startViewTransition: (cb) => (cb(), { finished: Promise.reject(new Error('aborted')), skipTransition() {} }) };
    await expect(runViewTransition(() => {}, { doc, reduced: false }).finished).resolves.toBeUndefined();
  });

  test('activeTransition() waits for the running transition', async () => {
    let finish;
    const doc = { startViewTransition: (cb) => (cb(), { finished: new Promise((r) => (finish = r)), skipTransition() {} }) };
    runViewTransition(() => {}, { doc, reduced: false });
    let done = false;
    activeTransition().then(() => (done = true));
    await Promise.resolve();
    expect(done).toBe(false);
    finish();
    await activeTransition();
    expect(done).toBe(true);
  });

  test('skipOnNextPress: a pointer press skips the transition once', async () => {
    const skip = vi.fn();
    let finish;
    skipOnNextPress({ skip, finished: new Promise((r) => (finish = r)) });
    window.dispatchEvent(new Event('pointerdown'));
    window.dispatchEvent(new Event('pointerdown'));
    expect(skip).toHaveBeenCalledTimes(1);
    finish();
  });

  test('watchdog: if the browser never runs the update, the transition is skipped', () => {
    vi.useFakeTimers();
    const update = vi.fn();
    let pending;
    const doc = {
      startViewTransition: (cb) => {
        pending = cb; // a throttled tab never gets a frame to call it
        return { finished: new Promise(() => {}), skipTransition: () => pending() };
      },
    };
    runViewTransition(update, { doc, reduced: false });
    expect(update).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(update).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  test('watchdog stays quiet when the update already ran', () => {
    vi.useFakeTimers();
    const update = vi.fn();
    const skipTransition = vi.fn();
    const doc = { startViewTransition: (cb) => (cb(), { finished: new Promise(() => {}), skipTransition }) };
    runViewTransition(update, { doc, reduced: false });
    vi.advanceTimersByTime(1000);
    expect(skipTransition).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  test('reduced motion never starts a view transition', () => {
    const update = vi.fn();
    const doc = { startViewTransition: vi.fn() };
    runViewTransition(update, { doc, reduced: true });
    expect(doc.startViewTransition).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(1);
  });
});

describe('isPlainLeftClick', () => {
  test.each([
    [{ button: 0 }, true],
    [{ button: 1 }, false],
    [{ button: 0, ctrlKey: true }, false],
    [{ button: 0, metaKey: true }, false],
    [{ button: 0, shiftKey: true }, false],
    [{ button: 0, altKey: true }, false],
  ])('%o -> %s', (event, expected) => {
    expect(isPlainLeftClick(event)).toBe(expected);
  });
});
