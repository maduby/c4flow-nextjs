import type { Metadata, Viewport } from "next";
import { Montserrat, Mynerve } from "next/font/google";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { sanityFetch } from "@/sanity/lib/live";
import {
  SITE_SETTINGS_QUERY,
  ANNOUNCEMENT_BAR_QUERY,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import { JsonLd } from "@/components/shared/JsonLd";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const mynerve = Mynerve({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-mynerve",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2d1f3d" },
    { media: "(prefers-color-scheme: dark)", color: "#1F1346" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "C4 Flow | Pole & Exotic Dance Studio in Cape Town",
    template: "%s | C4 Flow",
  },
  description:
    "C4 Flow Studio offers pole dancing classes Cape Town loves — group and private classes for all levels and abilities are available at our inclusive studio space in Woodstock.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  keywords: [
    "pole dancing classes Cape Town",
    "pole and exotic dance classes",
    "exotic dance studio Cape Town",
    "pole fitness Cape Town",
    "dance classes Woodstock",
    "private pole dance lessons Cape Town",
    "pole dancing beginners Cape Town",
    "Woodstock Exchange dance studio",
  ],
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "C4 Flow",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ data: settings }, { data: announcement }] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: ANNOUNCEMENT_BAR_QUERY }),
  ]);

  const logoUrl = settings?.logo?.asset
    ? urlFor(settings.logo).width(96).height(100).url()
    : null;

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${mynerve.variable} scroll-smooth`}
      style={
        {
          "--header-h": "65px",
          "--banner-h": announcement?.enabled && announcement?.text ? "36px" : "0px",
        } as React.CSSProperties
      }
    >
      <head>
        {/* Blocking script: hide dismissed banner before first paint to prevent CLS */}
        {announcement?.enabled && announcement?.text && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var v=localStorage.getItem("c4flow-banner-dismissed");if(v===${JSON.stringify(announcement._updatedAt)}){document.documentElement.classList.add("banner-dismissed");document.documentElement.style.setProperty("--banner-h","0px")}}catch(e){}})()`,
            }}
          />
        )}
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "DanceSchool",
            name: settings?.siteName || "C-4 Flow",
            description:
              "Pole & Exotic Dance Studio in Woodstock, Cape Town. Group and private classes for all levels.",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://c4flow.co.za",
            telephone: settings?.phone || "+27 65 391 7901",
            email: settings?.contactEmail || "marc@duby.io",
            address: {
              "@type": "PostalAddress",
              streetAddress: settings?.address?.street || "66 Albert Road",
              addressLocality: settings?.address?.city || "Cape Town",
              addressRegion:
                settings?.address?.province || "Western Cape",
              postalCode: settings?.address?.postalCode || "8001",
              addressCountry: "ZA",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: -33.926702,
              longitude: 18.4434095,
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "21:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "09:00",
                closes: "14:00",
              },
            ],
            priceRange: "R150 - R600",
            currenciesAccepted: "ZAR",
            paymentAccepted: "Cash, Credit Card, EFT",
            sameAs: [
              settings?.instagramUrl,
              settings?.instructorInstagramUrl,
            ].filter(Boolean),
            ...(logoUrl && {
              image: logoUrl,
              logo: logoUrl,
            }),
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Dance Classes",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Group Pole Dance Classes",
                    description: "Group pole dance classes for all levels",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Private Pole Dance Lessons",
                    description: "One-on-one pole dance instruction",
                  },
                },
              ],
            },
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ScrollToTop />
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <Header
          siteName={settings?.siteName || "C-4 Flow"}
          logoUrl={logoUrl}
        />
        {announcement?.enabled && announcement?.text && (
          <AnnouncementBar
            text={announcement.text}
            link={announcement.link}
            version={announcement._updatedAt}
          />
        )}
        {children}
        <Footer
          siteName={settings?.siteName || "C-4 Flow"}
          logoUrl={logoUrl}
          email={settings?.contactEmail}
          phone={settings?.phone}
          instagramUrl={settings?.instagramUrl}
          address={settings?.address}
          mapsUrl={settings?.mapsUrl}
          bookingUrl={settings?.bookingUrl}
        />
        {settings?.whatsappNumber && (
          <WhatsAppButton
            phoneNumber={settings.whatsappNumber}
            message={settings.whatsappMessage || undefined}
          />
        )}
        <SanityLive />
        <GoogleAnalytics />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  );
}
