"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Paintbrush, Type, ImageIcon, Github, Linkedin, Mail, Download } from "lucide-react"
import ProjectCard from "./project-card"
import AboutSection from "./about-section"
import ContactForm from "./contact-form"
import SkillsSection from "./skills-section"

export default function PaintPortfolio() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const [isMaximized, setIsMaximized] = useState(false)
  const [previousSize, setPreviousSize] = useState({ width: "85vw", height: "85vh" })

  // Handle window dragging
  const startDrag = (e: React.MouseEvent) => {
    if (isMaximized) return
    setIsDragging(true)
    setPosition({
      x: e.clientX - windowPosition.x,
      y: e.clientY - windowPosition.y,
    })
  }

  const onDrag = (e: React.MouseEvent) => {
    if (isDragging && !isMaximized) {
      const newX = e.clientX - position.x
      const newY = e.clientY - position.y
      setWindowPosition({ x: newX, y: newY })
    }
  }

  const stopDrag = () => {
    setIsDragging(false)
  }

  // Handle window controls
  const maximizeWindow = () => {
    if (!isMaximized) {
      setPreviousSize({
        width: windowRef.current?.style.width || "85vw",
        height: windowRef.current?.style.height || "85vh",
      })
      setIsMaximized(true)
    } else {
      setIsMaximized(false)
    }
  }

  const minimizeWindow = () => {
    // Animation could be added here
    console.log("Window minimized")
  }

  // Projects data
  const projects = [
    {
      id: 1,
      title: "Bloatrex",
      description: "A CLI tool to detect and remove unused Node.js dependencies.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Node.js"],
      link: "https://github.com/Niraj037/Bloatrex",
    },
    {
      id: 2,
      title: "Discord-AI-Chatbot",
      description: "A multi-personality, multi-language Discord chatbot powered by Groq's LLaMA 3.3 70B model.",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Javascript", "Groq", "Meta Llama"],
      link: "https://github.com/Niraj037/Discord-AI-Chatbot",
    },
    {
      id: 3,
      title: "BotX",
      description: "Bot X is a CLI tool that automates the setup of a Discord bot with essential dependencies, saving you time and effort. Just run a single command, follow the prompts, and get started instantly",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Node.js"],
      link: "https://github.com/Niraj037/BotX",
    },
  ]

  return (
    <motion.div
      ref={windowRef}
      className="bg-gray-200 border-2 border-gray-400 shadow-xl rounded-sm overflow-hidden"
      style={{
        width: isMaximized ? "100vw" : previousSize.width,
        height: isMaximized ? "100vh" : previousSize.height,
        position: isMaximized ? "fixed" : "relative",
        top: isMaximized ? 0 : windowPosition.y,
        left: isMaximized ? 0 : windowPosition.x,
        zIndex: 50,
        transition: "all 0.3s ease",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title Bar */}
      <div
        className="bg-blue-800 text-white px-2 py-1 flex justify-between items-center cursor-move select-none"
        onMouseDown={startDrag}
        onMouseMove={onDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div className="flex items-center gap-2">
          <Paintbrush size={16} />
          <span className="font-bold">portfolio.paint - Your Name</span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 min-w-6 text-white hover:bg-blue-700"
            onClick={minimizeWindow}
          >
            <span className="font-bold">_</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 min-w-6 text-white hover:bg-blue-700"
            onClick={maximizeWindow}
          >
            <span className="font-bold">{isMaximized ? "❐" : "□"}</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 min-w-6 text-white hover:bg-red-600">
            <span className="font-bold">×</span>
          </Button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-gray-300 px-2 py-1 text-sm border-b border-gray-400 select-none">
        <span className="mr-4 hover:bg-gray-400 px-1 cursor-pointer">File</span>
        <span className="mr-4 hover:bg-gray-400 px-1 cursor-pointer">Edit</span>
        <span className="mr-4 hover:bg-gray-400 px-1 cursor-pointer">View</span>
        <span className="mr-4 hover:bg-gray-400 px-1 cursor-pointer">Image</span>
        <span className="mr-4 hover:bg-gray-400 px-1 cursor-pointer">Help</span>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100%-80px)]">
        {/* Tools Sidebar */}
        <div className="w-16 bg-gray-300 p-1 border-r border-gray-400 flex flex-col items-center">
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 mb-1 ${activeTab === "portfolio" ? "bg-gray-200 border border-gray-500" : ""}`}
            onClick={() => setActiveTab("portfolio")}
          >
            <ImageIcon size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 mb-1 ${activeTab === "about" ? "bg-gray-200 border border-gray-500" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            <Type size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 mb-1 ${activeTab === "skills" ? "bg-gray-200 border border-gray-500" : ""}`}
            onClick={() => setActiveTab("skills")}
          >
            <Paintbrush size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 mb-1 ${activeTab === "contact" ? "bg-gray-200 border border-gray-500" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            <Mail size={24} />
          </Button>
          <div className="mt-auto">
            <Button variant="ghost" size="icon" className="w-12 h-12 mb-1" asChild>
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                <Github size={24} />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12 mb-1" asChild>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
                <Linkedin size={24} />
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="w-12 h-12" asChild>
              <a href="/resume.pdf" download>
                <Download size={24} />
              </a>
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-grow bg-white overflow-auto p-4 border border-gray-400">
          {activeTab === "portfolio" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {activeTab === "about" && <AboutSection />}

          {activeTab === "skills" && <SkillsSection />}

          {activeTab === "contact" && <ContactForm />}
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-gray-300 p-2 border-t border-gray-400 flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {["#000000", "#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#4B0082", "#EE82EE"].map((color) => (
            <div
              key={color}
              className="w-6 h-6 border border-gray-500 cursor-pointer hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="text-xs text-gray-600">Coordinates: 320, 240 px</div>
      </div>
    </motion.div>
  )
}

