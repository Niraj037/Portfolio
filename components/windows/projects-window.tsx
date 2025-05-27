import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function ProjectsWindow() {
  const projects = [
    {
      id: 1,
      title: "Bloatrex",
      description: "A CLI tool to detect and remove unused Node.js dependencies.",
      image: "/image.png?height=200&width=300",
      tags: ["Node.js"],
      link: "https://github.com/Niraj037/Bloatrex",
    },
    {
      id: 2,
      title: "Discord-AI-Chatbot",
      description: "A multi-personality, multi-language Discord chatbot powered by Groq's LLaMA 3.3 70B model.",
      image: "/image2.png?height=200&width=300",
      tags: ["Javascript", "Groq", "Meta Llama"],
      link: "https://github.com/Niraj037/Discord-AI-Chatbot",
    },
    {
      id: 3,
      title: "BotX",
      description: "Bot X is a CLI tool that automates the setup of a Discord bot with essential dependencies, saving you time and effort. Just run a single command, follow the prompts, and get started instantly",
      image: "/image1.png?height=200&width=300",
      tags: ["Node.js"],
      link: "https://github.com/Niraj037/BotX",
    },
  ]

  return (
    <div className="p-6 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-800 pb-2">My Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border-2 border-gray-400 shadow-md overflow-hidden hover:border-blue-500 transition-colors"
          >
            <div className="relative">
              <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-white border-gray-400 hover:bg-gray-100"
                  asChild
                >
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-gray-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

