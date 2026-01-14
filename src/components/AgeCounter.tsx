'use client'

import { useState, useEffect } from 'react'

interface AgeCounterProps {
  birthDate: string
}

export default function AgeCounter({ birthDate }: AgeCounterProps) {
  const [age, setAge] = useState<string>('0.000000000')

  useEffect(() => {
    const birth = new Date(birthDate)

    const calculateAge = () => {
      const currentDate = new Date()
      const ageInMilliseconds = currentDate.getTime() - birth.getTime()
      const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000
      const preciseAge = (ageInMilliseconds / millisecondsInYear).toFixed(9)
      setAge(preciseAge)
    }

    calculateAge()
    const updateFrequency = setInterval(calculateAge, 100)
    return () => clearInterval(updateFrequency)
  }, [birthDate])

  return <>{age}</>
}
