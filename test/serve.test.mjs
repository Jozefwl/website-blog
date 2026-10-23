// Tests for serve.mjs. Run `npm run build` first (npm test does `vitest run` before this).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import { createServer, SECURITY_HEADERS } from '../serve.mjs';

let server;
let base;

before(async () => {
  assert.ok(fs.existsSync('dist/index.html'), 'run `npm run build` before these tests');
  server = createServer({ root: 'dist' });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

// Raw request so paths like /../ are sent as-is (fetch would normalize them).
function request(method, rawPath) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${base}${rawPath}`, { method, path: rawPath }, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

test('GET / returns html with all security headers', async () => {
  const res = await request('GET', '/');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /^text\/html/);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    assert.equal(res.headers[key.toLowerCase()], value, key);
  }
});

test('client routes fall back to index.html', async () => {
  for (const route of ['/about', '/projects', '/services', '/contact', '/links']) {
    const res = await request('GET', route);
    assert.equal(res.status, 200, route);
    assert.match(res.headers['content-type'], /^text\/html/, route);
  }
});

test('real files are served with their type', async () => {
  const res = await request('GET', '/images/moher.jpg');
  assert.equal(res.status, 200);
  assert.equal(res.headers['content-type'], 'image/jpeg');
});

test('missing asset is 404, not html', async () => {
  const res = await request('GET', '/assets/nope.js');
  assert.equal(res.status, 404);
});

test('path traversal is blocked', async () => {
  for (const p of ['/../package.json', '/%2e%2e/serve.mjs', '/images/..%2f..%2fserve.mjs']) {
    const res = await request('GET', p);
    assert.equal(res.status, 404, p);
  }
});

test('HEAD works, other methods are 405', async () => {
  const head = await request('HEAD', '/');
  assert.equal(head.status, 200);
  assert.equal(head.body, '');
  const post = await request('POST', '/');
  assert.equal(post.status, 405);
  assert.equal(post.headers.allow, 'GET, HEAD');
});
