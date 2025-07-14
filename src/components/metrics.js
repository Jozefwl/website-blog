"use client";
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../css/metrics.css';

const fetchMetrics = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

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

const Metrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getMetrics() {
      try {
        const data = await fetchMetrics();
        console.log('Fetched data:', data); // Debug: Check the actual structure
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

  // Extract CPU and memory usage from the API response structure
  const cpuUsage = metrics.cpu?.[0]?.value?.[1] ? parseFloat(metrics.cpu[0].value[1]) : 0;
  const memoryUsage = metrics.memory?.[0]?.value?.[1] ? parseFloat(metrics.memory[0].value[1]) : 0;

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
          <p className="metric-label">i5-3320M CPU</p>
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
          <p className="metric-label">16Gi RAM</p>
        </div>
      </div>
    </>
  );
};

export default Metrics;