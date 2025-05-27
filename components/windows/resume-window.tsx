import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResumeWindow() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800 border-b-2 border-blue-800 pb-2">My Resume</h2>
        <Button className="bg-blue-800 hover:bg-blue-700 flex items-center gap-2" asChild>
          <a href="/resume.pdf" download>
            <Download size={16} /> Download PDF
          </a>
        </Button>
      </div>

      <div className="bg-white border-2 border-gray-400 shadow-md p-6 mb-6">
        <div className="border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-3xl font-bold">Niraj</h1>
          <p className="text-xl text-gray-600">Cybersecurity Enthuaist</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <span>santabhakta2488@gmail.com</span>
            <span>+91 9325759611</span>
            <span>Pune, IN</span>
            <a href="https://github.com/Niraj037" className="text-blue-600 hover:underline">
              github.com/nirajj
            </a>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            Summary
          </h2>
          <p>
            I'm a recent graduate launching my journey into the world of Cybersecurity through the Google Cybersecurity Professional Certification program. With a solid background in frontend development and a growing interest in ethical hacking.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            Experience
          </h2>

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold">Director</h3>
              <span className="text-sm text-gray-600">2020 - Present</span>
            </div>
            <p className="text-gray-600 italic mb-2">Krypton Lab, IN</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Led the development of the company's flagship product, improving Cloud Security.</li>
              <li>Implemented responsive designs and improved performance, reducing load times by 60%</li>
              <li>Mentored junior developers and conducted code reviews, enhancing team productivity</li>
              <li>Collaborated with other firms to implement AI & Cloud Solutions.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold">Frontend Intern</h3>
              <span className="text-sm text-gray-600">July 2024 - November 2024</span>
            </div>
            <p className="text-gray-600 italic mb-2">Netpool Technologies Pvt. Ltd.</p>
            <ul className="list-disc list-inside space-y-1">
               <li>Implemented responsive modules in their pre-existing Billing</li>
                <li>Collaborated with Infrastructure Department for CLIs</li>
                <li>Optimized websites for maximum speed and scalability</li>
              <li>Maintained and updated existing client websites, ensuring compatibility with modern browsers</li>
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            Education
          </h2>

          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold">Secondary School Graduate</h3>
              <span className="text-sm text-gray-600">2014 - 2025</span>
            </div>
            <p className="text-gray-600 italic">C.M.S Nigdi</p>
          </div>
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold">Highschool Graduate</h3>
              <span className="text-sm text-gray-600">2025 - Present</span>
            </div>
            <p className="text-gray-600 italic">!!!</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            Skills
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              "HTML/CSS",
              "JavaScript",
              "Linux/Bash",
              "SIEM Tools",
              "Python for Automation",
              "Threat Analysis",
              "Tailwind CSS",
              "Node.js",
              "Git",
              "Network Security",
              "UI/UX",
              "Performance Optimization",
            ].map((skill) => (
              <div key={skill} className="bg-gray-100 px-3 py-1 border border-gray-300 rounded-sm">
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            Projects
          </h2>

          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold">Bloatrex</h3>
              <p>
                A CLI tool to detect and remove unused Node.js dependencies.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold">Discord AI Chatbot</h3>
              <p>A multi-personality, multi-language Discord chatbot powered by Groq's LLaMA 3.3 70B model.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold">BotX</h3>
              <p>
              Bot X is a CLI tool that automates the setup of a Discord bot with essential dependencies, saving you time and effort. Just run a single command, follow the prompts, and get started instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

