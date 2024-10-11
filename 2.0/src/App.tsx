import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"

import { Wing } from "./assets/wing.tsx"
import { Cloud_1 } from "./assets/Cloud_1.tsx"
import { Cloud_2 } from "./assets/Cloud_2.tsx"
import ExternalLinkButton from "./componets/Button.tsx";

function App() {

  const [t] = useTranslation("main") // used for language

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

        <div className="grid grid-rows-1 grid-cols-1 w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] overflow-hidden outline outline-red-600 outline-8">

          <div className="row-start-1 grid grid-rows-3 h-full w-full">

            <div className="">
              <motion.div className="" animate={{ x: [200, -200] }} transition={{ repeat: Infinity, duration: 13, repeatType: "loop", ease: "linear" }}>
                <Cloud_1 className={`scale-50 stroke-markusRed fill-white stroke-[8px]`}></Cloud_1>
              </motion.div>
            </div>

            <div className="">
              <motion.div animate={{ x: [200, -200] }} transition={{ repeat: Infinity, duration: 8, repeatType: "loop", ease: "linear" }}>
                <Cloud_2 className={`scale-75 fill-white stroke-markusRed stroke-[8px]`}></Cloud_2>
              </motion.div>
            </div>

            <div className="row-start-3">
              <motion.div animate={{ x: [200, -200] }} transition={{ repeat: Infinity, duration: 5, repeatType: "loop", ease: "linear" }}>
                <Cloud_2 className={`fill-white stroke-markusRed stroke-[8px]`}></Cloud_2>
              </motion.div>

              <motion.div animate={{ x: [200, -600] }} transition={{ repeat: Infinity, duration: 16, repeatType: "loop", ease: "linear" }}>
                <svg width="929" height="255" viewBox="0 0 929 255" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="translate-y-12 fill-markusRed scale-50" fill-rule="evenodd" clip-rule="evenodd" d="M420.099 75.95C493.511 11.6846 583.192 5.88436 671.19 32.1981C759.388 58.5717 844.971 117.041 908.013 179.588C911.346 182.895 916.728 182.874 920.034 179.541C923.34 176.209 923.319 170.827 919.987 167.52C855.529 103.568 767.612 43.2872 676.06 15.9107C584.308 -11.5255 487.989 -6.07566 408.901 63.1588C367.504 99.3988 321.077 121.978 277.873 130.745C234.561 139.534 195.217 134.333 167.12 116.14C132.232 93.5481 95.2664 106.465 66.3577 125.803C37.2557 145.27 13.453 172.995 2.54136 185.749C-0.51053 189.316 -0.0929356 194.681 3.47408 197.733C7.04109 200.785 12.4068 200.368 15.4587 196.801C26.4371 183.969 48.8844 157.944 75.8098 139.933C102.929 121.792 131.768 113.501 157.88 130.409C190.783 151.716 235.024 156.786 281.254 147.406C327.592 138.003 376.665 113.972 420.099 75.95ZM426.099 130.95C499.511 66.6846 589.192 60.8844 677.19 87.1981C765.388 113.572 850.971 172.041 914.013 234.588C917.346 237.895 922.728 237.874 926.034 234.541C929.34 231.209 929.319 225.827 925.987 222.52C861.529 158.568 773.612 98.2872 682.06 70.9107C590.308 43.4745 493.989 48.9243 414.901 118.159C373.504 154.399 327.077 176.978 283.873 185.745C240.561 194.534 201.217 189.333 173.12 171.14C138.232 148.548 101.266 161.465 72.3577 180.803C43.2557 200.27 19.453 227.995 8.54136 240.749C5.48947 244.316 5.90706 249.681 9.47408 252.733C13.0411 255.785 18.4068 255.368 21.4587 251.801C32.4371 238.969 54.8844 212.944 81.8098 194.933C108.929 176.792 137.768 168.501 163.88 185.409C196.783 206.716 241.024 211.786 287.254 202.406C333.592 193.003 382.665 168.972 426.099 130.95Z" />
                </svg>
              </motion.div>
            </div>


            <motion.div className="" animate={{ x: 5, y: 10 }} transition={{ repeat: Infinity, duration: 5, repeatType: "reverse" }}>
              <Wing className={`translate-x-10 translate-y-20 fill-white stroke-markusRed stroke-[8px]`}></Wing>
            </motion.div>

          </div>
        </div>



        <h1 className="mt-4 mb-1 transition-all text-xl font-bold">{t("hero.titleEmoji")} {t("hero.title")}</h1>

        <p className="text-center">
          {t("hero.description_1")} <span className="font-mono">{age}</span> {t("hero.description_2")}
        </p>

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


    </div>
  );
}



export default App;
