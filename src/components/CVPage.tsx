'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ArrowUpRight } from 'lucide-react'
import Button from './Button'
import { useLanguage } from '@/context/LanguageContext'
import { t, tPortableText } from '@/lib/types'
import type { CvPageQueryResult, SiteSettingsQueryResult } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import PortableTextRenderer from './PortableTextRenderer'

interface CVPageProps {
  cvPage: NonNullable<CvPageQueryResult>
  siteSettings: NonNullable<SiteSettingsQueryResult>
}

export default function CVPageComponent({ cvPage, siteSettings }: CVPageProps) {
  const { language } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="px-5 pt-10 min-h-screen flex flex-col items-center w-full">
      <div className="max-w-[1200px] flex flex-col gap-5">
        <div className="flex justify-between">
          <Link className="button w-fit py-1 h-fit mb-10 text-sm" href="/">
            <ChevronLeft /> {t(cvPage, 'backButtonText', language)}
          </Link>
        </div>

        <div className="flex justify-center">
          {siteSettings.cvProfileImage && (
            <Image
              src={urlFor(siteSettings.cvProfileImage).width(412).height(694).url()}
              alt={siteSettings.name || ''}
              width={206}
              height={347}
              className="w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] object-cover hover:scale-105 hover:outline outline-markus-red outline-8 transition-all"
            />
          )}
        </div>

        {/* Projects Section */}
        <div className="">
          <h2 className="text-2xl mb-4 font-bold">
            {t(cvPage, 'projectsSectionTitle', language)}
          </h2>
          <ul>
            {cvPage.featuredProjects?.map((project, index) => (
              <li key={project._id} className={index > 0 ? 'mt-16' : 'mt-4'}>
                <div className="flex flex-col">
                  <p className="text-lg">{t(project, 'title', language)}</p>
                  <PortableTextRenderer value={tPortableText(project, 'description', language)} className="text-sm" />
                  <p className="text-sm italic">{t(project, 'period', language)}</p>

                  {project.buttons && project.buttons.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                      {project.buttons.map((button, idx) => (
                        <Button key={idx} button={button} />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
          {/* Education Section */}
          <section className="h-full">
            <h2 className="text-2xl mb-4 font-bold">
              {t(cvPage, 'educationSectionTitle', language)}
            </h2>
            <ul className="grid h-full grid-flow-row gap-8 outline rounded-lg p-8">
              {cvPage.education?.map((edu, index) => (
                <li
                  key={edu._id}
                  className={
                    index < (cvPage.education?.length || 0) - 1
                      ? 'border-b-2 pb-4 h-full'
                      : ''
                  }
                >
                  <p className="text-lg">{t(edu, 'institution', language)}</p>
                  <p className="text-sm italic">{t(edu, 'degree', language)}</p>
                  <p className="text-sm italic">{t(edu, 'period', language)}</p>
                  <PortableTextRenderer value={tPortableText(edu, 'description', language)} className="mt-2" />
                  {edu.relatedProjects && edu.relatedProjects.length > 0 && (
                    <div className="mt-2 flex flex-col md:flex-row gap-2">
                      {edu.relatedProjects.map((proj) => (
                        <a
                          key={proj._id}
                          href={proj.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="button"
                        >
                          {t(proj, 'title', language)}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Work Experience Section */}
          <section className="h-full">
            <h2 className="text-2xl mb-4 font-bold">
              {t(cvPage, 'workSectionTitle', language)}
            </h2>
            <ul className="h-full grid grid-flow-row gap-8 outline rounded-lg p-8">
              {cvPage.workExperience?.map((work, index) => (
                <li
                  key={work._id}
                  className={
                    index < (cvPage.workExperience?.length || 0) - 1 ? 'border-b-2' : ''
                  }
                >
                  <p className="text-lg">{t(work, 'position', language)}</p>
                  <p className="text-sm italic">
                    {t(work, 'company', language)} | {t(work, 'period', language)}
                  </p>
                  <PortableTextRenderer value={tPortableText(work, 'description', language)} className="mt-2" />
                  {work.buttons && work.buttons.length > 0 && (
                    <div className="my-8 flex flex-col gap-2 md:flex-row">
                      {work.buttons.map((button, idx) => (
                        <Button key={idx} button={button} />
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Skills Section */}
          <section className="lg:col-span-full mt-16">
            <h2 className="text-2xl w-full mb-4 font-bold">
              {t(cvPage, 'skillsSectionTitle', language)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 outline rounded-lg p-8">
              {cvPage.skillCategories?.map((category) => {
                const isLarge = (category.skills?.length || 0) > 6
                return (
                <div key={category._id} className={isLarge ? 'sm:col-span-2' : ''}>
                  <h3 className="text-lg font-bold mb-3">
                    {t(category, 'name', language)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills?.map((skill) =>
                      skill.url ? (
                        <a
                          key={skill._id}
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border border-current hover:bg-markus-red hover:text-white hover:border-markus-red transition-colors"
                        >
                          {skill.name}
                          <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <span
                          key={skill._id}
                          className="px-3 py-1 text-sm rounded-full border border-current"
                        >
                          {skill.name}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )})}
            </div>
          </section>
        </div>

      </div>
    </div>
  )
}
