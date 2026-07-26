import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/brand/category images come from Cloudinary and other remote hosts.
    // Broad allow-list keeps next/image working with arbitrary backend URLs;
    // tighten these patterns to your known hosts before production.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
