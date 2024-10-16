
import { ChevronLeft, ExternalLink, FileText, FlaskConical, GithubIcon, Languages, Text, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import AbilityItem from "./componets/AbilityItem";
import { useEffect, useState } from "react";
import i18next from "i18next";
import { motion } from "framer-motion";



export default function CV() {

    const [t] = useTranslation("cv")

    //height: 347px;
    //width: 206px;

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname]);

    const dev = t('abilities.dev.list', { returnObjects: true }) as { title: string, link: string }[]
    const host = t('abilities.host.list', { returnObjects: true }) as { title: string, link: string }[]
    const creative = t('abilities.creative.list', { returnObjects: true }) as { title: string, link: string }[]

    const getLanguageNotSelected = () => "no" === i18next.language ? "en" : "no"
    const toggleLang = () => i18next.changeLanguage(getLanguageNotSelected() as string)


    const [emailCopiedBadge, setEmailCopiedBadge] = useState(false)
    const copyMail = () => {
        const textToCopy = "markusevanger@gmail.com";
        navigator.clipboard.writeText(textToCopy);
        setEmailCopiedBadge(true)
        setTimeout(() => {
            setEmailCopiedBadge(false);
        }, 2000);
    }

    return (

        <div className="px-5 pt-10 pb-72 min-h-screen flex flex-col items-center w-full">
            <div className="max-w-[1200px] flex flex-col gap-5">

                <div className="flex justify-between">
                    <Link className="button w-fit py-1 h-fit mb-10 text-sm" to="/">
                        <ChevronLeft />  {t("back")}
                    </Link>

                    <button className="button w-fit py-1 h-fit mb-10 text-sm" onClick={() => toggleLang()}>
                        <Languages></Languages>
                        {i18next.language === "en" ? "Norsk" : "English"}
                    </button>
                </div>


                <div className="flex justify-center">
                    <img alt={t("markusImgAlt")} className="w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] object-cover hover:scale-105 hover:outline outline-markusRed outline-8 transition-all" src="markus1.jpeg"></img>
                </div>



                <div className="">
                    <h2 className="text-2xl mb-4 font-bold">{t("projects.title")}</h2>
                    <ul>


                        <li>
                            <div className="mt-4">
                                <p className="text-lg"> {t("projects.2.title")} </p>
                                <p className="text-sm"> {t("projects.2.description")} </p>
                                <p className="text-sm italic"> {t("projects.2.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                                    <Link className="buttonPrimary" to="https://pawcast.markusevanger.no"><ExternalLink /> {t("projects.2.website")}</Link>
                                    <Link className="button" to="https://pawcast.markusevanger.no/assets/prosjektrapport-B536DxSL.pdf"><FileText /> {t("projects.2.report")} </Link>
                                    <Link className="button" to="https://github.com/markusevanger/pawcast"><GithubIcon /> {t("projects.code")} </Link>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="flex flex-col">
                                <p className="text-lg "> {t("projects.1.title")} </p>
                                <p className="text-sm"> {t("projects.1.description")} </p>
                                <p className="text-sm italic"> {t("projects.1.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                                    <Link className="buttonPrimary" to="https://sidesjekk.markusevanger.no/"><FlaskConical /> {t("projects.demo")} </Link>
                                    <Link className="button" to="https://github.com/markusevanger/polaris-sideoversikt"><GithubIcon /> {t("projects.demo")} </Link>
                                </div>
                            </div>
                        </li>



                        <li>
                            <div className="mt-4">
                                <p className="text-lg"> {t("projects.3.title")} </p>
                                <p className="text-sm"> {t("projects.3.description")} </p>
                                <p className="text-sm italic"> {t("projects.3.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                                    <Link className="buttonPrimary" to="https://clearkarbonexchange.onrender.com/"><TreePine /> {t("projects.demo")} </Link>
                                    <Link className="button" to="https://github.com/markusevanger/pawcast"><GithubIcon /> {t("projects.code")} </Link>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>


                <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
                    <section id={t("education.title")} className="h-full">
                        <h2 className="text-2xl mb-4 font-bold">{t("education.title")}</h2>
                        <ul className="grid h-full grid-flow-row gap-8 outline rounded-lg p-8">


                            <li className="border-b-2 pb-4 h-full">
                                <p className="text-lg"> {t("education.university.title")} </p>
                                <p className="text-sm italic"> {t("education.university.subtitle")} </p>
                                <p className="text-sm italic"> {t("education.university.period")} </p>
                                <p className="mt-2">  {t("education.university.description")} </p>
                                <div className="mt-2 flex flex-col md:flex-row gap-2">
                                    <a href="https://pawcast.markusevanger.no" className="button" >{t("education.university.appProject")}</a>
                                    <a href="https://www.uio.no/studier/emner/matnat/ifi/IN1060/v23/prosjekter-var-2023/super-circut/" className="button">{t("education.university.designProject")}</a>
                                </div>
                            </li>

                            <li className="border-b-2 pb-4 h-full">
                                <p className="text-lg"> {t("education.exchange.title")} </p>
                                <p className="text-sm italic"> {t("education.exchange.subtitle")} </p>
                                <p className="text-sm italic"> {t("education.exchange.period")} </p>
                                <p className="mt-2">  {t("education.exchange.description")} </p>
                            </li>

                            <li>
                                <p className="text-lg"> {t("education.highschool.title")} </p>
                                <p className="text-sm italic"> {t("education.highschool.subtitle")} </p>
                                <p className="text-sm italic"> {t("education.highschool.period")} </p>
                                <p className="mt-2">  {t("education.highschool.description")} </p>
                            </li>
                        </ul>
                    </section>


                    <section className="h-full">
                        <h2 className=" text-2xl mb-4 font-bold">{t("work.title")}</h2>
                        <ul className="h-full grid grid-flow-row gap-8 outline rounded-lg p-8">
                            <li className="border-b-2">
                                <p className="text-lg"> {t("work.1.title")} </p>
                                <p className="text-sm italic"> {t("work.1.name")} | {t("work.1.period")}</p>
                                <p className="mt-2"> {t("work.1.description")}</p>
                                <div className="">
                                    <a className="button my-8" href="/documents/pmgrafisksør_attest.pdf"> <Text></Text> {t("work.cert")} </a>
                                </div>
                            </li>

                            <li>
                                <p className="text-lg"> {t("work.2.title")} </p>
                                <p className="text-sm italic"> {t("work.2.name")} | {t("work.2.period")}</p>
                                <p className="mt-2"> {t("work.2.description")}</p>
                                <div className="">
                                    <a className="button my-8" href="/documents/Attest - Clear Karbon Exchange AS - Markus Evanger.pdf"> <Text></Text> {t("work.cert")} </a>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section className="lg:col-span-full mt-16">
                        <h2 className=" text-2xl w-full mb-4 font-bold">{t("abilities.title")}</h2>
                        <div className="h-full flex flex-col md:grid md:grid-cols-2 gap-8 outline rounded-lg p-8">
                            <div>
                                <h3 className="text-lg font-bold">{t("abilities.host.title")}</h3>
                                <ul>
                                    {
                                        Array.from({ length: host.length }, (_, index) =>
                                            <AbilityItem key={index} title={host[index].title} link={host[index].link}></AbilityItem>
                                        )
                                    }
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold">{t("abilities.creative.title")}</h3>
                                <ul>
                                    {
                                        Array.from({ length: creative.length }, (_, index) =>
                                            <AbilityItem key={index} title={creative[index].title} link={creative[index].link}></AbilityItem>
                                        )
                                    }
                                </ul>
                            </div>
                            <div className="col-span-2">
                                <h3 className="text-lg font-bold mb-2">{t("abilities.dev.title")}</h3>
                                <ul className="grid md:grid-cols-2 md:gap-x-8">
                                    {
                                        Array.from({ length: dev.length }, (_, index) =>
                                            <AbilityItem key={index} title={dev[index].title} link={dev[index].link}></AbilityItem>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
                <section id="bottom" className="mt-24 w-full gap-2 text-center flex flex-col items-center">
                    {
                        <div className={`w-full text-center bg-slate-100 py-2 rounded-md transition-all ${emailCopiedBadge ? "opacity-100" : "opacity-0"}`}>
                            {t("bottom.copied")}
                        </div>
                    }

                    <p>{t("bottom.contactMe")} <span onClick={copyMail} className="cursor-pointer underline"> markusevanger@gmail.com</span></p>
                    <p>{t("bottom.madeBy")}</p>

                    <motion.div
                        whileTap={{ scale: 0.7 }} className="w-fit">
                        <svg className="fill-markusRed h-10" viewBox="0 0 64 57" xmlns="http://www.w3.org/2000/svg">
                            <path d="M62.03 25.75C60.3151 27.6208 57.3645 27.7737 55.32 26.36C58.3611 41.9606 51.8603 56.75 35.03 56.75C18.9009 56.75 10.8421 41.3374 10.32 26.98C7.95903 29.3032 4.79725 30.9883 1.85001 28.27C-3.02641 23.7916 4.21946 18.5405 7.15001 15.61C4.68366 12.0475 -1.39513 5.35043 4.19001 1.75999C9.00799 -1.36519 12.3175 4.9868 14.55 8.18999C17.7299 4.95528 22.6122 -1.87248 27.35 2.47999C32.1691 6.90567 25.0912 12.2087 22.19 15.16C26.1089 16.8116 33.0007 19.3411 30.03 24.95C27.8912 28.9861 23.7062 27.1573 20.61 25.58C20.7161 34.5405 23.8335 46.3555 34.71 46.43C46.2136 46.43 46.4662 35.7348 44.93 27.03C42.8619 29.0981 39.6791 29.4461 37.43 27.38C32.8329 23.1582 39.4744 17.9756 42.33 15.12C39.4117 12.0333 33.5238 7.45266 37.66 2.96999C41.9158 -1.71137 46.6949 4.74529 49.62 7.82999C52.6383 4.81167 57.0336 -1.25253 61.63 2.96999C66.258 7.22022 60.0308 12.0092 57.17 14.87C60.708 17.3687 66.0878 21.3505 62.03 25.75Z" />
                        </svg>
                    </motion.div>
                </section>
            </div>
        </div>
    )
}