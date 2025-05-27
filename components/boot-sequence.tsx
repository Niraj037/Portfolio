"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import WindowsLogo from "./windows-logo"
import { useSettings } from "@/hooks/use-settings"

interface BootSequenceProps {
  onComplete: () => void
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showLogo, setShowLogo] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { settings } = useSettings()

  // Boot sequence stages
  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio("/windows98-startup.mp3")

    // Stage 0: BIOS screen
    setTimeout(() => {
      setStage(1) // Move to POST screen
    }, 2000)

    // Stage 1: POST screen
    setTimeout(() => {
      setStage(2) // Move to Windows 98 logo
      setShowLogo(true)

      // Play startup sound if enabled in settings
      if (settings.enableMusic) {
        audioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
      }

      // Progress bar animation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)

            // Wait a bit after progress completes
            setTimeout(() => {
              onComplete() // Boot sequence complete
            }, 1500)

            return 100
          }
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    }, 3000)
  }, [onComplete, settings.enableMusic])

  // BIOS screen
  if (stage === 0) {
    return (
      <div className="h-screen w-screen bg-black text-white font-mono p-8 flex flex-col">
        <div className="text-xl mb-6">Windows 98 Portfolio BIOS</div>
        <div className="mb-2">CPU: Portfolio Processor</div>
        <div className="mb-2">Memory Test: 640K OK</div>
        <div className="mb-4">Initializing Portfolio Components...</div>
        <div className="text-gray-400 mt-auto">Press DEL to enter SETUP</div>
      </div>
    )
  }

  // POST screen
  if (stage === 1) {
    return (
      <div className="h-screen w-screen bg-black text-white font-mono p-8">
        <div className="mb-4">Verifying DMI Pool Data............</div>
        <div className="mb-4">Boot from Hard Disk...</div>
        <div className="mb-4">Loading Portfolio OS...</div>
      </div>
    )
  }

  // Windows 98 boot screen
  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
      {showLogo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center mb-8">
            <WindowsLogo className="h-24 w-24" />
            <div className="text-white text-4xl font-bold ml-4">
              Windows<span className="text-2xl align-super">98</span>
            </div>
          </div>

          <div className="w-64 h-4 bg-gray-800 border border-gray-600 relative">
            <div className="h-full bg-blue-600" style={{ width: `${progress}%` }}></div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

