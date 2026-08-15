import prisma from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import WorkflowsClient from "./WorkflowsClient"
import PageHeader from "@/components/admin/PageHeader"

export default async function WorkflowsPage() {
  const session = await requireAdmin()
  if (!session) redirect("/login")
  const workflows = await prisma.workflow.findMany({
    include: { _count: { select: { runs: true } } },
    orderBy: { createdAt: "desc" },
  })
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Automation Workflows"
        description="Trigger automatic actions (emails, tags, credits) based on customer behaviour."
      />
      <WorkflowsClient data={JSON.parse(JSON.stringify(workflows))} />
    </div>
  )
}
