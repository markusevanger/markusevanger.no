
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


export default function CV() {

    const [t] = useTranslation("cv")

    //height: 347px;
    //width: 206px;



    return (

        <div className="p-4">

            <Link to="/"> {"< "}{t("back")}</Link>

            <div className="h-screen w-full flex flex-col gap-5">
                <div className="flex justify-center">
                    <img className="w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] object-cover hover:scale-105 hover:outline outline-8 transition-all" src="markus1.jpeg"></img>
                </div>



                <div className="">
                    <h2 className="text-xl mb-4">{t("projects.title")}</h2>
                    <ul>
                        <li>
                            <div className="">
                                <p className="text-lg"> {t("projects.1.title")} </p>
                                <p className="text-sm italic"> {t("projects.1.description")} </p>
                                <p className="text-sm italic"> {t("education.university.period")} </p>
                                <p>Les mer</p>
                            </div>
                        </li>

                        <li>
                            <div className="">
                                <p className="text-lg"> {t("projects.1.title")} </p>
                                <p className="text-sm italic"> {t("projects.1.description")} </p>
                                <p className="text-sm italic"> {t("education.university.period")} </p>
                                <p>Les mer</p>
                            </div>
                        </li>
                    </ul>
                </div>





                <div className="grid grid-flow-row md:grid-cols-2 gap-4">
                    <div>
                        <h2 className="text-xl mb-4">{t("education.title")}</h2>
                        <ul className="grid grid-flow-row gap-2">
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
                        <ul className="grid grid-flow-row gap-2">
                            <li>
                                <div className="outline rounded-lg p-5 h-full">
                                    <p className="text-lg"> {t("work.1.title")} </p>
                                    <p className="text-sm italics"> {t("work.1.name")}</p>
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