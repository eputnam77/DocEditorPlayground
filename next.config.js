import withBundleAnalyzer from "@next/bundle-analyzer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const withAnalyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyze({
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@tiptap/extension-table": path.resolve(
        __dirname,
        "stubs/tiptap-extension-table.ts",
      ),
      "@tiptap/extension-table-row": path.resolve(
        __dirname,
        "stubs/tiptap-extension-table-row.ts",
      ),
      "@tiptap/extension-table-cell": path.resolve(
        __dirname,
        "stubs/tiptap-extension-table-cell.ts",
      ),
      "@tiptap/extension-table-header": path.resolve(
        __dirname,
        "stubs/tiptap-extension-table-header.ts",
      ),
      "@editorjs/editorjs": path.resolve(__dirname, "stubs/editorjs.ts"),
      "@editorjs/header": path.resolve(__dirname, "stubs/editorjs-header.ts"),
      "@editorjs/list": path.resolve(__dirname, "stubs/editorjs-list.ts"),
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
