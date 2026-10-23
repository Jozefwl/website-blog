const { test } = require('node:test');
const assert = require('node:assert/strict');
const { summarizeStatus, createStatusFetcher } = require('../status');

// Shaped like the real monitoring.waldoserver.top responses.
const page = {
  publicGroupList: [
    { name: 'Waldhauser.sk domain main', monitorList: [{ id: 2, name: 'Waldhauser.sk website', type: 'http' }] },
    {
      name: 'Waldhauser.sk domain ERP',
      monitorList: [
        { id: 10, name: 'ERPNext landing page (NGINX)', type: 'http' },
        { id: 11, name: 'ERPNext tenant 1', type: 'http' },
        { id: 12, name: 'ERPNext tenant 2', type: 'http' },
      ],
    },
  ],
};

const heartbeat = {
  heartbeatList: {
    2: [{ status: 0 }, { status: 1 }],
    10: [{ status: 1 }, { status: 0 }],
    11: [{ status: 3 }],
    12: [],
  },
  uptimeList: { '2_24': 1, '10_24': 0.95 },
};

test('summarizeStatus uses the last heartbeat of each monitor', () => {
  const { monitors } = summarizeStatus(page, heartbeat);
  const byId = Object.fromEntries(monitors.map((m) => [m.id, m]));

  assert.equal(byId[2].status, 'up');
  assert.equal(byId[10].status, 'down');
  assert.equal(byId[10].uptime24h, 0.95);
  assert.equal(byId[10].group, 'Waldhauser.sk domain ERP');
  assert.equal(byId[11].status, 'maintenance');
  assert.equal(byId[12].status, 'unknown');
  assert.equal(byId[12].uptime24h, null);
});

test('summarizeStatus survives empty input', () => {
  assert.deepEqual(summarizeStatus(undefined, undefined), { monitors: [] });
});

test('fetcher calls Uptime Kuma once per endpoint within the TTL', async () => {
  const calls = [];
  const http = {
    get: async (url) => {
      calls.push(url);
      return { data: url.includes('/heartbeat/') ? heartbeat : page };
    },
  };
  const getStatus = createStatusFetcher({ baseUrl: 'https://kuma.test', slug: 'waldhauser-services', http });

  const [a, b] = await Promise.all([getStatus(), getStatus()]);
  await getStatus();

  assert.equal(calls.length, 2);
  assert.deepEqual(calls.sort(), [
    'https://kuma.test/api/status-page/heartbeat/waldhauser-services',
    'https://kuma.test/api/status-page/waldhauser-services',
  ]);
  assert.equal(a, b);
  assert.equal(a.monitors.length, 4);
});

test('fetcher refetches after the TTL and rejects on failure', async () => {
  let time = 0;
  let fail = false;
  let count = 0;
  const http = {
    get: async (url) => {
      count += 1;
      if (fail) throw new Error('boom');
      return { data: url.includes('/heartbeat/') ? heartbeat : page };
    },
  };
  const getStatus = createStatusFetcher({ baseUrl: 'https://kuma.test', slug: 's', ttlMs: 1000, http, now: () => time });

  await getStatus();
  time = 2000;
  fail = true;
  await assert.rejects(getStatus(), /boom/);
  assert.equal(count, 4);
});
