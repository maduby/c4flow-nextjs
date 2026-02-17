import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "C-4 Flow | Pole & Exotic Dance Studio",
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
  ],
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
    <html lang="en" className={`${montserrat.variable} ${mynerve.variable}`}>
      <head>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "DanceSchool",
            name: settings?.siteName || "C-4 Flow",
            description:
              "Pole & Exotic Dance Studio in Woodstock, Cape Town. Group and private classes for all levels.",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://c4flow.co.za",
            telephone: settings?.phone || "+27 65 391 7901",
            email: settings?.contactEmail || "info@c4flow.co.za",
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
            sameAs: [
              settings?.instagramUrl,
              settings?.instructorInstagramUrl,
            ].filter(Boolean),
            ...(logoUrl && {
              image: logoUrl,
            }),
          }}
        />
      </head>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {announcement?.enabled && announcement?.text && (
          <AnnouncementBar
            text={announcement.text}
            link={announcement.link}
            version={announcement._updatedAt}
          />
        )}
        <Header
          siteName={settings?.siteName || "C-4 Flow"}
          logoUrl={logoUrl}
        />
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
