import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FooterWrapper from "@/components/FooterWrapper";
import Header from "@/components/Header";
import {
  locales,
  isValidLocale,
  siteMetadata,
  ogLocales,
  type Locale,
} from "@/i18n/config";
import "../globals.css";

const siteUrl = "https://markusevanger.no";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata with locale-aware content
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const meta = siteMetadata[locale];

  return {
    title: meta.title,
    description: meta.description,
    manifest: "/favicons/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicons/favicon.ico", sizes: "any" },
        {
          url: "/favicons/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicons/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
      ],
      apple: "/favicons/apple-touch-icon.png",
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: locale === "no" ? siteUrl : `${siteUrl}/${locale}`,
      languages: {
        no: siteUrl,
        en: `${siteUrl}/en`,
        "x-default": siteUrl,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: locale === "no" ? siteUrl : `${siteUrl}/${locale}`,
      siteName: "Markus Evanger",
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocales[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }

  const meta = siteMetadata[locale as Locale];
  const localePrefix = locale === "no" ? "" : `${locale}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: "Markus Evanger",
        url: siteUrl,
        jobTitle: "Developer and Designer",
        sameAs: ["https://github.com/markusevanger"],
      },
      {
        "@type": "WebSite",
        url: siteUrl,
        name: "Markus Evanger",
        description: meta.description,
        inLanguage: locale,
      },
      {
        "@type": "SiteNavigationElement",
        name: "CV",
        url: `${siteUrl}/${localePrefix}cv`,
      },
    ],
  };

  return (
    <html lang={locale}>
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="07888119-c291-420b-8d49-11b7d9117b27"
        />
        {/* Hreflang tags for SEO */}
        <link rel="alternate" hrefLang="no" href={siteUrl} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en`} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header locale={locale as Locale} />
        <main id="main-content">
          {children}
        </main>
        <FooterWrapper locale={locale as Locale} />
      </body>
    </html>
  );
}
