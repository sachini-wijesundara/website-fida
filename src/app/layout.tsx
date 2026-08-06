import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";


const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FIDA Global | Your Business Partner for Sustainable Growth",
  description: "FIDA Global provides world-class innovations in Smart HRIS, ICT solutions, IoT energy management, and business consultancy aimed at sustainable growth.",
  keywords: ["Smart HRIS", "S-HRM", "IoT Energy Management", "EV Charging Solutions", "Business Process Outsourcing", "BPO", "Digital Transformation", "Human Capital Management", "HCM", "ERP Integration", "Sustainable Growth", "FIDA Global", "Sri Lanka IT Consultancy"],
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
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans grain">
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
