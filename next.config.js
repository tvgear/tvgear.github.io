const withBundleAnalyzer =
  process.env.ANALYZE === "true"
    ? require("@next/bundle-analyzer")({ enabled: true })
    : (config) => config;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,

  // 👇 Bắt buộc cho GitHub Pages
  output: "export",

  // 👇 Tắt Image Optimization API
  images: {
    unoptimized: true,
  },

  // 👇 Nếu repo là username.github.io/my-repo thì đổi thành "/my-repo"
  basePath: "",
};

module.exports = withBundleAnalyzer(nextConfig);
