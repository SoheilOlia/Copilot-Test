import type { NextConfig } from "next";

let basePath = "/sites/g2";

if (process.env.NODE_ENV === "development") {
  basePath = "";
}

const nextConfig: NextConfig = {
  basePath: basePath,
  images: {
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  experimental: {
    viewTransition: true,
  },
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
