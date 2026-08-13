import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permit the machine's LAN host to load Next.js development resources
  // (including HMR) while running `next dev`.
  allowedDevOrigins: ["172.20.3.254"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Allow the application to work from both local and network URLs
  // This is required for NextAuth.js to work correctly
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "127.0.0.1:3000"],
    },
  },
};

export default nextConfig;
