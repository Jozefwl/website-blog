const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

const prometheusUrl = process.env.PROMETHEUS_URL;

// queries
const cpuQuery = '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))) * 100';
const memQuery = '100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))';

async function fetchMetrics() {
  try {
    const [cpuRes, memRes] = await Promise.all([
      axios.get(`${prometheusUrl}/api/v1/query`, { params: { query: cpuQuery } }),
      axios.get(`${prometheusUrl}/api/v1/query`, { params: { query: memQuery } })
    ]);

    return {
      cpu: cpuRes.data.data.result,
      memory: memRes.data.data.result,
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

app.get('/', (req, res) => res.send('Metrics API: Use /metrics endpoint'));
app.get('/metrics', async (req, res) => {
  try {
    res.json(await fetchMetrics());
  } catch (error) {
    res.status(500).json({ error: 'Metrics fetch failed' });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
