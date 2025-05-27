export default function SkillsWindow() {
  const frontendSkills = [
    { name: "HTML/CSS", level: 80, color: "#FF5733" },
    { name: "JavaScript", level: 70, color: "#F7DF1E" },
    { name: "React", level: 55, color: "#61DAFB" },
    { name: "Tailwind CSS", level: 90, color: "#38B2AC" },
  ]

  const backendSkills = [
    { name: "Node.js", level: 85, color: "#339933" },
    { name: "MongoDB", level: 65, color: "#47A248" },
    { name: "SQL", level: 60, color: "#4479A1" },
  ]

  const CyberSkills = [
    { name: "Cybersecurity Fundamentals", level: 80, color: "#F24E1E" },
    { name: "Network Security", level: 75, color: "#FF61F6" },
    { name: "SIEM", level: 70, color: "#31A8FF" },
    { name: "Python for Security", level: 65, color: "#FF9A00" },
    { name: "Linux/Bash", level: 70, color: "#31A8FF" },
    { name: "Digital Forensics (Autopsy) ", level: 56, color: "#FF9A00" },
  ]

  return (
    <div className="p-6 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-800 pb-2">Skills & Expertise</h2>

      <div className="space-y-8">
        <div className="bg-white border-2 border-gray-400 shadow-md p-6">
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
                <div className="h-6 w-full bg-gray-200 border border-gray-400">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-400 shadow-md p-6">
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
                <div className="h-6 w-full bg-gray-200 border border-gray-400">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-400 shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            Cyber Security
          </h3>
          <div className="space-y-4">
            {CyberSkills.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-6 w-full bg-gray-200 border border-gray-400">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border-2 border-gray-400 shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Tools & Technologies</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {["Git", "VS Code", "Docker", "AWS", "Firebase", "Vercel", "Wireshark", "Security Onion", "Kibana", "Python", "Firewalls & IDS/IPS", "Chronicle (Google Cloud)"].map((tool) => (
              <div
                key={tool}
                className="bg-gray-100 p-3 border border-gray-400 text-center shadow-md hover:bg-gray-200"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

