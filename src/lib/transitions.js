// Page transitions: timing, the View Transitions wrapper, and which kind of move a link is.
// The app uses <BrowserRouter>, where React Router's own `viewTransition` option is not
// available, so navigation is wrapped in document.startViewTransition here instead.

export const TIMING = {
  slideOutS: 0.45, // drawer pulls out before the page opens
  slideInS: 0.45, // drawer pushes back in after returning to the rack
  hopSlideInS: 0.25, // faster push-in when the next drawer is about to open
  morphMs: 300, // faceplate <-> page header
  fadeMs: 150, // page content fade
};

// Shared by the clicked faceplate and the page header, so the browser morphs one into the other.
export const HEADER_VT_NAME = 'unit-header';

export function prefersReducedMotion(win = typeof window === 'undefined' ? undefined : window) {
  return Boolean(win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

const settled = () => Promise.resolve();
const UPDATE_WATCHDOG_MS = 1000;

// The most recent transition's `finished`, so the rack can wait for the morph before sliding.
let active = settled();
export const activeTransition = () => active;

// Runs `update` (a synchronous DOM change, e.g. flushSync(navigate)) inside a view transition
// when the browser supports it and motion is allowed; otherwise just runs it.
export function runViewTransition(update, { doc = globalThis.document, reduced = prefersReducedMotion() } = {}) {
  if (reduced || typeof doc?.startViewTransition !== 'function') {
    update();
    active = settled();
    return { finished: active, skip: () => {} };
  }
  // Watchdog: the browser calls `update` on its next rendering opportunity. A throttled or
  // hidden tab may never get one, which would leave the visitor stuck; skipping still runs it.
  let updated = false;
  const transition = doc.startViewTransition(() => {
    updated = true;
    update();
  });
  setTimeout(() => {
    if (!updated) transition.skipTransition();
  }, UPDATE_WATCHDOG_MS);
  active = Promise.resolve(transition.finished).then(
    () => undefined,
    () => undefined,
  );
  return { finished: active, skip: () => transition.skipTransition() };
}

// The next pointer press anywhere finishes the running transition (a "second click" skips).
export function skipOnNextPress(transition, win = globalThis.window) {
  if (!win) return;
  const onPress = () => transition.skip();
  win.addEventListener('pointerdown', onPress, { capture: true, once: true });
  transition.finished.then(() => win.removeEventListener('pointerdown', onPress, { capture: true }));
}

// open: rack -> page, close: page -> rack, hop: page -> page via the rack, fade: anything else.
export function transitionKind(from, to, rackPaths) {
  if (from === to) return 'none';
  const fromRack = rackPaths.includes(from);
  const toRack = rackPaths.includes(to);
  if (from === '/' && toRack) return 'open';
  if (fromRack && to === '/') return 'close';
  if (fromRack && toRack) return 'hop';
  return 'fade';
}

// Ctrl/Cmd/Shift/Alt-clicks and middle clicks belong to the browser (new tab, new window...).
export function isPlainLeftClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}
