import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

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
