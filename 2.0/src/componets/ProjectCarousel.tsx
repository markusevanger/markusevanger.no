import { useEffect, useState } from "react";
import ExternalLinkButton from "./Button";
import ProjectItem from "./ProjectItem";
import { useTranslation } from "react-i18next";
import { useSnapCarousel } from "react-snap-carousel";
import { ChevronLeftCircle, ChevronRightCircle, ExternalLink, FileText, FlaskConical, GithubIcon } from "lucide-react";



export default function ProjectCarousel() {


    const [t] = useTranslation("main") // used for language
    const { scrollRef, snapPointIndexes, prev, next, goTo, activePageIndex, hasNextPage, hasPrevPage } = useSnapCarousel();
    const [carouselAutoRun, setCarouselAutoRun] = useState(true)

    useEffect(() => {
        const updateCarousel = () => {
            if (carouselAutoRun) {
                goTo((activePageIndex + 1) % snapPointIndexes.size)
            }

        }
        const updateFrequency = setInterval(updateCarousel, 5000);
        return () => clearInterval(updateFrequency);
    }, [activePageIndex, carouselAutoRun, snapPointIndexes.size]); // Dependencies: effect reruns when activePageIndex or snapPointIndexes change



    return (

        <>
            <div className="flex items-center gap-2" onMouseEnter={() => setCarouselAutoRun(false)} onMouseLeave={() => setCarouselAutoRun(true)}>
                <button tabIndex={0} className={`transition-all hover:text-markusRed focus:text-markusRed  ${hasPrevPage ? "opacity-40 hover:opacity-100" : "opacity-0 active:opacity-0 hover:opacity-0"} -ml-8`} onClick={() => prev()}><ChevronLeftCircle /></button>

                <ul className="flex flex-1 scrollbar-none scroll-smooth overflow-x-auto snap-x snap-mandatory gap-10" ref={scrollRef}>
                    <ProjectItem
                        index={1}
                        key={1}
                        snapPointIndexes={snapPointIndexes}
                        title={t("projects.1.title")}
                        subtitle={t("projects.1.subtitle")}
                        body={t("projects.1.description")}
                        imageUrl="projectImages/polaris.webp"
                        imageAlt={"projects.1.imageAlt "}
                    >
                        <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/polaris-sideoversikt"><GithubIcon /> {t("projects.1.buttons.github")}  </ExternalLinkButton>
                        <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://sidesjekk.markusevanger.no/"><FlaskConical /> {t("projects.1.buttons.demo")} </ExternalLinkButton>

                    </ProjectItem>

                    <ProjectItem
                        key={2}
                        snapPointIndexes={snapPointIndexes}
                        index={2}
                        title={t("projects.3.title")}
                        subtitle={t("projects.3.subtitle")}
                        body={t("projects.3.description")}
                        imageAlt={"projects.3.imageAlt "}
                        imageUrl="projectImages/pawcast.webp"
                    >
                        <ExternalLinkButton openInExternalBrowser={true} to="https://pawcast.markusevanger.no/assets/prosjektrapport-B536DxSL.pdf"><FileText /> {t("projects.3.buttons.report")}  </ExternalLinkButton>
                        <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/pawcast"><GithubIcon /> {t("projects.3.buttons.github")}  </ExternalLinkButton>
                        <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://pawcast.markusevanger.no/"><ExternalLink /> {t("projects.3.buttons.website")} </ExternalLinkButton>

                    </ProjectItem>

                    <ProjectItem
                        key={3}
                        snapPointIndexes={snapPointIndexes}
                        index={3}
                        title={t("projects.2.title")}
                        subtitle={t("projects.2.subtitle")}
                        body={t("projects.2.description")}
                        imageAlt={"projects.2.imageAlt "}
                        imageUrl="projectImages/karbon.webp"
                    >
                        <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/clearkarbonexchange_demo/"><GithubIcon /> {t("projects.2.buttons.github")}  </ExternalLinkButton>
                        <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://greenbay-demo.vercel.app/"><FlaskConical /> {t("projects.2.buttons.demo")} </ExternalLinkButton>
                    </ProjectItem>


                </ul>
                <button tabIndex={1} className={`transition-all  hover:text-markusRed focus:text-markusRed focus:opacity-100  ${hasNextPage ? "opacity-40 hover:opacity-100" : "opacity-0 active:opacity-0 hover:opacity-0"} -mr-8`} onClick={() => next()}><ChevronRightCircle /></button>
            </div>

            <div className="flex gap-1 justify-center mt-4">
                {Array.from({ length: snapPointIndexes.size }, (_, i) => (
                    <button onClick={() => goTo(i)} className={`transition-all rounded-full h-2 w-2 bg-markusRed  ${activePageIndex === i ? "scale-125 mx-1" : "opacity-40"}`} key={i}></button>
                ))}
            </div></>
    )
}