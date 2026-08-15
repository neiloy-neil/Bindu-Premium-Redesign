"use server"

import prisma from "@/lib/prisma"

export async function submitContactForm(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { error: "Name, email, and message are required" }
    }
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
      },
    })
    return { ok: true }
  } catch (e: any) {
    return { error: e.message || "Failed to submit message" }
  }
}
