"use client"

import { motion } from "framer-motion"
import {
  User,
  Briefcase,
  Code,
  Mail,
  FileText,
  Github,
  Linkedin,
  Settings,
  HelpCircle,
  LogOut,
  Gamepad2,
  Music,
} from "lucide-react"
import WindowsLogo from "./windows-logo"
import { useResponsiveLayout } from "./responsive-helpers"

interface StartMenuProps {
  onItemClick: (id: string) => void
  onClose: () => void
  isMobile?: boolean
}

export default function StartMenu({ onItemClick, onClose, isMobile = false }: StartMenuProps) {
  const { deviceType } = useResponsiveLayout()
  const isCompact = deviceType === "mobile" || isMobile

  // Update the menuItems array to include the Music Player
  const menuItems = [
    { id: "music-player", label: "Music Player", icon: <Music size={20} /> },
    { id: "tetris", label: "Tetris", icon: <Gamepad2 size={20} /> },
    { id: "about", label: "About Me", icon: <User size={20} /> },
    { id: "projects", label: "Projects", icon: <Briefcase size={20} /> },
    { id: "skills", label: "Skills", icon: <Code size={20} /> },
    { id: "contact", label: "Contact", icon: <Mail size={20} /> },
    { id: "resume", label: "Resume", icon: <FileText size={20} /> },
    { id: "divider1", type: "divider" },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    { id: "help", label: "Help", icon: <HelpCircle size={20} /> },
    { id: "divider2", type: "divider" },
    { id: "github", label: "GitHub", icon: <Github size={20} /> },
    { id: "linkedin", label: "LinkedIn", icon: <Linkedin size={20} /> },
    { id: "divider3", type: "divider" },
    { id: "shutdown", label: "Shut Down...", icon: <LogOut size={20} /> },
  ]

  return (
    <motion.div
      className={`absolute bottom-10 left-0 bg-gray-300 shadow-lg z-50 ${isCompact ? "w-48" : "w-64"}`}
      style={{
        boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Start menu header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 h-10 flex items-center px-4">
        <div className="text-white font-bold text-lg flex items-center">
          <WindowsLogo className="h-5 w-5 mr-2" />
          <span>Windows 98</span>
        </div>
      </div>

      {/* Start menu items */}
      <div className="p-1">
        {menuItems.map((item) => {
          if (item.type === "divider") {
            return <div key={item.id} className="border-t border-gray-400 my-1" />
          }

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 px-3 py-1.5 hover:bg-blue-700 hover:text-white cursor-pointer"
              onClick={() => {
                onItemClick(item.id)
                onClose()
              }}
            >
              <div className="w-6">{item.icon}</div>
              <span className={`${isCompact ? "text-xs" : "text-sm"}`}>{item.label}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

