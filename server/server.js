const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// Prometheus server URL
const prometheusUrl = 'http://localhost:9090'; // Change this to your Prometheus server URL

// Define PromQL queries for CPU and memory usage
const cpuQuery = '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)';
const memQuery = '100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))';

async function fetchMetrics() {
    try {
      // Fetch CPU usage
      const cpuResponse = await axios.get(`${prometheusUrl}/api/v1/query?query=${encodeURIComponent(cpuQuery)}`);
      const cpuData = cpuResponse.data;
  
      // Fetch memory usage
      const memResponse = await axios.get(`${prometheusUrl}/api/v1/query?query=${encodeURIComponent(memQuery)}`);
      const memData = memResponse.data;
  
      return {
        cpu: cpuData.data.result,
        memory: memData.data.result,
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  }
  
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  
  // API endpoint to get the metrics
  app.get('/', async (req, res) => {
      res.send('Welcome to the metrics API! Visit /metrics for metrics regarding CPU and MEMORY usage!');
  });
  
  app.get('/metrics', async (req, res) => {
    try {
      const metrics = await fetchMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch metrics' });
    }
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });