# Website-Blog

[![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![GitHub issues](https://img.shields.io/github/issues/Jozefwl/website-blog?style=for-the-badge)](https://github.com/Jozefwl/website-blog/issues)

## Short description
Personal website built with a Next.js frontend and an Express backend for metrics.

## env variables
`NEXT_PUBLIC_PROMETHEUS_URL`  
`PROMETHEUS_URL`  
`NODE_LABELS_JSON`

## Build and push
Frontend (linux x86_64):
```bash
docker buildx build --platform linux/amd64 -t harbor.waldoserver.top/cloud/website-blog:latest --push .
```

Backend (linux x86_64):
```bash
docker buildx build --platform linux/amd64 -f server/Dockerfile -t harbor.waldoserver.top/cloud/metrics-api:latest --push server
```

## (C) Jozef Waldhauser
Deployed at https://waldhauser.sk

Feel free to use any pictures or content WHICH I OWN (excludes widgets)
