import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the same URLs as the static site: /about/, /solutions/flight-booking-software/
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
