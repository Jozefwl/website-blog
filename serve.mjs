// Tiny static file server for the built site (dist/).
// Uses only Node.js built-ins, so the production image needs no node_modules.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Same headers the old next.config.mjs sent.
export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://metrics.waldhauser.sk",
    "frame-src 'self' https://www.meteoblue.com",
    'upgrade-insecure-requests',
  ].join('; '),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function send(res, status, headers, body = '') {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

function sendFile(req, res, filePath, cacheControl) {
  const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    ...SECURITY_HEADERS,
    'Content-Type': type,
    'Content-Length': fs.statSync(filePath).size,
    'Cache-Control': cacheControl,
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
}

export function createServer({ root }) {
  const rootDir = path.resolve(root);
  const indexFile = path.join(rootDir, 'index.html');

  return http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      send(res, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, 'Method Not Allowed');
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Bad Request');
      return;
    }

    // Block path traversal: the resolved file must stay inside dist/.
    // (Check the raw URL too, because new URL() already collapses "/../".)
    const filePath = path.resolve(rootDir, '.' + pathname);
    const rawPath = req.url.split('?')[0];
    if ((filePath !== rootDir && !filePath.startsWith(rootDir + path.sep)) || /(^|\/)\.\.(\/|$)/.test(rawPath) || /%2e%2e/i.test(rawPath)) {
      send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not Found');
      return;
    }

    if (pathname !== '/' && isFile(filePath)) {
      const immutable = pathname.startsWith('/assets/');
      sendFile(req, res, filePath, immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=86400');
      return;
    }

    // SPA fallback: routes like /about have no extension -> serve index.html.
    if (path.extname(pathname) === '' && isFile(indexFile)) {
      sendFile(req, res, indexFile, 'no-cache');
      return;
    }

    send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not Found');
  });
}

// Run directly: node serve.mjs
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
  createServer({ root }).listen(port, '0.0.0.0', () => {
    console.log(`Serving ${root} on http://0.0.0.0:${port}`);
  });
}
