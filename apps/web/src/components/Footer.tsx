import LanguageToggle from "./LanguageToggle";
import { Logo } from "./assets/Logo";
import CopyEmail from "./CopyEmail";
import ScrollToTopButton from "./ScrollToTopButton";
import FooterLanguageText from "./FooterLanguageText";
import SocialLinks from "./SocialLinks";
import TopographicField from "./TopographicField";
import type { SiteSettingsQueryResult } from "@/lib/sanity.types";
import type { Locale } from "@/i18n/config";

// A unit circle as four cubic béziers (kappa ≈ 0.5523) — TopographicField's
// path parser approximates SVG arcs as lines, so a circle must be cubics.
const CIRCLE_D =
  "M100 50C100 77.614 77.614 100 50 100C22.386 100 0 77.614 0 50C0 22.386 22.386 0 50 0C77.614 0 100 22.386 100 50Z";

export interface FooterProps {
  siteSettings: NonNullable<SiteSettingsQueryResult>;
  locale: Locale;
}

// Grayscale film grain (data-URI). Contrast-boosted around a 0.5 pivot so that,
// under mix-blend-overlay, it textures markus-red without a net colour shift.
// The dome + grain mask shapes live in globals.css (.footer-dome / -grain-mask).
const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncR type='linear' slope='2.4' intercept='-0.7'/><feFuncG type='linear' slope='2.4' intercept='-0.7'/><feFuncB type='linear' slope='2.4' intercept='-0.7'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`

export default function Footer({ siteSettings, locale }: FooterProps) {
  return (
    <footer className="relative isolate mt-24 flex min-h-[560px] flex-col justify-end overflow-hidden pt-24 pb-6 text-white md:pt-40">
      {/* Red dome + grain, behind the content (negative z). The dome extends
          past the side edges so the blur doesn't fade in at the borders. */}
      <div
        aria-hidden
        className="footer-dome pointer-events-none absolute -z-20"
        style={{ inset: '0 -40px 0', filter: 'blur(16px)' }}
      />
      <div
        aria-hidden
        className="footer-grain-mask pointer-events-none absolute inset-0 -z-10 opacity-70 mix-blend-overlay"
        style={{
          backgroundImage: GRAIN_URL,
          backgroundSize: '160px 160px',
        }}
      />
      <div className="container mx-auto px-4 md:px-2">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
          {/* Left — contact + social/language/scroll controls */}
          <div className="order-2 flex flex-col items-center gap-3 md:order-none md:flex-1 md:items-start">
            <CopyEmail email={siteSettings.email || ""} />
            <div className="flex items-center gap-2">
              <SocialLinks
                githubUrl={siteSettings.githubUrl}
                linkedinUrl={siteSettings.linkedinUrl}
              />
              <LanguageToggle locale={locale} />
              <ScrollToTopButton locale={locale} />
            </div>
          </div>

          {/* Center — topographic circle. Two copies: the desktop one is
              interactive; the mobile one stays static so its touch-none doesn't
              block scrolling. */}
          <div className="order-1 w-40 shrink-0 md:order-none md:w-56 md:-translate-y-1/2">
            <TopographicField
              path={CIRCLE_D}
              interactive
              radiusScale={0.46}
              height="224px"
              primaryColor="#ffffff"
              secondaryColor="rgba(255,255,255,0.85)"
              className="hidden md:block"
            />
            <TopographicField
              path={CIRCLE_D}
              interactive={false}
              mirror={false}
              radiusScale={0.46}
              height="160px"
              primaryColor="#ffffff"
              secondaryColor="rgba(255,255,255,0.85)"
              className="md:hidden"
            />
          </div>

          {/* Right corner — identity */}
          <div className="order-3 flex flex-col items-center gap-2 md:order-none md:flex-1 md:items-end">
            <Logo className="fill-white" />
            <p className="text-xs font-mono opacity-80">
              <FooterLanguageText
                text_en={siteSettings.madeByText_en}
                text_no={siteSettings.madeByText_no}
                locale={locale}
              />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
