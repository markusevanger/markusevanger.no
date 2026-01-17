import { client } from "@/lib/sanity";
import { siteSettingsQuery } from "@/lib/queries";
import Footer from "./Footer";
import type { Locale } from "@/i18n/config";

interface FooterWrapperProps {
  locale: Locale;
}

export default async function FooterWrapper({ locale }: FooterWrapperProps) {
  const siteSettings = await client.fetch(siteSettingsQuery);

  if (!siteSettings) {
    return null;
  }

  return <Footer siteSettings={siteSettings} locale={locale} />;
}
