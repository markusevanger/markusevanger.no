import WindowAnimation from "./components/WindowAnimation";
import ProjectCarousel from "./components/client/ProjectCarousel";
import ProjectItemSmall from "./components/ProjectItemSmall";
import AgeCounterSpan from "./components/client/AgeCounterSpan";
import EmailCopy from "./components/client/EmailCopy";


import { motion } from "framer-motion";
import Link from "next/link";
import i18next from "i18next";


import { getScopedI18n } from '../../locales/server'

export default async function Home() {

  const t = await getScopedI18n("main") // used for language
  const getLanguageNotSelected = () => "no" === i18next.language ? "en" : "no"
  const toggleLang = () => i18next.changeLanguage(getLanguageNotSelected() as string)





  interface SmallProject {
    title: string;
    type: string;
    link: string;
  }
  
  
  const smallProjects = t('smallProjects.list') as SmallProject[]


  return (
    <div className="pb-10 px-5 pt-10 w-full overflow-x-hidden flex items-center flex-col ">
      <div className="flex flex-col gap-2 items-center w-full max-w-[610px]">
        {/*<WindowAnimation></WindowAnimation>*/}


        <h1 className="mt-4 mb-1 transition-all text-markusRed text-4xl font-[Mogi]"> {t("hero.title")}</h1>

        <p className="text-center max-w-[350px]">
          {t("hero.description_1")} <AgeCounterSpan /> {t("hero.description_2")}<a href="https://kult.design" target="_blank" className="underline text-markusRed font-semibold">{t("hero.workplace")}</a>. {t("hero.description_3")}
        </p>

        <div className="flex flex-col gap-2 mt-8">

          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
            <Link href="cv" className="buttonPrimary">
              {t("cv")}
            </Link>
          </div>


        </div>

        <section id="portfolio" className="w-full  flex-col justify-center mt-28">

          <div>
            <h2 className="font-bold font-[Mogi] text-markusRed text-3xl mb-2">
              {t("projects.title")}
            </h2>
            <ProjectCarousel></ProjectCarousel>
          </div>

          <div className="flex flex-col gap-2 justify-center h-full items-center">
            <img src={"/v4-red.gif"} className="w-32 h-auto" />
          </div>


          <div className="rounded-lg mt-8 p-2">
            <h2 className="text-2xl font-[Mogi] text-markusRed">{t("smallProjects.title")}</h2>

            <ul className="flex flex-col gap-3 mt-3">

              {Array.from({ length: smallProjects.length }, (_, index) =>
                <ProjectItemSmall key={index} title={t(`smallProjects.list.${index}.title`)} desc={t(`smallProjects.list.${index}.type`)} link={t(`smallProjects.list.${index}.link`)}></ProjectItemSmall>
              )}

            </ul>

            <div className="flex gap-3 items-center mt-3">
              <p className="">{t("projects.forMore")}</p>
              <Link className="button" href="/cv">{t("cv")}!</Link>
            </div>


          </div>
        </section>

        <section id="bottom" className="mt-24 text-sm gap-2 text-center flex flex-col items-center">
          <p className="flex gap-2 items-center">{t("bottom.contactMe")}<EmailCopy /> </p>
          <p>{t("bottom.madeBy")}</p>
          <div className="">
            
            {/*
            <a className="w-fit h-fit mb-10 underline hover:markusRed cursor-pointer" onClick={() => toggleLang()}>
            {i18next.language === "en" ? "Bytt til Norsk" : "Swap to English"}
          </a>
            */}

          </div>

          <motion.div
            whileHover={{ scale: 0.7, rotateY: 180 }} className="w-fit">
            <svg className="fill-markusRed h-10" viewBox="0 0 64 57" xmlns="http://www.w3.org/2000/svg">
              <path d="M62.03 25.75C60.3151 27.6208 57.3645 27.7737 55.32 26.36C58.3611 41.9606 51.8603 56.75 35.03 56.75C18.9009 56.75 10.8421 41.3374 10.32 26.98C7.95903 29.3032 4.79725 30.9883 1.85001 28.27C-3.02641 23.7916 4.21946 18.5405 7.15001 15.61C4.68366 12.0475 -1.39513 5.35043 4.19001 1.75999C9.00799 -1.36519 12.3175 4.9868 14.55 8.18999C17.7299 4.95528 22.6122 -1.87248 27.35 2.47999C32.1691 6.90567 25.0912 12.2087 22.19 15.16C26.1089 16.8116 33.0007 19.3411 30.03 24.95C27.8912 28.9861 23.7062 27.1573 20.61 25.58C20.7161 34.5405 23.8335 46.3555 34.71 46.43C46.2136 46.43 46.4662 35.7348 44.93 27.03C42.8619 29.0981 39.6791 29.4461 37.43 27.38C32.8329 23.1582 39.4744 17.9756 42.33 15.12C39.4117 12.0333 33.5238 7.45266 37.66 2.96999C41.9158 -1.71137 46.6949 4.74529 49.62 7.82999C52.6383 4.81167 57.0336 -1.25253 61.63 2.96999C66.258 7.22022 60.0308 12.0092 57.17 14.87C60.708 17.3687 66.0878 21.3505 62.03 25.75Z" />
            </svg>
          </motion.div>
        </section>
      </div>
    </div>
  );
}