import prisma from "@/lib/prisma"
import { SettingsClient } from "./SettingsClient"

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, string>)

  const staff = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "STAFF"] }
    },
    orderBy: { createdAt: "desc" },
  })

  const formattedStaff = staff.map(s => ({
    id: s.id,
    name: s.name || "N/A",
    email: s.email,
    role: s.role,
  }))

  return (
    <SettingsClient initialSettings={settingsMap} initialStaff={formattedStaff} />
  )
}
