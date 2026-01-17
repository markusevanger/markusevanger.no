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

interface HomePageProps {
  frontpage: NonNullable<FrontpageQueryResult>;
  siteSettings: NonNullable<SiteSettingsQueryResult>;
}

export default function HomePage({ frontpage, siteSettings }: HomePageProps) {
  return (
    <>
      <div className="pb-10 container mx-auto pt-10 px-8 md:px-4 w-full overflow-x-hidden flex items-center flex-col">
        <div className="flex flex-col gap-2 items-center w-full max-w-[610px]">
          <AppearInView>
            <WindowAnimation />
          </AppearInView>

          <AppearInView delay={100} className="flex flex-col items-center">
            <HomePageText
              frontpage={frontpage}
              birthDate={siteSettings.birthDate}
            />
          </AppearInView>

          {frontpage.heroButtons && frontpage.heroButtons.length > 0 && (
            <AppearInView delay={200}>
              <HeroButtons buttons={frontpage.heroButtons} />
            </AppearInView>
          )}

          <section
            id="portfolio"
            className="w-full flex-col justify-center mt-28"
          >
            <AppearInView>
              <HomePageText frontpage={frontpage} variant="portfolioTitle" />
            </AppearInView>

            <AppearInView>
              <div className="px-2">
                {frontpage.featuredProjects &&
                  frontpage.featuredProjects.length > 0 && (
                    <ProjectCarousel projects={frontpage.featuredProjects} />
                  )}
              </div>
            </AppearInView>

            <AppearInView>
              <div className="my-8 flex justify-center h-full items-center">
                <Image
                  src="/v5-red.webp"
                  alt="Logo"
                  width={112}
                  height={112}
                  className="w-auto h-28"
                  unoptimized
                />
              </div>
            </AppearInView>

            {frontpage.smallProjects && frontpage.smallProjects.length > 0 && (
              <AppearInView>
                <div className="rounded-lg mt-8 p-2">
                  <ul className="flex flex-col gap-3 mt-3">
                    {frontpage.smallProjects.map((project) => (
                      <ProjectItemSmall key={project._id} project={project} />
                    ))}
                  </ul>

                  <div className="flex gap-3 items-center mt-3">
                    <Link className="button" href="/cv">
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
