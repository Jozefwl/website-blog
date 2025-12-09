/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: process.cwd(),
  allowedDevOrigins: ['192.168.200.99', 'localhost', '127.0.0.1']
};

export default nextConfig;
