"use client"

import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"

interface Skill {
  name: string
  level: number
  color: string
}

export default function SkillsSection() {
  const frontendSkills: Skill[] = [
    { name: "HTML/CSS", level: 95, color: "#FF5733" },
    { name: "JavaScript", level: 90, color: "#F7DF1E" },
    { name: "React", level: 85, color: "#61DAFB" },
    { name: "Next.js", level: 80, color: "#000000" },
    { name: "Tailwind CSS", level: 90, color: "#38B2AC" },
  ]

  const backendSkills: Skill[] = [
    { name: "Node.js", level: 75, color: "#339933" },
    { name: "Express", level: 70, color: "#000000" },
    { name: "MongoDB", level: 65, color: "#47A248" },
    { name: "SQL", level: 60, color: "#4479A1" },
  ]

  const designSkills: Skill[] = [
    { name: "Figma", level: 80, color: "#F24E1E" },
    { name: "Adobe XD", level: 75, color: "#FF61F6" },
    { name: "Photoshop", level: 70, color: "#31A8FF" },
    { name: "Illustrator", level: 65, color: "#FF9A00" },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
        <div className="bg-gray-100 p-6 border-2 border-dashed border-gray-400">
          <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-800 pb-2">Skills & Expertise</h2>

          <motion.div variants={item} className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              Frontend Development
            </h3>
            <div className="space-y-4">
              {frontendSkills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" indicatorClassName={`bg-[${skill.color}]`} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              Backend Development
            </h3>
            <div className="space-y-4">
              {backendSkills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" indicatorClassName={`bg-[${skill.color}]`} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item}>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-4 h-4 bg-green-500 mr-2"></div>
              Design
            </h3>
            <div className="space-y-4">
              {designSkills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <Progress value={skill.level} className="h-2" indicatorClassName={`bg-[${skill.color}]`} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div variants={item} className="bg-gray-100 p-6 border-2 border-dashed border-gray-400">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b-2 border-blue-800 pb-2">
            Tools & Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Git", "VS Code", "Docker", "AWS", "Firebase", "Vercel", "TypeScript", "GraphQL"].map((tool) => (
              <div key={tool} className="bg-white p-3 border border-gray-400 text-center shadow-md hover:bg-gray-50">
                {tool}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

