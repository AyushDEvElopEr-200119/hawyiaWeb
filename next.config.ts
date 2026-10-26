import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the same URLs as the static site: /about/, /solutions/flight-booking-software/
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // photos and videos keep their names when replaced, so cache for a month rather than forever
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
