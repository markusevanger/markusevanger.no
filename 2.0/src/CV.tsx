
import { ChevronLeft, ExternalLink, FileText, FlaskConical, GithubIcon, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ExternalLinkButton from "./componets/Button";


export default function CV() {

    const [t] = useTranslation("cv")

    //height: 347px;
    //width: 206px;


    return (

        <div className="pt-10 pb-72 min-h-screen flex flex-col items-center w-full">




            <div className="max-w-[1200px] flex flex-col gap-5">


                <Link to="/" className="w-fit">
                    <ExternalLinkButton>
                        <ChevronLeft />  {t("back")}
                    </ExternalLinkButton>
                </Link>

                <div className="flex justify-center">
                    <img className="w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] object-cover hover:scale-105 hover:outline outline-markusRed outline-8 transition-all" src="markus1.jpeg"></img>
                </div>



                <div className="">
                    <h2 className="text-xl mb-4">{t("projects.title")}</h2>
                    <ul>
                        <li>
                            <div className="flex flex-col">
                                <p className="text-lg font-bold"> {t("projects.1.title")} </p>
                                <p className="text-sm"> {t("projects.1.description")} </p>
                                <p className="text-sm italic"> {t("projects.1.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                                    <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://sidesjekk.markusevanger.no/"><FlaskConical /> Demo </ExternalLinkButton>
                                    <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/polaris-sideoversikt"><GithubIcon /> Kode </ExternalLinkButton>
                                </div>

                            </div>
                        </li>

                        <li>
                            <div className="mt-4">
                                <p className="text-lg font-bold"> {t("projects.2.title")} </p>
                                <p className="text-sm"> {t("projects.2.description")} </p>
                                <p className="text-sm italic"> {t("projects.2.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">

                                    <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://pawcast.markusevanger.no"><ExternalLink /> Se nettside</ExternalLinkButton>
                                    <ExternalLinkButton openInExternalBrowser={true} to="https://pawcast.markusevanger.no/assets/prosjektrapport-B536DxSL.pdf"><FileText /> Rapport </ExternalLinkButton>
                                    <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/pawcast"><GithubIcon /> Kode </ExternalLinkButton>
                                </div>
                            </div>
                        </li>


                        <li>
                            <div className="mt-4">
                                <p className="text-lg font-bold"> {t("projects.3.title")} </p>
                                <p className="text-sm"> {t("projects.3.description")} </p>
                                <p className="text-sm italic"> {t("projects.3.period")} </p>

                                <div className="mt-4 flex flex-col gap-2 md:flex-row-reverse">
                                    <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://clearkarbonexchange.onrender.com/"><TreePine /> Demo </ExternalLinkButton>
                                    <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/pawcast"><GithubIcon /> Kode </ExternalLinkButton>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>


                <div className="grid grid-flow-row md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl mb-4">{t("education.title")}</h2>
                        <ul className="grid grid-flow-row gap-4">
                            <li>
                                <div className="outline rounded-lg p-5 h-full">
                                    <p className="text-lg"> {t("education.university.title")} </p>
                                    <p className="text-sm italic"> {t("education.university.subtitle")} </p>
                                    <p className="text-sm italic"> {t("education.university.period")} </p>
                                    <p className="mt-2">  {t("education.university.description")} </p>
                                    <p className="mt-2"> <a className="underline cursor-pointer" >{t("education.university.appProject")}</a> | <a className="underline">{t("education.university.designProject")}</a></p>                            </div>
                            </li>

                            <li>
                                <div className="outline rounded-lg p-5 h-full">
                                    <p className="text-lg"> {t("education.highschool.title")} </p>
                                    <p className="text-sm italic"> {t("education.highschool.subtitle")} </p>
                                    <p className="text-sm italic"> {t("education.highschool.period")} </p>
                                    <p className="mt-2">  {t("education.highschool.description")} </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-xl mb-4">{t("work.title")}</h2>
                        <ul className="grid grid-flow-row gap-4">
                            <li>
                                <div className="outline rounded-lg p-5 h-full">
                                    <p className="text-lg"> {t("work.1.title")} </p>
                                    <p className="text-sm italic"> {t("work.1.name")} | {t("work.1.period")}</p>
                                    <p className=""> {t("work.1.description")}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

    )
}