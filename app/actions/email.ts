"use server"

import { Resend } from "resend"

// Initialize Resend with API key from environment variables
// You'll need to set this in your environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

interface EmailData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendEmail(data: EmailData) {
  try {
    // Validate input
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        success: false,
        error: "All fields are required",
      }
    }

    // Check if Resend is configured
    if (!resend) {
      console.log("Email would be sent with the following data:", data)
      return {
        success: true,
        message: "Email service is not configured, but the form submission was successful",
      }
    }

    // Send email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: `Portfolio Contact <${process.env.FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: process.env.TO_EMAIL || data.email, // Fallback to sender's email for testing
      subject: `Portfolio Contact: ${data.subject}`,
      text: `
        Name: ${data.name}
        Email: ${data.email}
        
        Message:
        ${data.message}
      `,
      // You can also use HTML for a nicer email
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <h3>Message:</h3>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    })

    if (error) {
      console.error("Email error:", error)
      return {
        success: false,
        error: "Failed to send email. Please try again.",
      }
    }

    return {
      success: true,
      data: emailData,
    }
  } catch (error) {
    console.error("Unexpected email error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}

