import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits .next/standalone — a self-contained server.js bundled with only the
  // node_modules it actually imports. The Dockerfile's runner stage copies
  // that instead of the full dependency tree.
  output: "standalone",

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
