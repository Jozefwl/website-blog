const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

const prometheusUrl = process.env.PROMETHEUS_URL;
const NODE_INFO = parseNodeInfo(process.env.NODE_LABELS_JSON);
const ALLOWED_ORIGINS = new Set([
  'https://waldhauser.sk',
  'https://www.waldhauser.sk',
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
]);
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const ipRateMap = new Map();

const cpuQuery = '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle",job="node-exporter"}[5m]))) * 100';
const memQuery = '100 * (1 - (node_memory_MemAvailable_bytes{job="node-exporter"} / node_memory_MemTotal_bytes{job="node-exporter"}))';

function parseNodeInfo(value) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn('NODE_LABELS_JSON is invalid JSON; using fallback labels.');
    return {};
  }
}

function getNodeInfo(instance) {
  const ip = instance?.split(':')[0];
  return NODE_INFO[ip] || { name: ip || instance, cpuLabel: 'CPU', memLabel: 'RAM' };
}

function groupByInstance(cpuResults, memResults) {
  const nodes = {};

  for (const item of cpuResults) {
    const instance = item.metric.instance;
    const info = getNodeInfo(instance);
    nodes[instance] = {
      instance,
      name: info.name,
      cpuLabel: info.cpuLabel,
      memLabel: info.memLabel,
      cpu: parseFloat(item.value[1]),
    };
  }

  for (const item of memResults) {
    const instance = item.metric.instance;
    const info = getNodeInfo(instance);
    if (!nodes[instance]) {
      nodes[instance] = {
        instance,
        name: info.name,
        cpuLabel: info.cpuLabel,
        memLabel: info.memLabel,
      };
    }
    nodes[instance].memory = parseFloat(item.value[1]);
  }

  return Object.values(nodes).sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchMetrics() {
  try {
    const [cpuRes, memRes] = await Promise.all([
      axios.get(`${prometheusUrl}/api/v1/query`, { params: { query: cpuQuery } }),
      axios.get(`${prometheusUrl}/api/v1/query`, { params: { query: memQuery } })
    ]);

    return {
      nodes: groupByInstance(cpuRes.data.data.result, memRes.data.data.result),
    };
  } catch (error) {
    console.error(`Error fetching metrics: ${error.message}`);
    throw error;
  }
}

function setSecurityHeaders(res) {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function resolveClientIp(req) {
  const forwarded = req.get('X-Forwarded-For');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const record = ipRateMap.get(ip);

  if (!record || now - record.windowStart >= RATE_LIMIT_WINDOW_MS) {
    ipRateMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  record.count += 1;
  if (record.count > RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  return false;
}

app.use((req, res, next) => {
  setSecurityHeaders(res);

  const origin = req.get('Origin');
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
  }

  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/', (req, res) => res.json({message: "Metrics server is running. Metrics API: Use /metrics endpoint"}));
app.get('/metrics', async (req, res) => {
  const clientIp = resolveClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    res.json(await fetchMetrics());
  } catch (error) {
    res.status(500).json({ error: 'Metrics fetch failed' });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
