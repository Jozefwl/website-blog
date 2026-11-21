const express = require('express');
const axios = require('axios');
const { createStatusFetcher } = require('./status');
const { resolveClientIp, createRateLimiter } = require('./rateLimit');
const app = express();
const port = 5000;

// Don't advertise the framework.
app.disable('x-powered-by');

const prometheusUrl = process.env.PROMETHEUS_URL;
const NODE_INFO = parseNodeInfo(process.env.NODE_LABELS_JSON);
const ALLOWED_ORIGINS = new Set([
  'https://waldhauser.sk',
  'https://www.waldhauser.sk',
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
]);
const isRateLimited = createRateLimiter({ windowMs: 60 * 1000, max: 60 });
const PROMETHEUS_TIMEOUT_MS = 5000;
// Cache /metrics briefly so bursts of visitors don't each hit Prometheus twice.
const METRICS_TTL_MS = 10 * 1000;
let metricsCache = null;
let metricsCachedAt = 0;

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

  // `instance` is the node's LAN address (e.g. 192.168.x.x:9100); don't publish it.
  // The frontend only needs a stable key, so the display name stands in for it.
  return Object.values(nodes)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((node) => ({ ...node, instance: node.name }));
}

async function fetchMetrics() {
  if (metricsCache && Date.now() - metricsCachedAt < METRICS_TTL_MS) {
    return metricsCache;
  }

  try {
    const options = { timeout: PROMETHEUS_TIMEOUT_MS };
    const [cpuRes, memRes] = await Promise.all([
      axios.get(`${prometheusUrl}/api/v1/query`, { ...options, params: { query: cpuQuery } }),
      axios.get(`${prometheusUrl}/api/v1/query`, { ...options, params: { query: memQuery } }),
    ]);

    metricsCache = {
      nodes: groupByInstance(cpuRes.data.data.result, memRes.data.data.result),
    };
    metricsCachedAt = Date.now();
    return metricsCache;
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
  // JSON-only API: nothing here should ever render or load resources.
  res.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
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

// Uptime Kuma status for the website's rack LEDs (only when configured).
if (process.env.UPTIME_KUMA_URL) {
  const getStatus = createStatusFetcher({
    baseUrl: process.env.UPTIME_KUMA_URL,
    slug: process.env.UPTIME_KUMA_SLUG || 'waldhauser-services',
  });

  app.get('/status', async (req, res) => {
    const clientIp = resolveClientIp(req);
    if (isRateLimited(clientIp)) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    try {
      res.json(await getStatus());
    } catch (error) {
      console.error(`Error fetching status: ${error.message}`);
      res.status(502).json({ error: 'Status fetch failed' });
    }
  });
}

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
