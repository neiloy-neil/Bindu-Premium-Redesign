import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import StoreCreditClient from "./StoreCreditClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function StoreCreditPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const credits = await prisma.storeCredit.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  })
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  })
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader title="Store Credit" description="Issue or deduct store credit for customers. Credit is applied automatically at checkout." />
      <StoreCreditClient data={JSON.parse(JSON.stringify(credits))} customers={JSON.parse(JSON.stringify(customers))} />
    </div>
  )
}
