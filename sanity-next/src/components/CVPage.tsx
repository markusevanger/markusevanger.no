'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ChevronLeft,
  ExternalLink,
  FileText,
  FlaskConical,
  GithubIcon,
  Text,
} from 'lucide-react'
import AbilityItem from './AbilityItem'
import LanguageToggle from './LanguageToggle'
import { HeartSvg } from './assets/HeartSvg'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/types'
import type { CVPage, SiteSettings } from '@/lib/types'
import { urlFor } from '@/lib/sanity'

interface CVPageProps {
  cvPage: CVPage
  siteSettings: SiteSettings
}

export default function CVPageComponent({ cvPage, siteSettings }: CVPageProps) {
  const { language } = useLanguage()
  const [emailCopiedBadge, setEmailCopiedBadge] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const copyMail = () => {
    navigator.clipboard.writeText(siteSettings.email)
    setEmailCopiedBadge(true)
    setTimeout(() => {
      setEmailCopiedBadge(false)
    }, 2000)
  }

  return (
    <div className="px-5 pt-10 pb-72 min-h-screen flex flex-col items-center w-full">
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
              alt={siteSettings.name}
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
                  <p className="text-sm">{t(project, 'description', language)}</p>
                  <p className="text-sm italic">{t(project, 'period', language)}</p>

                  <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button-primary"
                      >
                        <FlaskConical /> Demo
                      </a>
                    )}
                    {project.reportUrl && (
                      <a
                        href={project.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                      >
                        <FileText /> Report
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button"
                      >
                        <GithubIcon /> Code
                      </a>
                    )}
                  </div>
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
                  <p className="mt-2">{t(edu, 'description', language)}</p>
                  {edu.relatedProjects && edu.relatedProjects.length > 0 && (
                    <div className="mt-2 flex flex-col md:flex-row gap-2">
                      {edu.relatedProjects.map((proj) => (
                        <a
                          key={proj._id}
                          href={proj.demoUrl || proj.githubUrl || '#'}
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
                  <p className="mt-2">{t(work, 'description', language)}</p>
                  {work.certificateUrl && (
                    <div className="">
                      <a className="button my-8" href={work.certificateUrl}>
                        <Text />{' '}
                        {t(work, 'certificateLabel', language) || 'View Certificate'}
                      </a>
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
            <div className="h-full flex flex-col md:grid md:grid-cols-2 gap-8 outline rounded-lg p-8">
              {cvPage.skillCategories?.map((category) => (
                <div
                  key={category._id}
                  className={
                    category.name_en === 'Development' ? 'col-span-2' : ''
                  }
                >
                  <h3 className="text-lg font-bold mb-2">
                    {t(category, 'name', language)}
                  </h3>
                  <ul
                    className={
                      category.name_en === 'Development'
                        ? 'grid md:grid-cols-2 md:gap-x-8'
                        : ''
                    }
                  >
                    {category.skills?.map((skill) => (
                      <AbilityItem key={skill._id} skill={skill} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Section */}
        <section
          id="bottom"
          className="mt-24 w-full gap-2 text-center flex flex-col items-center"
        >
          <div
            className={`w-full text-center bg-slate-100 py-2 rounded-md transition-all ${
              emailCopiedBadge ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Copied!
          </div>

          <p>
            {t(cvPage, 'contactText', language)}{' '}
            <span onClick={copyMail} className="cursor-pointer underline">
              {siteSettings.email}
            </span>
          </p>

          <LanguageToggle />

          <HeartSvg />
        </section>
      </div>
    </div>
  )
}
