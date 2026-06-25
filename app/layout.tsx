import type React from "react"
import type { Metadata } from "next"
import { Public_Sans, Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { Toaster } from "sonner"
import "./globals.css"

// Public Sans for body text
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: 'swap',
})

// Plus Jakarta Sans for headings
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Falkon Care - Professional Water Tank Cleaning Service in Delhi NCR | Noida, Gurgaon, Faridabad",
  description: "Falkon Care provides expert water tank cleaning services in Delhi, Noida, Gurgaon, Faridabad & Ghaziabad. Professional residential & commercial tank cleaning. Book now for same-day service! ✓ Certified Technicians ✓ Safe & Hygienic ✓ Affordable Rates",
  keywords: "Falkon Care, water tank cleaning Delhi, water tank cleaning NCR, water tank cleaning near me, water tank cleaning service, tank cleaning Noida, tank cleaning Gurgaon, water tank sanitization",
  authors: [{ name: "Falkon Care" }],
  creator: "Falkon Care",
  publisher: "Falkon Futurex Private Limited",
  generator: "v0.app",
  metadataBase: new URL('https://falkoncare.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Falkon Care - Best Water Tank Cleaning Service in Delhi NCR",
    description: "Professional water tank cleaning services across Delhi, Noida, Gurgaon, Faridabad & Ghaziabad. Book Falkon Care today!",
    url: 'https://falkoncare.com',
    siteName: 'Falkon Care',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Falkon Care - Water Tank Cleaning Delhi NCR",
    description: "Professional water tank cleaning services in Delhi, Noida, Gurgaon, Faridabad & Ghaziabad",
  },
  verification: {
    google: "n-XZA7UKEKi7cmgZ7LoA6uh0cEbO2h4dCtBdvNXyTxw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      },
    ],
    apple: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Falkon Care",
              "legalName": "Falkon Futurex Private Limited",
              "image": "https://falkoncare.com/water-tank-cleaning-service.jpg",
              "description": "Professional water tank cleaning and maintenance services in Delhi NCR",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "South West Delhi",
                "addressLocality": "New Delhi",
                "addressRegion": "Delhi",
                "postalCode": "110001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "28.6139",
                "longitude": "77.2090"
              },
              "url": "https://falkoncare.com",
              "telephone": "+917011365481",
              "priceRange": "₹₹",
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "08:00",
                "closes": "20:00"
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Delhi"
                },
                {
                  "@type": "City",
                  "name": "Noida"
                },
                {
                  "@type": "City",
                  "name": "Gurgaon"
                },
                {
                  "@type": "City",
                  "name": "Faridabad"
                },
                {
                  "@type": "City",
                  "name": "Ghaziabad"
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "500"
              },
              "sameAs": [
                "https://www.facebook.com/falkoncare",
                "https://www.instagram.com/falkoncare",
                "https://www.linkedin.com/company/falkoncare"
              ]
            })
          }}
        />
      </head>
      <body className={`${publicSans.variable} ${plusJakartaSans.variable} font-sans antialiased`}>
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            {children}
            <Toaster />
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
        <Analytics />
      </body>
    </html>
  );
}
