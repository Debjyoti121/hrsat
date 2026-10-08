import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  serverExternalPackages: ["@libsql/client", "libsql"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "www.hrsat.org", pathname: "/wp-content/uploads/**" }],
  },
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  // Keep old WordPress URLs working after the migration
  async redirects() {
    return [
      { source: "/report-violation", destination: "/report", permanent: true },
      { source: "/report-a-violation", destination: "/report", permanent: true },
      { source: "/about-me", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/security-and-privacy", destination: "/security", permanent: true },
    ];
  },
};

export default nextConfig;
