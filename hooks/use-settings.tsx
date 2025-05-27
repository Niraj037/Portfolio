"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

export interface Settings {
  enableMusic: boolean
  volume: number
  colorScheme: string
  wallpaper: string
  [key: string]: any
}

const defaultSettings: Settings = {
  enableMusic: true,
  volume: 50,
  colorScheme: "classic",
  wallpaper: "teal",
}

interface SettingsContextType {
  settings: Settings
  updateSettings: (newSettings: Settings) => void
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
})

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loaded, setLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("win98-settings")
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings))
        } catch (e) {
          console.error("Failed to parse settings:", e)
        }
      }
      setLoaded(true)
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    if (loaded && typeof window !== "undefined") {
      localStorage.setItem("win98-settings", JSON.stringify(settings))
    }
  }, [settings, loaded])

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings)
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export const useSettings = () => useContext(SettingsContext)

