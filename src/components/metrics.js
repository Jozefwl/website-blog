"use client";
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../css/metrics.css';

const fetchMetrics = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch('https://metrics.waldhauser.sk/metrics', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    return response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

function normalizeNodes(metrics) {
  if (metrics.nodes?.length) {
    return metrics.nodes;
  }

  const cpu = metrics.cpu?.[0];
  const memory = metrics.memory?.[0];
  if (!cpu) {
    return [];
  }

  return [{
    instance: cpu.metric?.instance ?? 'unknown',
    name: 'Server',
    cpu: parseFloat(cpu.value[1]),
    memory: memory ? parseFloat(memory.value[1]) : 0,
    cpuLabel: 'CPU',
    memLabel: 'RAM',
  }];
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

  const nodes = normalizeNodes(metrics);

  if (!nodes.length) {
    return <div>No metrics available</div>;
  }

  return (
    <>
      <h3>Cluster metrics:</h3>
      <div className="metrics-grid">
        {nodes.map((node) => (
          <div className="node-metrics" key={node.instance}>
            <h4 className="node-name">{node.name}</h4>
            <div className="metrics-container">
              <div className="metric">
                <CircularProgressbar
                  value={node.cpu ?? 0}
                  text={`${(node.cpu ?? 0).toFixed(2)}%`}
                  styles={buildStyles({
                    textColor: 'white',
                    pathColor: 'blue',
                    trailColor: 'grey',
                  })}
                />
                <p className="metric-label">{node.cpuLabel}</p>
              </div>
              <div className="metric">
                <CircularProgressbar
                  value={node.memory ?? 0}
                  text={`${(node.memory ?? 0).toFixed(2)}%`}
                  styles={buildStyles({
                    textColor: 'white',
                    pathColor: 'green',
                    trailColor: 'grey',
                  })}
                />
                <p className="metric-label">{node.memLabel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Metrics;
