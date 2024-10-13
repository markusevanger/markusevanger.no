import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ExternalLinkButton from "./componets/Button.tsx";
import WindowAnimation from "./componets/WindowAnimation.tsx";
import ProjectCarousel from "./componets/ProjectCarousel.tsx";

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

        <p className="text-center max-w-[350px]">
          {t("hero.description_1")} <span className="font-mono">{age}</span> {t("hero.description_2")}
        </p>

        <div className="flex flex-col gap-2 mt-8">

          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
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

          <ProjectCarousel></ProjectCarousel>

        </section>
      </div>
    </div>
  );
}



export default App;
