import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Room for a Shop photo on the approve form (the default is 1 MB). Vercel refuses requests over 4.5 MB anyway.
    serverActions: { bodySizeLimit: "4mb" },
  },
  logging: {
    serverFunctions: false, // dev would print each Server Action's arguments, the Visitor's location included (ADR-0002)
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
