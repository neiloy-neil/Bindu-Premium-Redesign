import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import ExportClient from "./ExportClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function ExportPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <PageHeader title="Export Data" description="Download orders, customers or products as a CSV file." />
      <ExportClient />
    </div>
  )
}
