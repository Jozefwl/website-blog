// Per-IP fixed-window rate limiting.

// Client IP for rate limiting. The site sits behind Cloudflare, which sets
// CF-Connecting-IP to the real client and overwrites any value the client sent.
// X-Forwarded-For is NOT used: its first entry is whatever the client typed,
// so trusting it let anyone dodge the limit by sending a fake IP each time.
function resolveClientIp(req) {
  const cfIp = req.get('CF-Connecting-IP');
  if (cfIp) {
    return cfIp.trim();
  }
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

// Returns isLimited(ip). Expired windows are swept out and the map is capped,
// so a flood of distinct IPs cannot grow memory without bound.
function createRateLimiter({ windowMs = 60_000, max = 60, maxEntries = 10_000, now = Date.now } = {}) {
  const records = new Map();

  function sweep(time) {
    for (const [ip, record] of records) {
      if (time - record.windowStart >= windowMs) {
        records.delete(ip);
      }
    }
  }

  return function isLimited(ip) {
    const time = now();
    const record = records.get(ip);

    if (!record || time - record.windowStart >= windowMs) {
      if (!record && records.size >= maxEntries) {
        sweep(time);
        // Still full after the sweep: drop the oldest entry (Map keeps insertion order).
        if (records.size >= maxEntries) {
          records.delete(records.keys().next().value);
        }
      }
      records.delete(ip);
      records.set(ip, { windowStart: time, count: 1 });
      return false;
    }

    record.count += 1;
    return record.count > max;
  };
}

module.exports = { resolveClientIp, createRateLimiter };
