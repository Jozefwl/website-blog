const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

const prometheusUrl = process.env.PROMETHEUS_URL;
//const proxyIp = process.env.PROXY_IP;

const NODE_INFO = {
  '192.168.0.119': { name: 'MSi Server', cpuLabel: 'i7-8750H CPU', memLabel: '16Gi RAM' },
  '192.168.0.136': { name: 'Toughbook CF-19', cpuLabel: 'i5-3320M CPU', memLabel: '16Gi RAM' },
};

const cpuQuery = '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle",job="node-exporter"}[5m]))) * 100';
const memQuery = '100 * (1 - (node_memory_MemAvailable_bytes{job="node-exporter"} / node_memory_MemTotal_bytes{job="node-exporter"}))';

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
    console.error('Error fetching metrics:', error.response?.data || error.message);
    throw error;
  }
}

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.set('trust proxy', true);

app.get('/', (req, res) => res.json({message: "Metrics server is running. Metrics API: Use /metrics endpoint"}));
app.get('/metrics', async (req, res) => {
  const forwarded = req.get('X-Forwarded-For');
  const clientIP = forwarded
    ? forwarded.split(',')[0].trim()   // first IP is the real client
    : req.ip;
  
    const userAgent = req.get('User-Agent') || 'unknown';

  console.log(`GET metrics; IP: ${clientIP}, User-Agent: ${userAgent}`);

  try {
    res.json(await fetchMetrics());
  } catch (error) {
    res.status(500).json({ error: 'Metrics fetch failed' });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
