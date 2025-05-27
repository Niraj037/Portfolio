"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sendEmail } from "@/app/actions/email"

export default function ContactWindow() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Call the server action to send email
      const result = await sendEmail(formData)

      if (result.success) {
        setIsSubmitted(true)
        setFormData({ name: "", email: "", subject: "", message: "" })

        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false)
        }, 5000)
      } else {
        setError(result.error || "Failed to send email. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
      console.error("Email error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 border-b-2 border-blue-800 pb-2">Contact Nirajj</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="bg-white shadow-md"
          style={{
            boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
          }}
        >
          <div
            className="bg-gray-100 border-b border-gray-300 p-4"
            style={{
              boxShadow: "inset 0 -1px #0a0a0a, inset 0 1px #dfdfdf",
            }}
          >
            <h3 className="text-xl font-bold">Get in Touch</h3>
            <p className="text-gray-600">Fill out the form and I'll get back to you soon.</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="border-gray-400 win98-input"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="border-gray-400 win98-input"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What is this regarding?"
                    required
                    className="border-gray-400 win98-input"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message here..."
                    rows={5}
                    required
                    className="border-gray-400 win98-input"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="mt-6 w-full bg-blue-800 hover:bg-blue-700 win98-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send size={16} className="mr-2" /> Send Message
                  </span>
                )}
              </Button>

              {isSubmitted && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md border border-green-300">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-300">{error}</div>
              )}
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="bg-white shadow-md"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
            }}
          >
            <div
              className="bg-gray-100 border-b border-gray-300 p-4"
              style={{
                boxShadow: "inset 0 -1px #0a0a0a, inset 0 1px #dfdfdf",
              }}
            >
              <h3 className="text-xl font-bold">Contact Information</h3>
              <p className="text-gray-600">Here's how you can reach me directly.</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mt-1 mr-3 text-blue-800" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-gray-600">santabhakta2488@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 mt-1 mr-3 text-blue-800" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-gray-600">+91 9325759611</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mt-1 mr-3 text-blue-800"/>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-gray-600">Pune, IN</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white shadow-md"
            style={{
              boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #dfdfdf, inset -2px -2px grey, inset 2px 2px white",
            }}
          >
            <div
              className="bg-gray-100 border-b border-gray-300 p-4"
              style={{
                boxShadow: "inset 0 -1px #0a0a0a, inset 0 1px #dfdfdf",
              }}
            >
              <h3 className="text-xl font-bold">Office Hours</h3>
              <p className="text-gray-600">When I'm available for meetings.</p>
            </div>
            <div className="p-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday</span>
                  <span>By appointment</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

