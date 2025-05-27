"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  link: string
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card
        className="overflow-hidden border-2 border-gray-400 shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
          {isHovered && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  View Project <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
          <p className="text-gray-700 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-gray-200">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

