import { useCallback } from 'react';
import { flushSync } from 'react-dom';
import { useLocation, useNavigate } from 'react-router';
import { RACK_UNITS } from '../data/rackUnits.js';
import { runViewTransition, skipOnNextPress, transitionKind } from '../lib/transitions.js';

const RACK_PATHS = RACK_UNITS.map((unit) => unit.to);

// go(to): navigate with the right rack choreography.
// - close/fade: view transition straight to `to`
// - hop: back to the rack first; the rack then pushes this drawer in and pulls the next one out
// - open: plain navigation (the rack unit runs its own slide-out before calling navigate)
export function useRackNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (to) => {
      const kind = transitionKind(pathname, to, RACK_PATHS);
      if (kind === 'none') return;
      if (kind === 'open') {
        navigate(to);
        return;
      }
      const target = kind === 'hop' ? '/' : to;
      const state = kind === 'hop' ? { from: pathname, next: to } : { from: pathname };
      skipOnNextPress(runViewTransition(() => flushSync(() => navigate(target, { state }))));
    },
    [navigate, pathname],
  );
}
