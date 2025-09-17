import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove standalone output for better compatibility
  serverExternalPackages: ['@prisma/client']
};

export default nextConfig;
