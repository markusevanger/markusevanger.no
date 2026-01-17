import LanguageToggle from "./LanguageToggle";
import { HeartSvg } from "./assets/HeartSvg";
import CopyEmail from "./CopyEmail";
import ScrollToTopButton from "./ScrollToTopButton";
import FooterLanguageText from "./FooterLanguageText";
import type { SiteSettingsQueryResult } from "@/lib/sanity.types";

export interface FooterProps {
  siteSettings: NonNullable<SiteSettingsQueryResult>;
}

export default function Footer({ siteSettings }: FooterProps) {
  return (
    <footer className="bg-markus-red mt-24 pt-12 pb-4 text-white">
      <div className="container mx-auto px-8 md:px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-sm">
          <div className="flex flex-col items-center md:items-start gap-2">
            <CopyEmail
              email={siteSettings.email || ""}
              contactText_en={siteSettings.contactText_en || ""}
              contactText_no={siteSettings.contactText_no || ""}
            />
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ScrollToTopButton />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <HeartSvg className="fill-white" />
            <p className="text-xs font-mono">
              <FooterLanguageText
                text_en={siteSettings.madeByText_en}
                text_no={siteSettings.madeByText_no}
              />
            </p>
          </div>
        </div>
      </div>

      {/* Infinite scrolling banner */}
      <div className="mt-12 overflow-hidden select-none">
        <div className="flex animate-scroll">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="text-white/20 text-2xl font-mogi mx-4 shrink-0"
            >
              markusevanger.no
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
