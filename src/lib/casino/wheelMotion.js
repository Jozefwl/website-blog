import { pocketAngle } from './roulette.js';

// Roulette "physics": not real physics, but a planned path that looks like it.
// Angles are degrees clockwise from the top; the ball's angle is tracked relative to the
// wheel so it can be steered into the result's pocket and then ride along with the wheel.
//   0    - 55%  ball runs the outer track, counter-clockwise, slowing down
//   55%  - 85%  it drops toward the pockets, hopping over a few dividers
//   85%  - 100% it is caught and turns with the wheel until the wheel stops
const DROP_AT = 0.55;
const BOUNCE_FROM = 0.6;
const CATCH_AT = 0.85;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeOutQuart = (t) => 1 - (1 - t) ** 4;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const mod360 = (a) => ((a % 360) + 360) % 360;

export function planBallPath({ result, start, rng, track, rest }) {
  const relStart = start.ball - start.wheel;
  const target = pocketAngle(result);
  const laps = 5 + Math.floor(rng() * 2);
  return {
    start,
    track,
    rest,
    wheelDelta: (2 + rng()) * 360, // wheel: 2-3 turns clockwise
    relStart,
    relDelta: -(laps * 360 + mod360(relStart - target)), // ends exactly on the pocket
    bounceDeg: 8 + rng() * 10,
    bounces: 2 + Math.floor(rng() * 2),
  };
}

// Where everything is at progress t (0..1): { wheel, ball, r }.
export function ballPosition(plan, t) {
  const { start, track, rest, wheelDelta, relStart, relDelta, bounceDeg, bounces } = plan;
  const wheel = start.wheel + wheelDelta * easeOutCubic(t);

  let rel = relStart + relDelta * easeOutQuart(Math.min(1, t / CATCH_AT));
  if (t > BOUNCE_FROM && t < CATCH_AT) {
    const p = (t - BOUNCE_FROM) / (CATCH_AT - BOUNCE_FROM);
    rel += bounceDeg * Math.sin(p * Math.PI * bounces) * (1 - p); // knocked sideways by the dividers
  }

  let r = track;
  if (t >= CATCH_AT) r = rest;
  else if (t > DROP_AT) {
    const p = (t - DROP_AT) / (CATCH_AT - DROP_AT);
    const fall = track - (track - rest) * easeInOut(p);
    const hop = (track - rest) * 0.35 * Math.abs(Math.sin(p * Math.PI * bounces)) * (1 - p);
    r = Math.min(track, fall + hop);
  }

  return { wheel, ball: wheel + rel, r };
}
