import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { animate, motion } from "framer-motion"

import { Wing } from "./assets/wing.tsx"
import { Cloud_1 } from "./assets/Cloud_1.tsx"
import { Cloud_2 } from "./assets/Cloud_2.tsx"
import ExternalLinkButton from "./componets/Button.tsx";
import { Mail } from "lucide-react";


function App() {

  const [t] = useTranslation("main") // used for language
  const redColor = "red-600"

  const [age, setAge] = useState<string>("0.00000000"); // Store the age as a string to keep consistent formatting
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

    // Update the age every 10 milliseconds
    const intervalId = setInterval(calculateAge, 100);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


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
    <div className="h-screen w-full flex flex-col gap-8 justify-center items-center">

      <div className="flex flex-col gap-2 items-center w-[350px]">

        <motion.div className="grid grid-rows-1 grid-cols-1 w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] overflow-hidden outline outline-red-600 outline-8">

          <div className="row-start-1 grid grid-rows-3 w-full">

            <div>
              <motion.div className="row-start-1 flex" animate={{ x: [200, -200] }} transition={{ repeat: Infinity, duration: 13, repeatType: "loop", ease: "linear" }}>
                <Cloud_1 className={`scale-50 stroke-markusRed fill-white stroke-[8px]`}></Cloud_1>
              </motion.div>
            </div>

            <div>
              <motion.div animate={{ x: [200, -200] }} transition={{ repeat: Infinity, duration: 8, repeatType: "loop", ease: "linear" }}>
                <Cloud_2 className={`scale-75 translate fill-white stroke-markusRed stroke-[8px]`}></Cloud_2>
              </motion.div>
            </div>

            <div>
              <motion.div animate={{ x: [200, -200] }} transition={{ repeat: Infinity, duration: 5, repeatType: "loop", ease: "linear" }}>
                <Cloud_2 className={`translate fill-white stroke-markusRed stroke-[8px]`}></Cloud_2>
              </motion.div>
            </div>


            <motion.div className="row-start-1" animate={{ x: 5, y: 10 }} transition={{ repeat: Infinity, duration: 5, repeatType: "reverse" }}>
              <Wing className={`translate-x-10 translate-y-20 fill-white stroke-markusRed stroke-[8px]`}></Wing>
            </motion.div>

          </div>
        </motion.div>



        <h1 className="mt-4 text-xl font-semibold">{t("hero.titleEmoji")} {t("hero.title")}</h1>
        <p className="text-center">
          {t("hero.description_1")} <span className="font-mono">{age}</span> {t("hero.description_2")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Link to="/cv">
          <ExternalLinkButton type="primary">
            CV
          </ExternalLinkButton>
        </Link>

        <div onClick={copyMail} className="cursor-pointer">
          markusevanger@gmail.com
        </div>

        {

          <div className={`w-full text-center bg-slate-200 rounded-md transition-all ${emailCopiedBadge ? "opacity-100" : "opacity-0"}`}>
            Kopiert! 💖
          </div>
        }
        
      </div>
    </div>
  );
}



export default App;
