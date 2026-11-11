import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the same URLs as the static site: /about/, /solutions/flight-booking-software/
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // English keeps its bare URLs: every path that isn't already /ar/ is served from the /en/ tree.
  async redirects() {
    // The travel catalogue was replaced by business automation (Nov 2026). Old addresses
    // point to their closest new page, in both languages, so links and bookmarks keep working.
    const moved: [string, string][] = [
      ["/solutions/white-label-travel-booking-software", "/solutions/"],
      ["/solutions/flight-booking-software", "/solutions/"],
      ["/solutions/hotel-booking-software", "/solutions/"],
      ["/solutions/holiday-package-booking-software", "/solutions/"],
      ["/solutions/bus-car-booking-software", "/solutions/"],
      ["/solutions/b2c-travel-portal", "/solutions/sales-automation/"],
      ["/solutions/b2b-travel-portal", "/solutions/sales-automation/"],
      ["/solutions/b2b2b-travel-portal", "/solutions/sales-automation/"],
      ["/solutions/corporate-travel-software", "/business-software/expense-management-software/"],
      ["/solutions/travel-agency-software", "/solutions/business-process-automation/"],
      ["/solutions/tour-operator-software", "/solutions/business-process-automation/"],
      ["/solutions/travel-management-software", "/business-software/erp-software/"],
      ["/solutions/travel-extranet-software", "/solutions/"],
      ["/solutions/travel-crm-software", "/business-software/crm-software/"],
      ["/custom-development/custom-travel-website-development", "/custom-development/custom-software-development/"],
      ["/custom-development/booking-engine-development", "/custom-development/custom-software-development/"],
      ["/custom-development/travel-mobile-app-development", "/custom-development/mobile-app-development/"],
      ["/custom-development/custom-travel-portal-development", "/custom-development/custom-software-development/"],
      ["/api-integrations/flight-gds-api", "/api-integrations/"],
      ["/api-integrations/hotel-api", "/api-integrations/"],
      ["/api-integrations/car-rental-api", "/api-integrations/"],
      ["/api-integrations/bus-api", "/api-integrations/"],
      ["/api-integrations/transfers-activities-api", "/api-integrations/"],
      ["/api-integrations/travel-insurance-api", "/api-integrations/"],
      ["/api-integrations/recharge-utility-api", "/api-integrations/payment-gateway-integration/"],
      ["/blog/white-label-vs-custom-travel-software", "/blog/ready-made-vs-custom-software/"],
      ["/blog/gds-ndc-airline-apis-explained", "/blog/"],
      ["/blog/launching-a-b2b-agent-portal", "/blog/"],
      ["/blog/why-hotel-mapping-decides-conversion", "/blog/"],
      ["/blog/payments-for-travel-platforms", "/blog/"],
      ["/blog/corporate-travel-policy-people-follow", "/blog/"],
    ];
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      ...moved.flatMap(([from, to]) => [
        { source: from, destination: to, permanent: true },
        { source: `/ar${from}`, destination: `/ar${to}`, permanent: true },
      ]),
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
