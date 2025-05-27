"use client"

import { useState, useEffect } from "react"

export default function Clock() {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
      setTime(`${formattedHours}:${formattedMinutes} ${ampm}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="text-xs font-medium bg-white px-2 py-1"
      style={{
        boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a, inset -2px -2px white, inset 2px 2px grey",
      }}
    >
      {time}
    </div>
  )
}

