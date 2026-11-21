const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolveClientIp, createRateLimiter } = require('../rateLimit');

function fakeReq(headers = {}, remoteAddress = '10.0.0.5') {
  const lower = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));
  return { get: (name) => lower[name.toLowerCase()], socket: { remoteAddress } };
}

test('resolveClientIp ignores a client-supplied X-Forwarded-For', () => {
  assert.equal(resolveClientIp(fakeReq({ 'X-Forwarded-For': '1.2.3.4' })), '10.0.0.5');
});

test('resolveClientIp uses CF-Connecting-IP when present', () => {
  assert.equal(resolveClientIp(fakeReq({ 'CF-Connecting-IP': ' 203.0.113.9 ', 'X-Forwarded-For': '1.2.3.4' })), '203.0.113.9');
});

test('rate limiter blocks after max requests and resets after the window', () => {
  let t = 0;
  const isLimited = createRateLimiter({ windowMs: 1000, max: 2, now: () => t });
  assert.equal(isLimited('a'), false);
  assert.equal(isLimited('a'), false);
  assert.equal(isLimited('a'), true);
  t = 1000;
  assert.equal(isLimited('a'), false);
});

test('rate limiter keeps at most maxEntries IPs', () => {
  let t = 0;
  const isLimited = createRateLimiter({ windowMs: 1000, max: 1, maxEntries: 3, now: () => t });
  for (const ip of ['a', 'b', 'c', 'd']) isLimited(ip);
  // 'a' was evicted as the oldest, so it starts a fresh window.
  assert.equal(isLimited('a'), false);
  // 'd' is still tracked and over its limit.
  assert.equal(isLimited('d'), true);
});
