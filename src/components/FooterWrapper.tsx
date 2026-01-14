import { client } from "@/lib/sanity";
import { siteSettingsQuery } from "@/lib/queries";
import Footer from "./Footer";

export default async function FooterWrapper() {
  const siteSettings = await client.fetch(siteSettingsQuery);

  if (!siteSettings) {
    return null;
  }

  return <Footer siteSettings={siteSettings} />;
}
