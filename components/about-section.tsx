"use client"

import { motion } from "framer-motion"

export default function AboutSection() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="bg-gray-100 p-6 border-2 border-dashed border-gray-400 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b-2 border-blue-800 pb-2">About Me</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <div className="bg-white p-2 border border-gray-400 shadow-md">
                <img src="/placeholder-user?height=300&width=300" alt="Profile" className="w-full h-auto" />
              </div>
            </div>
            <div className="md:w-2/3">
              <p className="mb-4">
                
              </p>
              <p className="mb-4">
              Hi, I'm Niraj! 🧑🏻‍🏭<p>
I'm a recent graduate launching my journey into the world of Cybersecurity through the Google Cybersecurity Professional Certification program. With a solid background in frontend development and a growing interest in ethical hacking, I’m also working toward earning the OSCP certification to take things to the next level.</p>
<p>I’m passionate about building things—whether it’s sleek user interfaces, secure systems, or even lines of poetry. I draw inspiration from artists like Kanye West and 21 Savage, whose creativity and persistence fuel my own drive. I’ve got an ambition, a dream, and a goal—and I’m grinding to achieve them, day in, day out. 💻🔐🚀</p>
              </p>
              <p>
              When I’m not coding, you’ll probably find me diving into the latest tech trends, contributing to open-source projects, or writing poems and books. I love quiet moments under the summer night sky… and yeah, sometimes, I might just be writing poetry about a certain someone. ❤️😉
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 border-2 border-dashed border-gray-400">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b-2 border-blue-800 pb-2">Experience</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 border border-gray-400 shadow-md">
              <h3 className="text-xl font-bold">Director</h3>
              <p className="text-gray-600 italic">Krypton Lab. | 2020 - Present</p>
              <ul className="list-disc list-inside mt-2">
                <li>Led the development of the company's framework</li>
                <li>Implemented responsive designs and improved performance</li>
                <li>Mentored junior developers and conducted code reviews</li>
              </ul>
            </div>

            <div className="bg-white p-4 border border-gray-400 shadow-md">
              <h3 className="text-xl font-bold">Frontend Intern</h3>
              <p className="text-gray-600 italic">Netpool Technologies Pvt. Ltd.| July 2024 - November 2024</p>
              <ul className="list-disc list-inside mt-2">
                <li>Implemented responsive modules in their pre-existing Billing</li>
                <li>Collaborated with Infrastructure Department for CLIs</li>
                <li>Optimized websites for maximum speed and scalability</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

