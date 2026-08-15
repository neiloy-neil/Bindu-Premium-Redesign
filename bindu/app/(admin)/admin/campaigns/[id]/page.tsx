import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { serialize } from "@/lib/utils"
import CampaignComposer from "@/components/admin/CampaignComposer"
import PageHeader from "@/components/admin/PageHeader"

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = await prisma.emailCampaign.findUnique({ where: { id } }).catch(() => null)
  if (!campaign) notFound()

  return (
    <div className="mx-auto max-w-4xl w-full space-y-4">
      <PageHeader
        title="Edit Campaign"
        breadcrumbs={[{ label: "Campaigns", href: "/admin/campaigns" }]}
        description={
          campaign.status === "SENT"
            ? `Sent to ${campaign.totalSent ?? 0} recipients on ${new Date(campaign.sentAt!).toLocaleDateString()}`
            : `Status: ${campaign.status}`
        }
      />
      <CampaignComposer initialData={serialize(campaign)} />
    </div>
  )
}
