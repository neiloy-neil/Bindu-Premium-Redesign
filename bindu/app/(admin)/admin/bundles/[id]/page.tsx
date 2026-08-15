import BundleForm from "../BundleForm"
import PageHeader from "@/components/admin/PageHeader"

export default async function EditBundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Bundles", href: "/admin/bundles" }]} />
      <BundleForm bundleId={id} />
    </div>
  )
}
