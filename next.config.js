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
  compiler: {
    styledComponents: true,
  },

  // 👇 Bắt buộc cho GitHub Pages (xuất static HTML)
  output: "export",

  // 👇 Tắt Image Optimization API (nếu không next/image sẽ crash)
  images: {
    unoptimized: true,
  },

  // 👇 Nếu repo là username.github.io/my-repo thì đổi thành "/my-repo"
  basePath: "",
};

module.exports = withBundleAnalyzer(nextConfig);
