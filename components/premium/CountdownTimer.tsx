"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: string // e.g., "2026-12-31T23:59:59"
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()
      let newTimeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }

      return newTimeLeft
    }

    // Set initial time
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatNumber = (num: number) => num.toString().padStart(2, "0")

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {/* Days */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-bindu-navy text-white flex items-center justify-center text-2xl md:text-5xl font-heading font-bold shadow-bindu">
          {formatNumber(timeLeft.days)}
        </div>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mt-4">Days</span>
      </div>

      <div className="text-bindu-navy text-2xl md:text-4xl font-bold pb-8">:</div>

      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-bindu-navy text-white flex items-center justify-center text-2xl md:text-5xl font-heading font-bold shadow-bindu">
          {formatNumber(timeLeft.hours)}
        </div>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mt-4">Hours</span>
      </div>

      <div className="text-bindu-navy text-2xl md:text-4xl font-bold pb-8">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-bindu-navy text-white flex items-center justify-center text-2xl md:text-5xl font-heading font-bold shadow-bindu">
          {formatNumber(timeLeft.minutes)}
        </div>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-bindu-text-muted mt-4">Mins</span>
      </div>

      <div className="text-bindu-navy text-2xl md:text-4xl font-bold pb-8">:</div>

      {/* Seconds */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-bindu-orange text-white flex items-center justify-center text-2xl md:text-5xl font-heading font-bold shadow-bindu">
          {formatNumber(timeLeft.seconds)}
        </div>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-bindu-orange mt-4">Secs</span>
      </div>
    </div>
  )
}
