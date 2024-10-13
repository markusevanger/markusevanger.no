import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import ExternalLinkButton from "./componets/Button.tsx";
import ProjectItem from "./componets/ProjectItem.tsx";
import { useSnapCarousel } from "react-snap-carousel";
import { ChevronLeftCircle, ChevronRightCircle, ExternalLink, FileText, FlaskConical, GithubIcon } from "lucide-react";
import WindowAnimation from "./componets/WindowAnimation.tsx";

function App() {

  const [t] = useTranslation("main") // used for language

  const [age, setAge] = useState<string>("0.00000000"); // Store the age as a string to keep consistent formatting

  // UseEffect for age updating
  useEffect(() => {
    const birthDate: Date = new Date("2003-08-28");

    // Function to calculate age with 8 decimal precision
    const calculateAge = () => {
      const currentDate: Date = new Date();
      const ageInMilliseconds: number = currentDate.getTime() - birthDate.getTime();
      const millisecondsInYear: number = 365.25 * 24 * 60 * 60 * 1000;
      const preciseAge: string = (ageInMilliseconds / millisecondsInYear).toFixed(9); // Keep the value as a formatted string
      setAge(preciseAge);
    };

    // Update the age every 100 milliseconds
    const updateFrequency = setInterval(calculateAge, 100);
    return () => clearInterval(updateFrequency);
  }, []);

  const { scrollRef, snapPointIndexes, prev, next, goTo, activePageIndex, hasNextPage, hasPrevPage } = useSnapCarousel();

  useEffect(() => {
    const updateCarousel = () => {
      goTo((activePageIndex + 1) % snapPointIndexes.size); // Directly use activePageIndex
    };
    const updateFrequency = setInterval(updateCarousel, 2000);

    return () => clearInterval(updateFrequency);
  }, [activePageIndex, snapPointIndexes]); // Dependencies: effect reruns when activePageIndex or snapPointIndexes change


  // useEffect for autoScroll
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
    <div className="py-10 w-full overflow-x-hidden flex flex-col gap-8 justify-center items-center scroll-smooth">
      <div className="flex flex-col gap-2 items-center w-full max-w-[610px]">


        <WindowAnimation></WindowAnimation>


        <h1 className="mt-4 mb-1 transition-all text-xl font-bold">{t("hero.titleEmoji")} {t("hero.title")}</h1>

        <p className="text-center">
          {t("hero.description_1")} <span className="font-mono">{age}</span> {t("hero.description_2")}
        </p>

        <div className="flex flex-col gap-2">

          <div className="w-full flex flex-col md:flex-row justify-center gap-2">

            <ExternalLinkButton to="cv" type="default">
              CV
            </ExternalLinkButton>

            <a href="#portfolio">
              Portefølje
            </a>


          </div>

          <div onClick={copyMail} className="cursor-pointer">
            markusevanger@gmail.com
          </div>

          {

            <div className={`w-full text-center bg-slate-200 rounded-md transition-all ${emailCopiedBadge ? "opacity-100" : "opacity-0"}`}>
              Kopiert! 💖
            </div>
          }

        </div>

        <section id="portfolio" className="w-full flex-col justify-center mt-40">
          <h2 className="text-center font-bold text-lg mb-2">📦 Prosjekter</h2>
          <div className="flex items-center gap-2">
            <button className={`transition-all hover:opacity-100 hover:text-markusRed focus:text-markusRed focus:opacity-100  ${hasPrevPage ? "opacity-40 hover:opacity-100" : "invisible"}`} onClick={() => prev()}><ChevronLeftCircle /></button>

            <ul className="flex scrollbar-none scroll-smooth overflow-x-auto snap-x snap-mandatory gap-10" ref={scrollRef}>
              <ProjectItem
                index={1}
                key={1}
                snapPointIndexes={snapPointIndexes}
                title={t("projects.1.title")}
                subtitle={t("projects.1.subtitle")}
                body={t("projects.1.description")}
                imageUrl="projectImages/polaris.webp"
              >
                <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/polaris-sideoversikt"><GithubIcon /> {t("projects.1.buttons.github")}  </ExternalLinkButton>
                <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://sidesjekk.markusevanger.no/"><FlaskConical /> {t("projects.1.buttons.demo")} </ExternalLinkButton>

              </ProjectItem>

              <ProjectItem
                key={2}
                snapPointIndexes={snapPointIndexes}
                index={2}
                title={t("projects.2.title")}
                subtitle={t("projects.2.subtitle")}
                body={t("projects.2.description")}
                imageUrl="projectImages/karbon.webp"
              >
                <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/polaris-sideoversikt"><GithubIcon /> {t("projects.2.buttons.github")}  </ExternalLinkButton>
                <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://sidesjekk.markusevanger.no/"><FlaskConical /> {t("projects.2.buttons.demo")} </ExternalLinkButton>
              </ProjectItem>

              <ProjectItem
                key={3}
                snapPointIndexes={snapPointIndexes}
                index={3}
                title={t("projects.3.title")}
                subtitle={t("projects.3.subtitle")}
                body={t("projects.3.description")}
                imageUrl="projectImages/pawcast.webp"
              >
                <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/polaris-sideoversikt"><FileText /> {t("projects.3.buttons.report")}  </ExternalLinkButton>
                <ExternalLinkButton openInExternalBrowser={true} to="https://github.com/markusevanger/polaris-sideoversikt"><GithubIcon /> {t("projects.3.buttons.github")}  </ExternalLinkButton>
                <ExternalLinkButton type="primary" openInExternalBrowser={true} to="https://sidesjekk.markusevanger.no/"><ExternalLink /> {t("projects.3.buttons.website")} </ExternalLinkButton>

              </ProjectItem>
            </ul>
            <button className={`transition-all  hover:text-markusRed focus:text-markusRed focus:opacity-100  ${hasNextPage ? "opacity-40 hover:opacity-100" : "opacity-0  hover:opacity-0"}`} onClick={() => next()}><ChevronRightCircle /></button>

          </div>

          <div className="flex gap-1 justify-center mt-4">
            {Array.from({ length: snapPointIndexes.size }, (_, i) => (
              <button onClick={() => goTo(i)} className={`transition-all rounded-full h-2 w-2 bg-markusRed  ${activePageIndex === i ? "scale-125 mx-1" : "opacity-40"}`} key={i}></button>
            ))}
          </div>

        </section>
      </div>
    </div>
  );
}



export default App;
