import { ReportsClient } from "./ReportsClient"
import PageHeader from "@/components/admin/PageHeader"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4">
      <PageHeader title="Reports & Analytics" />
      <ReportsClient />
    </div>
  )
}
