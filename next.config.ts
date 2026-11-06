import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the same URLs as the static site: /about/, /solutions/flight-booking-software/
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // English keeps its bare URLs: every path that isn't already /ar/ is served from the /en/ tree.
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en/" },
        { source: "/:path((?!ar(?:/|$)|en(?:/|$)|api(?:/|$)|_next(?:/|$)|assets(?:/|$)|apple-icon(?:/|$)|.*\\.[a-z0-9]+$).+)", destination: "/en/:path" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
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
