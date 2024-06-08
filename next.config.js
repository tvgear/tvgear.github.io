const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ["."],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: "",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
});

module.exports = () => {
  return {
    output: "export",
  };
};
