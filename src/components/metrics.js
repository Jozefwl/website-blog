"use client";

import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../css/metrics.css';

export async function fetchMetrics() {
  const metricsUrl = process.env.NEXT_PUBLIC_PROMETHEUS_URL;

  if (!metricsUrl) {
    throw new Error('Metrics URL is not defined in environment variables');
  }

  try {
    // Define PromQL queries for CPU and memory usage
    const cpuQuery = '100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)';
    const memQuery = '100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))';

    // Fetch CPU usage
    const cpuResponse = await fetch(`${metricsUrl}/api/v1/query?query=${encodeURIComponent(cpuQuery)}`);
    if (!cpuResponse.ok) {
      throw new Error(`Failed to fetch CPU metrics: ${cpuResponse.statusText}`);
    }
    const cpuData = await cpuResponse.json();

    // Fetch memory usage
    const memResponse = await fetch(`${metricsUrl}/api/v1/query?query=${encodeURIComponent(memQuery)}`);
    if (!memResponse.ok) {
      throw new Error(`Failed to fetch memory metrics: ${memResponse.statusText}`);
    }
    const memData = await memResponse.json();

    return {
      cpu: cpuData.data.result,
      memory: memData.data.result,
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

const Metrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getMetrics() {
      try {
        const data = await fetchMetrics();
        setMetrics(data);
      } catch (error) {
        setError(error.message);
      }
    }

    getMetrics();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!metrics) {
    return <div>Loading...</div>;
  }

  const cpuUsage = metrics.cpu.length > 0 ? parseFloat(metrics.cpu[0].value[1]) : 0;
  const memoryUsage = metrics.memory.length > 0 ? parseFloat(metrics.memory[0].value[1]) : 0;

  return (
    <>
    <h3>Server metrics:</h3>
    <div className="metrics-container">        
      <div className="metric">
        <CircularProgressbar
          value={cpuUsage}
          text={`${cpuUsage.toFixed(2)}%`}
          styles={buildStyles({
            textColor: 'white',
            pathColor: 'blue',
            trailColor: 'grey',
          })}
        />
        <p className="metric-label">CPU Usage</p>
      </div>
      <div className="metric">
        <CircularProgressbar
          value={memoryUsage}
          text={`${memoryUsage.toFixed(2)}%`}
          styles={buildStyles({
            textColor: 'white',
            pathColor: 'green',
            trailColor: 'grey',
          })}
        />
        <p className="metric-label">Memory Usage</p>
      </div>
    </div>
    </>
  );
};

export default Metrics;