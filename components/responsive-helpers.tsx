"use client"

import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

export function useResponsiveLayout() {
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")

  // For SSR compatibility
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Default to desktop during SSR
  if (!mounted) {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      deviceType: "desktop",
    }
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
  }
}

export function getWindowSizeForDevice(deviceType: string, isMaximized: boolean) {
  switch (deviceType) {
    case "mobile":
      return {
        width: "100%",
        height: isMaximized ? "calc(100% - 40px)" : "90%",
        maxWidth: "100%",
        maxHeight: isMaximized ? "calc(100% - 40px)" : "90vh",
      }
    case "tablet":
      return {
        width: isMaximized ? "100%" : "90%",
        height: isMaximized ? "calc(100% - 40px)" : "80%",
        maxWidth: isMaximized ? "100%" : "90%",
        maxHeight: isMaximized ? "calc(100% - 40px)" : "80vh",
      }
    default: // desktop
      return {
        width: isMaximized ? "100%" : "80%",
        height: isMaximized ? "calc(100% - 40px)" : "70%",
        maxWidth: isMaximized ? "100%" : "800px",
        maxHeight: isMaximized ? "calc(100% - 40px)" : "600px",
      }
  }
}

