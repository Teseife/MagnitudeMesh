import type { NextConfig } from "next";

// HTTP security headers applied to every route
const securityHeaders = [
  // Prevent the page from being embedded in an iframe on other origins (clickjacking)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Block browsers from MIME-sniffing the content type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Control how much referrer information is included in requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restrict access to browser features not needed by this app
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Force HTTPS for 2 years, including subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Empty config to acknowledge Turbopack usage
  },

  // Environment variables for Cesium
  env: {
    CESIUM_BASE_URL: "/cesium",
  },

  // Webpack fallback for non-Turbopack builds
  webpack: (config, { isServer }) => {
    // Define CESIUM_BASE_URL for webpack builds
    const webpack = require("webpack");
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
      })
    );

    // Handle Cesium workers and assets
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        url: false,
      };
    }

    return config;
  },

  // Transpile Cesium and Resium packages
  transpilePackages: ["cesium", "resium"],
};

export default nextConfig;
