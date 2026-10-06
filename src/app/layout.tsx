import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";


const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FIDA Global | HRIS & Business Software Solutions Sri Lanka",
  description: "FIDA Global delivers cloud HRIS, business consultancy, and enterprise software for companies across Sri Lanka and beyond. 14+ years of proven innovation.",
  keywords: "HRIS Sri Lanka, HR software, business software solutions, IT solutions Sri Lanka, digital transformation, payroll software, human resource management, BPO, IoT, FIDA Global, Best IT solution provider",
  authors: [{ name: "FIDA Global" }],
  openGraph: {
    title: "FIDA Global | Intelligent Business Solutions for Sustainable Growth",
    description: "Empowering businesses through Smart HRIS, digital transformation, and sustainable ICT solutions. Partner with FIDA Global for innovative growth.",
    url: "https://www.fidaglobal.com",
    siteName: "FIDA Global",
    images: [
      {
        url: "https://www.fidaglobal.com/og-image.png", // Ensure this exists or suggest creating it
        width: 1200,
        height: 630,
        alt: "FIDA Global - Intelligent Business Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FIDA Global | Smart HRIS & Digital Transformation",
    description: "Innovative ICT solutions and business consultancy for sustainable growth.",
    images: ["https://www.fidaglobal.com/twitter-image.png"], // Ensure this exists or suggest creating it
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} h-full antialiased`} suppressHydrationWarning>
      {/* Resource hints for faster loading */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.fidaglobal.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          id="chunk-error-recovery"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var lastTargetHref = null;
                document.addEventListener('click', function(e) {
                  try {
                    var el = e.target;
                    while (el && el.tagName !== 'A') {
                      el = el.parentElement;
                    }
                    if (el && el.href && !el.target && el.origin === window.location.origin) {
                      lastTargetHref = el.href;
                    }
                  } catch (_) {}
                }, true);

                function isChunkError(err, msg) {
                  var text = (err && (err.name + ' ' + (err.message || '') + ' ' + (err.request || ''))) || msg || '';
                  return /ChunkLoadError|Loading chunk.*failed|failed to fetch dynamically imported module/i.test(text);
                }

                function recover(target) {
                  try {
                    var now = Date.now();
                    var key = '__fida_chunk_heal';
                    var last = parseInt(sessionStorage.getItem(key) || '0', 10);
                    if (now - last < 5000) return;
                    sessionStorage.setItem(key, String(now));

                    var destination = lastTargetHref;
                    if (!destination && target) {
                      var m = target.match(/chunks\\/app\\/\\(public\\)\\/([a-zA-Z0-9_-]+)/i);
                      if (m && m[1]) destination = window.location.origin + '/' + m[1];
                      var adm = target.match(/chunks\\/app\\/admin\\/([a-zA-Z0-9_-]+)/i);
                      if (adm && adm[1]) destination = window.location.origin + '/admin/' + adm[1];
                    }

                    if (destination && destination !== window.location.href) {
                      window.location.assign(destination);
                    } else {
                      window.location.reload();
                    }
                  } catch (_) {}
                }

                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e && e.reason;
                  if (isChunkError(reason)) {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    recover(reason && (reason.request || reason.message || ''));
                  }
                }, true);

                window.addEventListener('error', function(e) {
                  if (isChunkError(e.error, e.message)) {
                    if (e.preventDefault) e.preventDefault();
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    recover((e.error && e.error.request) || e.filename || '');
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "FIDA Global",
              "url": "https://www.fidaglobal.com",
              "logo": "https://www.fidaglobal.com/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+94-11-710-80-20",
                "contactType": "customer service",
                "email": "info@fidaglobal.com",
                "areaServed": "LK",
                "availableLanguage": ["en"]
              },
              "sameAs": [
                "https://www.linkedin.com/company/fida-global"
                // Add more social links here if available
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "No. 215 C, Raththanapitiya",
                "addressLocality": "Boralesgamuwa",
                "postalCode": "10290",
                "addressCountry": "LK"
              }
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
