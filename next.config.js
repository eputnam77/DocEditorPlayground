import withBundleAnalyzer from "@next/bundle-analyzer";
import path from "path";

const withAnalyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyze({
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      yjs: path.resolve(__dirname, "stubs/yjs.ts"),
      "y-webrtc": path.resolve(__dirname, "stubs/y-webrtc.ts"),
      "y-protocols/awareness": path.resolve(
        __dirname,
        "stubs/y-protocols-awareness.ts",
      ),
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/templates/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/validation/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
});
