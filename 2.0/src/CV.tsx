
import { ChevronLeft, ExternalLink, FileText, FlaskConical, GithubIcon, Text, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ProjectItemSmall from "./componets/ProjectItemSmall";


export default function CV() {

    const [t] = useTranslation("cv")

    //height: 347px;
    //width: 206px;


    return (

        <div className="px-5 pt-10 pb-72 min-h-screen flex flex-col items-center w-full">
            <div className="max-w-[1200px] flex flex-col gap-5">

                <div className="w-28">
                    <Link className="button" to="/">
                        <ChevronLeft />  {t("back")}
                    </Link>
                </div>


                <div className="flex flex-col items-center">
                    <img alt={t("markusImgAlt")} className="w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] object-cover hover:scale-105 hover:outline outline-markusRed outline-8 transition-all" src="markus1.jpeg"></img>
                </div>



                <div className="">
                    <h2 className="text-2xl mb-4 font-bold">{t("projects.title")}</h2>
                    <ul>
                        <li>
                            <div className="flex flex-col">
                                <p className="text-lg "> {t("projects.1.title")} </p>
                                <p className="text-sm"> {t("projects.1.description")} </p>
                                <p className="text-sm italic"> {t("projects.1.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                                    <Link className="buttonPrimary" to="https://sidesjekk.markusevanger.no/"><FlaskConical /> Demo </Link>
                                    <Link className="button" to="https://github.com/markusevanger/polaris-sideoversikt"><GithubIcon /> Kode </Link>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="mt-4">
                                <p className="text-lg"> {t("projects.2.title")} </p>
                                <p className="text-sm"> {t("projects.2.description")} </p>
                                <p className="text-sm italic"> {t("projects.2.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">

                                    <Link className="buttonPrimary" to="https://pawcast.markusevanger.no"><ExternalLink /> Se nettside</Link>
                                    <Link className="button" to="https://pawcast.markusevanger.no/assets/prosjektrapport-B536DxSL.pdf"><FileText /> Rapport </Link>
                                    <Link className="button" to="https://github.com/markusevanger/pawcast"><GithubIcon /> Kode </Link>
                                </div>
                            </div>
                        </li>


                        <li>
                            <div className="mt-4">
                                <p className="text-lg"> {t("projects.3.title")} </p>
                                <p className="text-sm"> {t("projects.3.description")} </p>
                                <p className="text-sm italic"> {t("projects.3.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                                    <Link className="buttonPrimary" to="https://clearkarbonexchange.onrender.com/"><TreePine /> Demo </Link>
                                    <Link className="button" to="https://github.com/markusevanger/pawcast"><GithubIcon /> Kode </Link>
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
                                <div className="mt-2 flex gap-3 justify-end">
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
                        <ul className="h-full grid grid-rows-2 grid-flow-col gap-8 outline rounded-lg p-8">
                            <li className="border-b-2 pb-8">
                                <p className="text-lg"> {t("work.1.title")} </p>
                                <p className="text-sm italic"> {t("work.1.name")} | {t("work.1.period")}</p>
                                <p className="mt-2"> {t("work.1.description")}</p>
                                <div className="flex justify-end">
                                    <a className="button w-fit" href="/documents/pmgrafisksør_attest.pdf"> <Text></Text> Attest </a>
                                </div>
                            </li>

                            <li>
                                <p className="text-lg"> {t("work.2.title")} </p>
                                <p className="text-sm italic"> {t("work.2.name")} | {t("work.2.period")}</p>
                                <p className="mt-2"> {t("work.2.description")}</p>
                                <div className="flex justify-end">
                                    <a className="button w-fit" href="/documents/Attest - Clear Karbon Exchange AS - Markus Evanger.pdf"> <Text></Text> Attest </a>
                                </div>
                            </li>
                        </ul>
                    </section>

                    <section className="lg:col-span-full">
                        <h2 className=" text-2xl w-full mb-4 font-bold">{t("work.title")} Egenskjaper</h2>
                        <ul className="h-full grid-flow-col gap-8 outline rounded-lg p-8">
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>
                            <ProjectItemSmall title="asd" desc="asd" link=""></ProjectItemSmall>

                        </ul>
                    </section>
                </div>
            </div>
        </div >

    )
}