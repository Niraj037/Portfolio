"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Volume2, Monitor, Palette, Mouse, Clock } from "lucide-react"
import { useSettings } from "@/hooks/use-settings"

export default function SettingsWindow() {
  const { settings, updateSettings } = useSettings()
  const [activeTab, setActiveTab] = useState("display")
  const [colorScheme, setColorScheme] = useState(settings.colorScheme || "classic")
  const [wallpaper, setWallpaper] = useState(settings.wallpaper || "teal")
  const [volume, setVolume] = useState(settings.volume || 50)
  const [enableMusic, setEnableMusic] = useState(settings.enableMusic)
  const [changes, setChanges] = useState(false)

  // Track changes
  useEffect(() => {
    if (
      colorScheme !== settings.colorScheme ||
      wallpaper !== settings.wallpaper ||
      volume !== settings.volume ||
      enableMusic !== settings.enableMusic
    ) {
      setChanges(true)
    } else {
      setChanges(false)
    }
  }, [colorScheme, wallpaper, volume, enableMusic, settings])

  // Apply settings
  const applySettings = () => {
    updateSettings({
      ...settings,
      colorScheme,
      wallpaper,
      volume,
      enableMusic,
    })
    setChanges(false)
  }

  // Reset settings
  const resetSettings = () => {
    setColorScheme(settings.colorScheme || "classic")
    setWallpaper(settings.wallpaper || "teal")
    setVolume(settings.volume || 50)
    setEnableMusic(settings.enableMusic)
    setChanges(false)
  }

  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b-2 border-blue-800 pb-2">Control Panel</h2>

      <div className="flex flex-col md:flex-row gap-4 h-[calc(100%-60px)]">
        {/* Left sidebar */}
        <div className="w-full md:w-48 bg-white border-2 border-gray-400 shadow-md">
          <div className="bg-gray-100 border-b border-gray-300 p-2">
            <h3 className="font-bold">Settings</h3>
          </div>
          <div className="p-2">
            <ul className="space-y-1">
              <li
                className={`p-1 cursor-pointer flex items-center gap-2 ${activeTab === "display" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("display")}
              >
                <Monitor size={16} />
                <span>Display</span>
              </li>
              <li
                className={`p-1 cursor-pointer flex items-center gap-2 ${activeTab === "sound" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("sound")}
              >
                <Volume2 size={16} />
                <span>Sound</span>
              </li>
              <li
                className={`p-1 cursor-pointer flex items-center gap-2 ${activeTab === "appearance" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("appearance")}
              >
                <Palette size={16} />
                <span>Appearance</span>
              </li>
              <li
                className={`p-1 cursor-pointer flex items-center gap-2 ${activeTab === "mouse" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("mouse")}
              >
                <Mouse size={16} />
                <span>Mouse</span>
              </li>
              <li
                className={`p-1 cursor-pointer flex items-center gap-2 ${activeTab === "datetime" ? "bg-blue-100" : "hover:bg-gray-100"}`}
                onClick={() => setActiveTab("datetime")}
              >
                <Clock size={16} />
                <span>Date/Time</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-white border-2 border-gray-400 shadow-md">
          <div className="bg-gray-100 border-b border-gray-300 p-2">
            <h3 className="font-bold">
              {activeTab === "display" && "Display Properties"}
              {activeTab === "sound" && "Sound Properties"}
              {activeTab === "appearance" && "Appearance Properties"}
              {activeTab === "mouse" && "Mouse Properties"}
              {activeTab === "datetime" && "Date/Time Properties"}
            </h3>
          </div>

          <div className="p-4">
            {/* Display Settings */}
            {activeTab === "display" && (
              <div>
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Wallpaper</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div
                      className={`h-20 bg-teal-600 cursor-pointer border-2 ${wallpaper === "teal" ? "border-blue-500" : "border-gray-300"}`}
                      onClick={() => setWallpaper("teal")}
                    ></div>
                    <div
                      className={`h-20 bg-blue-800 cursor-pointer border-2 ${wallpaper === "blue" ? "border-blue-500" : "border-gray-300"}`}
                      onClick={() => setWallpaper("blue")}
                    ></div>
                    <div
                      className={`h-20 bg-green-700 cursor-pointer border-2 ${wallpaper === "green" ? "border-blue-500" : "border-gray-300"}`}
                      onClick={() => setWallpaper("green")}
                    ></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Screen Resolution</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span>Low</span>
                    <input type="range" min="1" max="3" value="2" className="flex-1" disabled />
                    <span>High</span>
                  </div>
                  <p className="text-sm text-gray-600">800 x 600 pixels (Recommended)</p>
                </div>
              </div>
            )}

            {/* Sound Settings */}
            {activeTab === "sound" && (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label htmlFor="enable-music" className="font-bold">
                      Enable Music
                    </Label>
                    <Switch
                      id="enable-music"
                      checked={enableMusic}
                      onCheckedChange={(checked) => setEnableMusic(checked)}
                    />
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold mb-2">Volume</h4>
                    <div className="flex items-center gap-2">
                      <Volume2 size={16} />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number.parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span>{volume}%</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-2">System Sounds</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-startup" className="text-sm">
                          Startup Sound
                        </Label>
                        <Switch
                          id="enable-startup"
                          checked={enableMusic}
                          onCheckedChange={(checked) => setEnableMusic(checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enable-error" className="text-sm">
                          Error Sound
                        </Label>
                        <Switch
                          id="enable-error"
                          checked={enableMusic}
                          onCheckedChange={(checked) => setEnableMusic(checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div>
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Color Scheme</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      className={`cursor-pointer border-2 ${colorScheme === "classic" ? "border-blue-500" : "border-gray-300"}`}
                      onClick={() => setColorScheme("classic")}
                    >
                      <div className="bg-gray-300 p-2 font-bold">Classic</div>
                      <div className="p-4 bg-gray-200">
                        <div className="w-full h-6 bg-blue-800"></div>
                        <div className="w-full h-12 bg-gray-300 mt-2 border border-gray-400"></div>
                      </div>
                    </div>
                    <div
                      className={`cursor-pointer border-2 ${colorScheme === "modern" ? "border-blue-500" : "border-gray-300"}`}
                      onClick={() => setColorScheme("modern")}
                    >
                      <div className="bg-gray-300 p-2 font-bold">Modern</div>
                      <div className="p-4 bg-gray-200">
                        <div className="w-full h-6 bg-blue-600"></div>
                        <div className="w-full h-12 bg-white mt-2 border border-gray-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mouse Settings */}
            {activeTab === "mouse" && (
              <div>
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Pointer Speed</h4>
                  <div className="flex items-center gap-2">
                    <span>Slow</span>
                    <input type="range" min="1" max="10" value="5" className="flex-1" disabled />
                    <span>Fast</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Double-Click Speed</h4>
                  <div className="flex items-center gap-2">
                    <span>Slow</span>
                    <input type="range" min="1" max="10" value="5" className="flex-1" disabled />
                    <span>Fast</span>
                  </div>
                </div>
              </div>
            )}

            {/* Date/Time Settings */}
            {activeTab === "datetime" && (
              <div>
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Current Date & Time</h4>
                  <div className="bg-white border border-gray-400 p-4 text-center">
                    <div className="text-2xl">{new Date().toLocaleTimeString()}</div>
                    <div>{new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Time Zone</h4>
                  <select className="w-full border border-gray-400 p-1" disabled>
                    <option>(GMT) Greenwich Mean Time</option>
                    <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                    <option>(GMT-08:00) Pacific Time (US & Canada)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          className="win98-button bg-gray-300 text-black hover:bg-gray-200"
          onClick={resetSettings}
          disabled={!changes}
        >
          Cancel
        </Button>
        <Button
          className="win98-button bg-gray-300 text-black hover:bg-gray-200"
          onClick={applySettings}
          disabled={!changes}
        >
          Apply
        </Button>
        <Button
          className="win98-button bg-gray-300 text-black hover:bg-gray-200"
          onClick={() => {
            applySettings()
            // Could add a close window function here
          }}
        >
          OK
        </Button>
      </div>
    </div>
  )
}

