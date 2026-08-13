import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // New uploads are served from the Cloudflare R2 public domain, but records
    // created before the migration still point at Cloudinary. Keep the broad
    // allow-list until those are migrated, then narrow it to the R2 host.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
