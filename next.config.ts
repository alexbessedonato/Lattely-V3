import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // A 4 MB photo (MAX_PHOTO_BYTES) plus the rest of the form; the default is 1 MB. Vercel refuses requests over 4.5 MB anyway.
    serverActions: { bodySizeLimit: "4.1mb" },
  },
  logging: {
    serverFunctions: false, // dev would print each Server Action's arguments, the Visitor's location included (ADR-0002)
  },
  images: {
    // <Image> may load Shop photos from this branch's bucket only (AWS_ENDPOINT_URL_S3), not any address.
    remotePatterns: process.env.AWS_ENDPOINT_URL_S3
      ? [new URL(`${process.env.AWS_ENDPOINT_URL_S3}/shop-photos/**`)]
      : [],
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
