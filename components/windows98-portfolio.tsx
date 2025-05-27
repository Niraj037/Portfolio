"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  User,
  Briefcase,
  Code,
  Mail,
  FileText,
  X,
  Minus,
  Square,
  Volume2,
  Gamepad2,
  Settings,
  HelpCircle,
  Music,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AboutWindow from "./windows/about-window"
import ProjectsWindow from "./windows/projects-window"
import SkillsWindow from "./windows/skills-window"
import ContactWindow from "./windows/contact-window"
import ResumeWindow from "./windows/resume-window"
import TetrisWindow from "./windows/tetris-window"
import SettingsWindow from "./windows/settings-window"
import HelpWindow from "./windows/help-window"
import MusicPlayerWindow from "./windows/music-player-window"
import StartMenu from "./start-menu"
import DesktopIcon from "./desktop-icon"
import Clock from "./clock"
import WindowsLogo from "./windows-logo"
import BootSequence from "./boot-sequence"
import { useResponsiveLayout, getWindowSizeForDevice } from "./responsive-helpers"
import { useSettings } from "@/hooks/use-settings"
import MyComputer from "./desktop-icons/my-computer"
import NetworkNeighborhood from "./desktop-icons/network-neighborhood"
import RecycleBin from "./desktop-icons/recycle-bin"
import InternetExplorer from "./desktop-icons/internet-explorer"
import TaskbarTetrisButton from "./taskbar-tetris-button"
import TaskbarMusicButton from "./taskbar-music-button"

// Desktop icons configuration
const desktopIcons = [
  { id: "music-player", label: "Music Player", icon: <Music size={24} />, position: { x: 20, y: 20 } },
  { id: "tetris", label: "Tetris", icon: <Gamepad2 size={24} />, position: { x: 20, y: 100 } },
  { id: "my-computer", label: "My Computer", icon: <MyComputer />, position: { x: 20, y: 180 } },
  { id: "network", label: "Network", icon: <NetworkNeighborhood />, position: { x: 20, y: 260 } },
  { id: "internet", label: "Internet", icon: <InternetExplorer />, position: { x: 20, y: 340 } },
  { id: "recycle", label: "Recycle Bin", icon: <RecycleBin />, position: { x: 20, y: 420 } },
  { id: "about", label: "About Me", icon: <User size={24} />, position: { x: 20, y: 500 } },
  { id: "projects", label: "Projects", icon: <Briefcase size={24} />, position: { x: 20, y: 580 } },
  { id: "skills", label: "Skills", icon: <Code size={24} />, position: { x: 20, y: 660 } },
  { id: "contact", label: "Contact", icon: <Mail size={24} />, position: { x: 20, y: 740 } },
  { id: "resume", label: "Resume", icon: <FileText size={24} />, position: { x: 20, y: 820 } },
  { id: "settings", label: "Settings", icon: <Settings size={24} />, position: { x: 20, y: 900 } },
  { id: "help", label: "Help", icon: <HelpCircle size={24} />, position: { x: 20, y: 980 } },
]

// Window types and their components
const windowComponents: Record<string, any> = {
  about: AboutWindow,
  projects: ProjectsWindow,
  skills: SkillsWindow,
  contact: ContactWindow,
  resume: ResumeWindow,
  tetris: TetrisWindow,
  settings: SettingsWindow,
  help: HelpWindow,
  "music-player": MusicPlayerWindow,
  "my-computer": AboutWindow, // Reuse about window for now
  network: ProjectsWindow, // Reuse projects window for now
  internet: SkillsWindow, // Reuse skills window for now
  recycle: ContactWindow, // Reuse contact window for now
}

export default function Windows98Portfolio() {
  // Boot sequence state
  const [booting, setBooting] = useState(true)

  // State for managing windows
  const [openWindows, setOpenWindows] = useState<string[]>([])
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({})
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [maximizedWindows, setMaximizedWindows] = useState<Record<string, boolean>>({})
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([])
  const [highestZIndex, setHighestZIndex] = useState(10)
  const [showBsod, setShowBsod] = useState(false)

  // Settings
  const { settings } = useSettings()

  // Responsive layout
  const { isMobile, isTablet, deviceType } = useResponsiveLayout()

  // Refs
  const desktopRef = useRef<HTMLDivElement>(null)
  const dragStartPositionRef = useRef<{ x: number; y: number } | null>(null)
  const windowRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const errorAudioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize window positions with slight offsets for a cascading effect
  useEffect(() => {
    const initialPositions: Record<string, { x: number; y: number }> = {}
    desktopIcons.forEach((icon, index) => {
      initialPositions[icon.id] = {
        x: 100 + index * 20,
        y: 80 + index * 20,
      }
    })
    setWindowPositions(initialPositions)

    // Initialize audio
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/windows98-startup.mp3")
      errorAudioRef.current = new Audio("/windows-error.mp3")
    }
  }, [])

  // Auto-adjust window positions for mobile
  useEffect(() => {
    if (isMobile) {
      // On mobile, maximize all windows by default
      const newMaximized: Record<string, boolean> = {}
      openWindows.forEach((id) => {
        newMaximized[id] = true
      })
      setMaximizedWindows(newMaximized)
    }
  }, [isMobile, openWindows])

  // Handle window opening
  const openWindow = (id: string) => {
    // Special case for help window - redirect to contact
    if (id === "help") {
      if (!openWindows.includes("contact")) {
        setOpenWindows((prev) => [...prev, "contact"])
      }
      if (minimizedWindows.includes("contact")) {
        setMinimizedWindows((prev) => prev.filter((winId) => winId !== "contact"))
      }
      activateWindow("contact")
      setIsStartMenuOpen(false)
      return
    }

    if (!openWindows.includes(id)) {
      setOpenWindows((prev) => [...prev, id])

      // On mobile, automatically maximize new windows
      if (isMobile) {
        setMaximizedWindows((prev) => ({
          ...prev,
          [id]: true,
        }))
      }
    }

    if (minimizedWindows.includes(id)) {
      setMinimizedWindows((prev) => prev.filter((winId) => winId !== id))
    }

    activateWindow(id)
    setIsStartMenuOpen(false)
  }

  // Handle window closing
  const closeWindow = (id: string) => {
    setOpenWindows((prev) => prev.filter((winId) => winId !== id))
    if (activeWindow === id) {
      setActiveWindow(null)
    }

    // If this window was maximized, remove it from maximized state
    if (maximizedWindows[id]) {
      setMaximizedWindows((prev) => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
    }

    // Play error sound occasionally as an easter egg
    if (settings.enableMusic && Math.random() > 0.7) {
      errorAudioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
    }
  }

  // Handle window minimizing
  const minimizeWindow = (id: string) => {
    setMinimizedWindows((prev) => [...prev, id])
  }

  // Handle window maximizing/restoring
  const toggleMaximize = (id: string) => {
    setMaximizedWindows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Activate window (bring to front)
  const activateWindow = (id: string) => {
    setActiveWindow(id)
    const newZIndex = highestZIndex + 1
    setWindowZIndices((prev) => ({
      ...prev,
      [id]: newZIndex,
    }))
    setHighestZIndex(newZIndex)
  }

  // Handle window dragging
  const startDragging = (e: React.MouseEvent, id: string) => {
    if (maximizedWindows[id] || isMobile) return

    activateWindow(id)
    const windowElement = windowRefs.current[id]
    if (windowElement) {
      const rect = windowElement.getBoundingClientRect()
      dragStartPositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const onDrag = (e: React.MouseEvent, id: string) => {
    if (maximizedWindows[id] || !dragStartPositionRef.current || isMobile) return

    const startPos = dragStartPositionRef.current
    const newX = e.clientX - startPos.x
    const newY = e.clientY - startPos.y

    setWindowPositions((prev) => ({
      ...prev,
      [id]: { x: newX, y: newY },
    }))
  }

  const stopDragging = () => {
    dragStartPositionRef.current = null
  }

  // Toggle start menu
  const toggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev)
  }

  // Handle clicks outside of windows to close start menu
  const handleDesktopClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the desktop, not on windows or icons
    if (e.target === desktopRef.current) {
      setIsStartMenuOpen(false)
    }
  }

  // Blue Screen of Death Easter Egg
  const triggerBsod = () => {
    setShowBsod(true)

    // Play error sound for BSOD
    if (settings.enableMusic) {
      errorAudioRef.current?.play().catch((e) => console.log("Audio playback prevented:", e))
    }

    setTimeout(() => {
      setShowBsod(false)
    }, 5000)
  }

  // Handle boot sequence completion
  const handleBootComplete = () => {
    setBooting(false)
    // Removed auto-open Tetris code that was causing key duplication
  }

  // Show boot sequence
  if (booting) {
    return <BootSequence onComplete={handleBootComplete} />
  }

  // Show BSOD
  if (showBsod) {
    return (
      <div className="h-screen w-screen bg-blue-700 text-white p-8 font-mono">
        <h1 className="text-2xl mb-4">Windows</h1>
        <p className="mb-4">A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
        <p className="mb-4">The current application will be terminated.</p>
        <p className="mb-4">* Press any key to terminate the current application.</p>
        <p className="mb-4">
          * Press CTRL+ALT+DEL to restart your computer. You will lose any unsaved information in all applications.
        </p>
        <button className="mt-8 px-4 py-2 bg-gray-200 text-blue-700 font-bold" onClick={() => setShowBsod(false)}>
          OK
        </button>
      </div>
    )
  }

  // Get wallpaper color based on settings
  const getWallpaperColor = () => {
    switch (settings.wallpaper) {
      case "blue":
        return "bg-blue-800"
      case "green":
        return "bg-green-700"
      default:
        return "bg-teal-600"
    }
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden font-ms-sans">
      {/* Desktop background */}
      <div
        ref={desktopRef}
        className={`absolute inset-0 overflow-hidden ${getWallpaperColor()}`}
        onClick={handleDesktopClick}
      >
        <div className="win98-desktop-pattern"></div>
        {/* Desktop icons - hide on very small screens */}
        <div
          className={`absolute top-4 left-4 grid grid-cols-1 ${
            deviceType === "mobile" ? "gap-4 hidden sm:block" : deviceType === "tablet" ? "gap-6" : "gap-8"
          }`}
        >
          {desktopIcons.map((icon) => (
            <DesktopIcon key={icon.id} icon={icon.icon} label={icon.label} onClick={() => openWindow(icon.id)} />
          ))}
        </div>

        {/* Windows */}
        <AnimatePresence>
          {openWindows.map((id) => {
            if (minimizedWindows.includes(id)) return null

            const WindowComponent = windowComponents[id]
            const position = windowPositions[id] || { x: 100, y: 100 }
            const zIndex = windowZIndices[id] || 10
            const isMaximized = maximizedWindows[id] || false

            // Get window size based on device type
            const windowSize = getWindowSizeForDevice(deviceType, isMaximized)

            // Special props for help window
            const windowProps = id === "help" ? { onRedirect: () => openWindow("contact") } : {}

            return (
              <motion.div
                key={id}
                ref={(el) => (windowRefs.current[id] = el)}
                className={`absolute rounded-none shadow-xl overflow-hidden ${activeWindow === id ? "ring-1 ring-blue-500" : ""}`}
                style={{
                  left: isMaximized ? 0 : position.x,
                  top: isMaximized ? 0 : position.y,
                  width: windowSize.width,
                  height: windowSize.height,
                  maxWidth: windowSize.maxWidth,
                  maxHeight: windowSize.maxHeight,
                  zIndex,
                  // Windows 98 style border
                  boxShadow:
                    "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => activateWindow(id)}
              >
                {/* Window title bar */}
                <div
                  className={`flex items-center justify-between px-2 py-1 ${activeWindow === id ? "bg-gradient-to-r from-blue-800 to-blue-600" : "bg-gray-700"} text-white`}
                  onMouseDown={(e) => startDragging(e, id)}
                  onMouseMove={(e) => onDrag(e, id)}
                  onMouseUp={stopDragging}
                  onMouseLeave={stopDragging}
                  onTouchStart={(e) => e.stopPropagation()} // Prevent dragging on mobile
                >
                  <div className="flex items-center gap-2 text-sm font-bold">
                    {WindowComponent.icon}
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 min-w-5 text-white hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        minimizeWindow(id)
                      }}
                    >
                      <Minus size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 min-w-5 text-white hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMaximize(id)
                      }}
                    >
                      <Square size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 min-w-5 text-white hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        closeWindow(id)
                      }}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>

                {/* Window content */}
                <div className="bg-gray-200 h-full overflow-auto win98-scrollbar text-black">
                  <WindowComponent {...windowProps} />
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Taskbar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gray-300 flex items-center px-1 z-50 ${
          deviceType === "mobile" ? "h-8" : "h-10"
        }`}
        style={{
          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
        }}
      >
        {/* Start button */}
        <Button
          variant="outline"
          className={`rounded-none bg-gray-300 hover:bg-gray-200 text-black font-bold flex items-center gap-1 mr-1 ${
            deviceType === "mobile" ? "h-6" : "h-8"
          }`}
          style={{
            boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
          }}
          onClick={toggleStartMenu}
        >
          <WindowsLogo className="h-4 w-4" />
          <span className={isMobile ? "sr-only" : ""}>Start</span>
        </Button>

        {/* Open windows in taskbar */}
        <div className="flex-1 flex items-center gap-1 px-1 overflow-x-auto scrollbar-hide">
          {openWindows.map((id) => (
            <Button
              key={id}
              variant="outline"
              className={`h-7 rounded-none text-black text-xs flex items-center gap-1 px-2 truncate ${activeWindow === id && !minimizedWindows.includes(id) ? "bg-gray-400" : "bg-gray-300"}`}
              style={{
                boxShadow:
                  activeWindow === id && !minimizedWindows.includes(id)
                    ? "inset -1px -1px #dfdfdf, inset 1px 1px #0a0a0a, inset -2px -2px white, inset 2px 2px grey"
                    : "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
              }}
              onClick={() => {
                if (minimizedWindows.includes(id)) {
                  setMinimizedWindows((prev) => prev.filter((winId) => winId !== id))
                }
                activateWindow(id)
              }}
            >
              {windowComponents[id].icon}
              <span className={`truncate ${isMobile ? "max-w-[60px]" : "max-w-[100px]"}`}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </span>
            </Button>
          ))}
        </div>

        {/* Tetris Quick Access Button */}
        <TaskbarTetrisButton
          onClick={() => {
            if (openWindows.includes("tetris")) {
              if (minimizedWindows.includes("tetris")) {
                setMinimizedWindows((prev) => prev.filter((id) => id !== "tetris"))
              }
              activateWindow("tetris")
            } else {
              openWindow("tetris")
            }
          }}
          isActive={activeWindow === "tetris" && !minimizedWindows.includes("tetris")}
        />

        {/* Music Player Quick Access Button */}
        <TaskbarMusicButton
          onClick={() => {
            if (openWindows.includes("music-player")) {
              if (minimizedWindows.includes("music-player")) {
                setMinimizedWindows((prev) => prev.filter((id) => id !== "music-player"))
              }
              activateWindow("music-player")
            } else {
              openWindow("music-player")
            }
          }}
          isActive={activeWindow === "music-player" && !minimizedWindows.includes("music-player")}
        />

        {/* System tray */}
        <div className="flex items-center gap-2 px-2 border-l border-gray-400">
          <Volume2
            size={16}
            className={`${settings.enableMusic ? "text-gray-700" : "text-gray-400"}`}
            onClick={() => openWindow("settings")}
          />
          <div className="cursor-pointer" onClick={triggerBsod} title="Click for a surprise">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="14" height="14" fill="#C0C0C0" stroke="#808080" />
              <rect x="4" y="4" width="8" height="8" fill="#FF0000" />
            </svg>
          </div>
          <Clock />
        </div>
      </div>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartMenuOpen && (
          <StartMenu
            onItemClick={(id) => {
              if (id === "github") {
                window.open("https://github.com/Niraj037", "_blank")
              } else if (id === "linkedin") {
                window.open("https://linkedin.com/in/niraj-bhakta-3857a4324/", "_blank")
              } else if (id === "shutdown") {
                // Easter egg: reload the page
                window.location.reload()
              } else {
                openWindow(id)
              }
            }}
            onClose={() => setIsStartMenuOpen(false)}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Add static properties for window components
AboutWindow.icon = <User size={14} />
ProjectsWindow.icon = <Briefcase size={14} />
SkillsWindow.icon = <Code size={14} />
ContactWindow.icon = <Mail size={14} />
ResumeWindow.icon = <FileText size={14} />
TetrisWindow.icon = <Gamepad2 size={14} />
SettingsWindow.icon = <Settings size={14} />
HelpWindow.icon = <HelpCircle size={14} />
MusicPlayerWindow.icon = <Music size={14} />

