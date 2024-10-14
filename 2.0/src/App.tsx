import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ExternalLinkButton from "./componets/Button.tsx";
import WindowAnimation from "./componets/WindowAnimation.tsx";
import ProjectCarousel from "./componets/ProjectCarousel.tsx";
import ProjectItemSmall from "./componets/ProjectItemSmall.tsx";
import { motion } from "framer-motion";

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
    <div className="py-10 px-3 w-full overflow-x-hidden flex items-center flex-col ">
      <div className="flex flex-col gap-2 items-center w-full max-w-[610px]">


        <WindowAnimation></WindowAnimation>

        <h1 className="mt-4 mb-1 transition-all text-markusRed text-4xl font-[Mogi]"> {t("hero.title")}</h1>

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
          {

            <div className={`w-full text-center bg-slate-200 rounded-md transition-all ${emailCopiedBadge ? "opacity-100" : "opacity-0"}`}>
              Kopiert! 💖
            </div>
          }

        </div>

        <section id="portfolio" className="w-full  flex-col justify-center mt-28">

          <div>
            <h2 className="font-bold font-[Mogi] text-markusRed text-3xl mb-2">Det fresheste</h2>
            <ProjectCarousel></ProjectCarousel>
          </div>

          <div className="rounded-lg mt-8 p-2">
            <h2 className="text-2xl font-[Mogi] text-markusRed">Andre prosjekter</h2>

            <div className="flex flex-col gap-3 mt-3">
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
              <ProjectItemSmall title="Nuovo" desc="Grafisk Design" link=""></ProjectItemSmall>
            </div>

            <p className="flex gap-3 items-center mt-3">
              For mer, sjekk ut min<ExternalLinkButton to="/cv">CV!</ExternalLinkButton>
            </p>

          </div>
        </section>

        <section className="mt-24 gap-4 text-center flex flex-col items-center">

          <p>Kontakt meg på <span onClick={copyMail} className="cursor-pointer underline"> mail</span>, eller hvor det passer deg</p>
          <p>Bygget av Markus {"<3"}</p>

          <motion.div whileHover={{
            rotateZ: 360,
            transition: { duration: 1 },
            repeatCount: 

          }}
            whileTap={{ scale: 0.9 }} className="w-fit">
            <svg className="fill-markusRed h-10" viewBox="0 0 64 57" xmlns="http://www.w3.org/2000/svg">
              <path d="M62.03 25.75C60.3151 27.6208 57.3645 27.7737 55.32 26.36C58.3611 41.9606 51.8603 56.75 35.03 56.75C18.9009 56.75 10.8421 41.3374 10.32 26.98C7.95903 29.3032 4.79725 30.9883 1.85001 28.27C-3.02641 23.7916 4.21946 18.5405 7.15001 15.61C4.68366 12.0475 -1.39513 5.35043 4.19001 1.75999C9.00799 -1.36519 12.3175 4.9868 14.55 8.18999C17.7299 4.95528 22.6122 -1.87248 27.35 2.47999C32.1691 6.90567 25.0912 12.2087 22.19 15.16C26.1089 16.8116 33.0007 19.3411 30.03 24.95C27.8912 28.9861 23.7062 27.1573 20.61 25.58C20.7161 34.5405 23.8335 46.3555 34.71 46.43C46.2136 46.43 46.4662 35.7348 44.93 27.03C42.8619 29.0981 39.6791 29.4461 37.43 27.38C32.8329 23.1582 39.4744 17.9756 42.33 15.12C39.4117 12.0333 33.5238 7.45266 37.66 2.96999C41.9158 -1.71137 46.6949 4.74529 49.62 7.82999C52.6383 4.81167 57.0336 -1.25253 61.63 2.96999C66.258 7.22022 60.0308 12.0092 57.17 14.87C60.708 17.3687 66.0878 21.3505 62.03 25.75Z" />
            </svg>

          </motion.div>
        </section>
      </div>
    </div>
  );
}



export default App;


