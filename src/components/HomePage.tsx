import Link from "next/link";
import Image from "next/image";
import WindowAnimation from "./WindowAnimation";
import ProjectCarousel from "./ProjectCarousel";
import ProjectItemSmall from "./ProjectItemSmall";
import HomePageText from "./HomePageText";
import HeroButtons from "./HeroButtons";
import AppearInView from "./AppearInView";
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

          <section
            id="portfolio"
            className="w-full flex-col justify-center mt-28"
          >
            <AppearInView>
              <HomePageText frontpage={frontpage} locale={locale} variant="portfolioTitle" />
            </AppearInView>

            <div className="px-2">
              {frontpage.featuredProjects &&
                frontpage.featuredProjects.length > 0 && (
                  <ProjectCarousel projects={frontpage.featuredProjects} locale={locale} />
                )}
            </div>

            <AppearInView>
              <div className="my-8 flex justify-center h-full items-center">
                <Image
                  src="/v5-red.webp"
                  alt="Logo"
                  width={112}
                  height={112}
                  className="w-auto h-28"
                  unoptimized
                  loading="lazy"
                />
              </div>
            </AppearInView>

            {frontpage.smallProjects && frontpage.smallProjects.length > 0 && (
              <AppearInView>
                <div className="rounded-lg mt-8 p-2">
                  <ul className="flex flex-col gap-3 mt-3">
                    {frontpage.smallProjects.map((project) => (
                      <ProjectItemSmall key={project._id} project={project} locale={locale} />
                    ))}
                  </ul>

                  <div className="flex gap-3 items-center mt-3">
                    <Link className="button" href={`/${locale}/cv`}>
                      CV!
                    </Link>
                  </div>
                </div>
              </AppearInView>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
