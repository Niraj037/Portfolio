"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle, Mail, ExternalLink } from "lucide-react"

interface HelpWindowProps {
  onRedirect?: () => void
}

export default function HelpWindow({ onRedirect }: HelpWindowProps) {
  // Redirect to contact page after a short delay
  useEffect(() => {
    if (onRedirect) {
      const timer = setTimeout(() => {
        onRedirect()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [onRedirect])

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center mb-6">
        <HelpCircle size={32} className="mr-4 text-blue-800" />
        <h2 className="text-2xl font-bold text-blue-800">Windows Help</h2>
      </div>

      <div className="bg-white border-2 border-gray-400 shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Redirecting to Contact...</h3>
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-center mt-4">You will be redirected to the Contact page in a moment.</p>
      </div>

      <div className="bg-white border-2 border-gray-400 shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Need Immediate Help?</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="win98-button bg-gray-300 text-black hover:bg-gray-200 flex items-center gap-2"
            onClick={onRedirect}
          >
            <Mail size={16} />
            Contact Support
          </Button>
          <Button className="win98-button bg-gray-300 text-black hover:bg-gray-200 flex items-center gap-2" asChild>
            <a href="https://github.com/Niraj037" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              Visit Documentation
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

