import type { Metadata } from "next";
import { Montserrat, Mynerve } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${mynerve.variable}`}>
      <body className="font-body antialiased">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
