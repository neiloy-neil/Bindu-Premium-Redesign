import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import BookingsClient from "./BookingsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function BookingsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")

  const [bookings, services] = await Promise.all([
    prisma.booking.findMany({
      include: { service: { select: { name: true, price: true, durationMins: true } } },
      orderBy: { bookingDate: "asc" },
    }),
    prisma.bookingService.findMany({ orderBy: { createdAt: "desc" } }),
  ])

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <PageHeader
        title="Bookings & Appointments"
        description="Manage booking services and customer appointments."
      />
      <BookingsClient bookings={JSON.parse(JSON.stringify(bookings))} services={JSON.parse(JSON.stringify(services))} />
    </div>
  )
}
