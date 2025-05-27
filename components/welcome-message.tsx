"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(true)

  // Auto-hide after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80 md:w-96"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
        }}
      >
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-2 py-1 flex justify-between items-center">
          <span className="text-sm font-bold">Welcome to Windows 98</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 min-w-5 text-white hover:bg-blue-700"
            onClick={() => setIsVisible(false)}
          >
            <X size={12} />
          </Button>
        </div>
        <div className="bg-gray-200 p-4 text-black">
          <div className="flex items-center mb-4">
            <div className="mr-4">
              <img
                src="/placeholder.svg?height=64&width=64"
                alt="Portfolio"
                className="border-2 border-gray-400 shadow-md"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome to My Portfolio!</h2>
              <p className="text-sm">Windows 98 Edition</p>
            </div>
          </div>

          <p className="mb-4">
            Thank you for visiting my interactive Windows 98 portfolio. Click on desktop icons or use the Start menu to
            explore.
          </p>

          <p className="mb-4">Don't miss out on playing Tetris - click on the Tetris icon to start playing!</p>

          <div className="flex justify-end">
            <Button
              className="win98-button bg-gray-300 text-black hover:bg-gray-200"
              onClick={() => setIsVisible(false)}
            >
              OK
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

