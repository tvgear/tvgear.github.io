const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["."],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,

  // 👇 Cần cho GitHub Pages (xuất static HTML)
  output: "export",

  // 👇 Bắt buộc khi export, nếu không next/image sẽ lỗi
  images: {
    unoptimized: true,
  },

  // 👇 Nếu deploy ở dạng username.github.io/repo-name
  // thì đổi "" thành "/repo-name"
  basePath: "",
};

module.exports = withBundleAnalyzer(nextConfig);
