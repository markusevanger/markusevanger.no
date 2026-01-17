import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import FooterWrapper from "@/components/FooterWrapper";
import "./globals.css";

const siteUrl = "https://markusevanger.no";

export const metadata: Metadata = {
  title: "Markus Evanger",
  description: "Portfolio and CV of Markus Evanger - Developer and Designer",
  manifest: "/favicons/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Markus Evanger",
    description: "Portfolio and CV of Markus Evanger - Developer and Designer",
    url: siteUrl,
    siteName: "Markus Evanger",
    locale: "no_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Markus Evanger",
    description: "Portfolio and CV of Markus Evanger - Developer and Designer",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Markus Evanger",
  url: siteUrl,
  jobTitle: "Developer and Designer",
  sameAs: ["https://github.com/markusevanger"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="07888119-c291-420b-8d49-11b7d9117b27"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          {children}
          <FooterWrapper />
        </LanguageProvider>
      </body>
    </html>
  );
}
