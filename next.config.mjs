/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep development assets isolated from `next build`. Running a production
  // build while the dev server is open must not replace its CSS or manifests.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/aboutus.html', destination: '/about', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/procustsmain.html', destination: '/solutions', permanent: true },
      { source: '/support.html', destination: '/careers', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      // Added all old product pages to protect SEO
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
