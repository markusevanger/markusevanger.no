import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


function App() {

  const [t] = useTranslation("main")

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

  return (
    <div className="h-screen w-full flex flex-col gap-8 justify-center items-center">

      <div className="flex flex-col gap-2 items-center w-[350px]">

        <img src="markus2.webp" className="shadow-xl w-[206px] h-[347px] rounded-b-[33px] rounded-t-[100px] object-cover hover:scale-105 hover:outline outline-4 transition-all" ></img>

        <h1 className="mt-4 text-xl font-semibold">{t("hero.title")}</h1>
        <p className="text-center">
          {t("hero.description_1")} <span className="font-mono">{age}</span> {t("hero.description_2")}
        </p>
      </div>

      <div className="underline flex gap-2">
        <Link to="/cv"> CV </Link>
      </div>
    </div>
  );
}

export default App;
