'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ClipboardIcon } from 'lucide-react'
import WindowAnimation from './WindowAnimation'
import ProjectCarousel from './ProjectCarousel'
import ProjectItemSmall from './ProjectItemSmall'
import LanguageToggle from './LanguageToggle'
import { HeartSvg } from './assets/HeartSvg'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/types'
import type { Frontpage, SiteSettings } from '@/lib/types'
import { urlFor } from '@/lib/sanity'

interface HomePageProps {
  frontpage: Frontpage
  siteSettings: SiteSettings
}

export default function HomePage({ frontpage, siteSettings }: HomePageProps) {
  const { language } = useLanguage()
  const [age, setAge] = useState<string>('0.000000000')
  const [emailCopiedBadge, setEmailCopiedBadge] = useState(false)

  useEffect(() => {
    if (!siteSettings.birthDate) return

    const birthDate = new Date(siteSettings.birthDate)

    const calculateAge = () => {
      const currentDate = new Date()
      const ageInMilliseconds = currentDate.getTime() - birthDate.getTime()
      const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000
      const preciseAge = (ageInMilliseconds / millisecondsInYear).toFixed(9)
      setAge(preciseAge)
    }

    const updateFrequency = setInterval(calculateAge, 100)
    return () => clearInterval(updateFrequency)
  }, [siteSettings.birthDate])

  const copyMail = () => {
    navigator.clipboard.writeText(siteSettings.email)
    setEmailCopiedBadge(true)
    setTimeout(() => {
      setEmailCopiedBadge(false)
    }, 2000)
  }

  // Replace {{age}} placeholder in description
  const description = t(frontpage, 'heroDescription', language).replace('{{age}}', age)

  return (
    <div className="pb-10 container mx-auto pt-10 w-full overflow-x-hidden flex items-center flex-col">
      <div className="flex flex-col gap-2 items-center w-full max-w-[610px]">
        <WindowAnimation />

        <h1 className="mt-4 mb-1 transition-all text-markus-red text-4xl font-[Mogi]">
          {t(frontpage, 'heroTitle', language)}
        </h1>

        <p className="text-center max-w-[350px]">
          {description.split('{{workplace}}')[0]}
          {frontpage.workplaceUrl && (
            <a
              href={frontpage.workplaceUrl}
              target="_blank"
              className="underline text-markus-red font-semibold"
            >
              {t(frontpage, 'workplaceText', language)}
            </a>
          )}
          {description.split('{{workplace}}')[1] || '.'}
        </p>

        <div className="flex flex-col gap-2 mt-8">
          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
            <Link href="/cv" className="button-primary">
              CV
            </Link>
          </div>
        </div>

        <section id="portfolio" className="w-full flex-col justify-center mt-28">
          <div className="px-2">
            <h2 className="font-bold font-[Mogi] text-markus-red text-3xl mb-2">
              {t(frontpage, 'portfolioTitle', language)}
            </h2>
            {frontpage.featuredProjects && frontpage.featuredProjects.length > 0 && (
              <ProjectCarousel projects={frontpage.featuredProjects} />
            )}
          </div>

          <div className="my-8 flex justify-center h-full items-center">
            {siteSettings.logoImage && (
              <Image
                src={urlFor(siteSettings.logoImage).width(200).url()}
                alt="Logo"
                width={112}
                height={112}
                className="w-auto h-28"
              />
            )}
          </div>

          {frontpage.smallProjects && frontpage.smallProjects.length > 0 && (
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
          )}
        </section>

        <section
          id="bottom"
          className="mt-24 text-sm gap-2 text-center flex flex-col items-center"
        >
          <div
            className={`w-full text-center bg-slate-100 py-2 rounded-md transition-all ${
              emailCopiedBadge ? '' : 'invisible'
            }`}
          >
            {t(frontpage, 'copiedNotification', language)}
          </div>

          <p className="flex gap-2 items-center">
            {t(frontpage, 'contactText', language)}
            <span onClick={copyMail} className="underline cursor-pointer">
              {siteSettings.email}
            </span>
            <ClipboardIcon size={16} />
          </p>

          <LanguageToggle />

          <p className="text-xs font-mono mt-8 bg-gray-100 p-y1 rounded-full px-8">
            {t(frontpage, 'madeByText', language)}
          </p>

          <HeartSvg />
        </section>
      </div>
    </div>
  )
}
