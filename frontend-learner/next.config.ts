import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/certifications",
        destination: "/#career-pathways",
        permanent: false,
      },
      {
        source: "/career-pathways",
        destination: "/#career-pathways",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
