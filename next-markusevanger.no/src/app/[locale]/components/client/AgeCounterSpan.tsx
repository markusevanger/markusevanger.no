"use client"

import { useState, useEffect } from "react";

export default function AgeCounterSpan() {

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


    return <span className="text-markusRed">{age}</span>
}


