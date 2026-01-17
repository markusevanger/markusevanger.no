import Image from "next/image";
import Button from "./Button";
import AppearInView from "./AppearInView";
import AnimatedSkills from "./AnimatedSkills";
import { t, tPortableText } from "@/lib/types";
import type { CvPageQueryResult, SiteSettingsQueryResult } from "@/lib/types";
import { urlFor } from "@/lib/sanity";
import type { Locale } from "@/i18n/config";
import PortableTextRenderer from "./PortableTextRenderer";
import ScrollToTop from "./ScrollToTop";

interface CVPageProps {
  cvPage: NonNullable<CvPageQueryResult>;
  siteSettings: NonNullable<SiteSettingsQueryResult>;
  locale: Locale;
}

export default function CVPageComponent({
  cvPage,
  siteSettings,
  locale,
}: CVPageProps) {
  return (
    <div className="px-8 md:px-4 pt-16 md:pt-24 min-h-screen flex flex-col items-center w-full">
      <ScrollToTop />

      <div className="max-w-[610px] flex flex-col gap-5">
        <AppearInView>
          <div className="flex justify-center">
            {siteSettings.cvProfileImage && (
              <Image
                src={urlFor(siteSettings.cvProfileImage)
                  .width(412)
                  .height(694)
                  .url()}
                alt={siteSettings.name || ""}
                width={206}
                height={347}
                className="w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] object-cover hover:scale-105 hover:outline outline-markus-red outline-8 transition-all"
              />
            )}
          </div>
        </AppearInView>

        {/* Projects Section */}
        <AppearInView delay={100}>
          <div className="">
            <h2 className="text-2xl mb-4 font-bold">
              {t(cvPage, "projectsSectionTitle", locale)}
            </h2>
            <ul>
              {cvPage.featuredProjects?.map((project, index) => (
                <li key={project._id} className={index > 0 ? "mt-16" : "mt-4"}>
                  <div className="flex flex-col">
                    <p className="text-lg">{t(project, "title", locale)}</p>
                    <PortableTextRenderer
                      value={tPortableText(project, "description", locale)}
                      className="text-sm"
                    />
                    <p className="text-sm italic">
                      {t(project, "period", locale)}
                    </p>

                    {project.buttons && project.buttons.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                        {project.buttons.map((button, idx) => (
                          <Button key={idx} button={button} locale={locale} />
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </AppearInView>

        <div className="flex flex-col gap-8">
          {/* Education Section */}
          <AppearInView delay={100}>
            <section className="h-full">
              <h2 className="text-2xl mb-4 font-bold">
                {t(cvPage, "educationSectionTitle", locale)}
              </h2>
              <ul className="grid h-full grid-flow-row gap-8 outline rounded-lg p-8">
                {cvPage.education?.map((edu, index) => (
                  <li
                    key={edu._id}
                    className={
                      index < (cvPage.education?.length || 0) - 1
                        ? "border-b-2 pb-4 h-full"
                        : ""
                    }
                  >
                    <p className="text-lg">{t(edu, "institution", locale)}</p>
                    <p className="text-sm italic">{t(edu, "degree", locale)}</p>
                    <p className="text-sm italic">{t(edu, "period", locale)}</p>
                    <PortableTextRenderer
                      value={tPortableText(edu, "description", locale)}
                      className="mt-2"
                    />
                    {edu.relatedProjects && edu.relatedProjects.length > 0 && (
                      <div className="mt-2 flex flex-col md:flex-row gap-2">
                        {edu.relatedProjects.map((proj) => (
                          <a
                            key={proj._id}
                            href={proj.link || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button"
                          >
                            {t(proj, "title", locale)}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </AppearInView>

          {/* Work Experience Section */}
          <AppearInView delay={100}>
            <section className="h-full">
              <h2 className="text-2xl mb-4 font-bold">
                {t(cvPage, "workSectionTitle", locale)}
              </h2>
              <ul className="h-full grid grid-flow-row gap-8 outline rounded-lg p-8">
                {cvPage.workExperience?.map((work, index) => (
                  <li
                    key={work._id}
                    className={
                      index < (cvPage.workExperience?.length || 0) - 1
                        ? "border-b-2 pb-8"
                        : ""
                    }
                  >
                    <p className="text-lg">{t(work, "position", locale)}</p>
                    <p className="text-sm italic">
                      {t(work, "company", locale)} | {t(work, "period", locale)}
                    </p>
                    <PortableTextRenderer
                      value={tPortableText(work, "description", locale)}
                      className="mt-2"
                    />
                    {work.buttons && work.buttons.length > 0 && (
                      <div className="mt-8 flex flex-col gap-2 md:flex-row">
                        {work.buttons.map((button, idx) => (
                          <Button key={idx} button={button} locale={locale} />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </AppearInView>

          {/* Skills Section */}
          <AppearInView delay={200}>
            <section className="mt-16">
              <h2 className="text-2xl w-full mb-4 font-bold">
                {t(cvPage, "skillsSectionTitle", locale)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 outline rounded-lg p-8">
                {cvPage.skillCategories?.map((category) => {
                  const isLarge = (category.skills?.length || 0) > 6;
                  return (
                    <div
                      key={category._id}
                      className={isLarge ? "sm:col-span-2" : ""}
                    >
                      <h3 className="text-lg font-bold mb-3">
                        {t(category, "name", locale)}
                      </h3>
                      <AnimatedSkills skills={category.skills || []} />
                    </div>
                  );
                })}
              </div>
            </section>
          </AppearInView>
        </div>
      </div>
    </div>
  );
}
