import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyze = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

export default withAnalyze({
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/templates/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
});
