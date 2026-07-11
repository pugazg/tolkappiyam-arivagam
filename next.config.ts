import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The dynamic /search route (and any server-rendered route) reads the
  // generated JSON at runtime; make sure it is bundled into the serverless
  // function on Vercel. Static pages already bake the data in at build time.
  outputFileTracingIncludes: {
    "/search": ["./data/generated/**"],
    "/sitemap.xml": ["./data/generated/**"],
  },
};

export default nextConfig;
