/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep development assets isolated from `next build`.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',

  // ── Performance ──────────────────────────────────────
  compress: true,
  poweredByHeader: false,

  // ── Image optimisation ───────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },

  // ── HTTP caching headers ─────────────────────────────
  async headers() {
    return [
      {
        // Long-lived cache for Next.js static assets (hashed filenames)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // 1-day cache for public images / SVGs / fonts
        source: '/:path*.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
      {
        // Serve-worker compatible cache for API images
        source: '/api/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/aboutus.html', destination: '/about', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/procustsmain.html', destination: '/solutions', permanent: true },
      { source: '/support.html', destination: '/careers', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/pos_sof_mobile.html', destination: '/solutions', permanent: true },
      { source: '/pro_infa_data.html', destination: '/solutions', permanent: true },
      { source: '/Products1.html', destination: '/solutions', permanent: true },
      { source: '/Products2.html', destination: '/solutions', permanent: true },
      { source: '/ev_charge.html', destination: '/solutions', permanent: true },
      { source: '/energy_meter.html', destination: '/solutions', permanent: true },
      { source: '/surge_pro.html', destination: '/solutions', permanent: true },
    ];
  },
};

export default nextConfig;
