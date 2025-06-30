# Prometheus Metrics API Server

This Node.js server fetches CPU and memory utilization metrics from Prometheus and exposes them via a REST API. It's designed to run in a Kubernetes environment where Prometheus is deployed.

## Features
- Fetches real-time CPU and memory metrics from Prometheus
- Simple REST API with CORS support
- Lightweight and container-ready
- Error handling and logging

## Requirements
- Node.js 14+
- Kubernetes cluster with Prometheus installed
- `prometheus-prometheus-stack-kube-prom-prometheus` service in `monitoring` namespace

## Installation
1. Clone the repository:
```bash
git clone https://github.com/Jozefwl/prometheus-metrics-api.git
cd prometheus-metrics-api
```

2. Install dependencies:
```bash
npm install express axios
```

## Configuration
The server requires Prometheus to be accessible at:
`http://prometheus-prometheus-stack-kube-prom-prometheus.monitoring.svc.cluster.local:9090`

This is configured in `server.js`:
```javascript
const prometheusUrl = 'http://prometheus-prometheus-stack-kube-prom-prometheus.monitoring.svc.cluster.local:9090';
```

## Running the Server
```bash
node server.js
```

The server will run on port 5000 by default.

## API Endpoints

### `GET /`
- Returns welcome message
- Response: `Welcome to the metrics API! Visit /metrics for CPU/MEMORY usage.`

### `GET /metrics`
- Returns CPU and memory utilization metrics
- Example response:
```json
{
  "cpu": [
    {
      "metric": {"instance": "node1:9100"},
      "value": [1625097600, "25.5"]
    }
  ],
  "memory": [
    {
      "metric": {"instance": "node1:9100"},
      "value": [1625097600, "42.3"]
    }
  ]
}
```

## Deployment in Kubernetes
1. Build Docker image:
```Dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```
2. Build and push to registry
```bash
docker build -t yourdockerhubusername/metrics-api:latest .
docker push yourdockerhubusername/metrics-api:latest
```

3. Deploy to Kubernetes:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metrics-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: metrics-api
  template:
    metadata:
      labels:
        app: metrics-api
    spec:
      containers:
      - name: metrics-api
        image: your-registry/metrics-api:latest
        ports:
        - containerPort: 5000
---
apiVersion: v1
kind: Service
metadata:
  name: metrics-api
spec:
  selector:
    app: metrics-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
```

4. Expose prometheus service to apps namespace
```yaml
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: apps
spec:
  type: ExternalName
  externalName: prometheus-prometheus-stack-kube-prom-prometheus.monitoring.svc.cluster.local
  ports:
  - port: 9090
```
## Usage with Frontend
The API is designed to work with the React frontend component included in the repository. The frontend displays CPU and memory usage in real-time.

```jsx
// Example React component using the API
import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

function MetricsDashboard() {
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await fetch('/metrics');
      const data = await response.json();
      // Process metrics data here
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    
      
      
    
  );
}
```

## Troubleshooting
- **Connection issues**: Verify Prometheus service name and namespace
- **Empty responses**: Check Prometheus metrics availability
- **CORS errors**: Ensure frontend and API share the same origin or configure CORS properly
