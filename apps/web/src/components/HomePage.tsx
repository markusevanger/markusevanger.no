import Image from "next/image";
import WindowAnimation from "./WindowAnimation";
import ProjectIndex from "./ProjectIndex";
import HomePageText from "./HomePageText";
import HeroButtons from "./HeroButtons";
import AppearInView from "./AppearInView";
import { t } from "@/lib/types";
import type {
  FrontpageQueryResult,
  SiteSettingsQueryResult,
} from "@/lib/types";
import type { Locale } from "@/i18n/config";

interface HomePageProps {
  frontpage: NonNullable<FrontpageQueryResult>;
  siteSettings: NonNullable<SiteSettingsQueryResult>;
  locale: Locale;
}

export default function HomePage({ frontpage, siteSettings, locale }: HomePageProps) {
  return (
    <>
      <div className="pb-10 container mx-auto pt-16 md:pt-24 px-8 md:px-4 w-full overflow-x-hidden flex items-center flex-col">
        <div className="flex flex-col gap-2 items-center w-full max-w-[610px]">
          <AppearInView>
            <WindowAnimation />
          </AppearInView>

          <AppearInView delay={100} className="flex flex-col items-center">
            <HomePageText
              frontpage={frontpage}
              locale={locale}
              birthDate={siteSettings.birthDate}
            />
          </AppearInView>

          {frontpage.heroButtons && frontpage.heroButtons.length > 0 && (
            <AppearInView delay={200}>
              <HeroButtons buttons={frontpage.heroButtons} locale={locale} />
            </AppearInView>
          )}
        </div>

        <section
          id="portfolio"
          className="w-full max-w-5xl mt-28 scroll-mt-24"
        >
          <AppearInView>
            <ProjectIndex
              projects={frontpage.projects ?? []}
              locale={locale}
              title={t(frontpage, "portfolioTitle", locale)}
            />
          </AppearInView>

          <div className="mt-16 flex justify-center">
            <Image
              src="/v5-red.webp"
              alt="Logo"
              width={224}
              height={224}
              className="w-auto h-24"
              unoptimized
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </>
  );
}
