import type { NextConfig } from "next";

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? ''
const r2Hostname = R2_PUBLIC_URL ? new URL(R2_PUBLIC_URL).hostname : ''

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2Hostname ? [{
        protocol: 'https' as const,
        hostname: r2Hostname,
        port: '',
        pathname: '/**',
      }] : []),
      // fallback para desenvolvimento local / domínios *.r2.dev
      {
        protocol: 'https' as const,
        hostname: '**.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'brasilfuso.com.br',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
