"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useResponsiveLayout } from "./responsive-helpers"

interface DesktopIconProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

export default function DesktopIcon({ icon, label, onClick }: DesktopIconProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { deviceType } = useResponsiveLayout()

  return (
    <motion.div
      className={`flex flex-col items-center cursor-pointer group ${
        deviceType === "mobile" ? "w-16" : deviceType === "tablet" ? "w-18" : "w-20"
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className={`flex items-center justify-center bg-white mb-1 ${isHovered ? "border-blue-500" : ""} ${
          deviceType === "mobile" ? "w-10 h-10" : "w-12 h-12"
        }`}
        style={{
          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
        }}
      >
        {icon}
      </div>
      <div
        className={`text-center px-1 py-0.5 font-medium ${isHovered ? "bg-blue-700 text-white" : "text-white"} ${
          deviceType === "mobile" ? "text-xs" : "text-sm"
        }`}
      >
        {label}
      </div>
    </motion.div>
  )
}

