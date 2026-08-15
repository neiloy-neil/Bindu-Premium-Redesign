import CampaignComposer from "@/components/admin/CampaignComposer"
import PageHeader from "@/components/admin/PageHeader"

export default function NewCampaignPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Campaigns", href: "/admin/campaigns" }]}
        title="New Campaign"
      />
      <CampaignComposer />
    </div>
  )
}
