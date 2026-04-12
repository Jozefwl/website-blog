
# Prometheus Metrics Proxy API

Simple Node.js/Express proxy fetches CPU \& memory metrics from Prometheus. CORS-enabled for browser use.

## Features

- Fetch CPU usage (%): `100 - avg_idle_rate`
- Fetch memory usage (%): `100 * (1 - MemAvailable/MemTotal)`
- Logs client IP + User-Agent on `/metrics`
- CORS `*` for frontend apps
- Health check at `/`


## Quick Start

```bash
npm init -y
npm i express axios
node server.js
```

Set env:

```bash
export PROMETHEUS_URL=http://your-prometheus:9090
node server.js
```


## API Endpoints

| Path | Method | Response |
| :-- | :-- | :-- |
| `/` | GET | `{"message": "Metrics server is running. Metrics API: Use /metrics endpoint"}` |
| `/metrics` | GET | `{"cpu": [...Prometheus results...], "memory": [...Prometheus results...]}` |

## Prometheus Queries

**CPU (% busy):**

```
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m]))) * 100
```

**Memory (% used):**

```
100 * (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))
```


## Environment

| Var | Required | Default | Description |
| :-- | :-- | :-- | :-- |
| `PROMETHEUS_URL` | ✅ | - | Prometheus API endpoint (ex: `http://prom:9090`) |

## Docker

```dockerfile
FROM --platform=linux/amd64 node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server.js .
EXPOSE 5000
ENV PROMETHEUS_URL=http://prometheus:9090
CMD ["node", "server.js"]
```


## Kubernetes Deployment Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: metrics-api
spec:
  replicas: 2
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
        image: harbor.waldoserver.top/cloud/metrics-api:1.0.2.2
        env:
        - name: PROMETHEUS_URL
          value: "http://prometheus.monitoring:9090"
        ports:
        - containerPort: 5000
        resources:
          requests:
            cpu: 64m
            memory: 64Mi
