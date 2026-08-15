import BundleForm from "../BundleForm"
import PageHeader from "@/components/admin/PageHeader"

export default function NewBundlePage() {
  return (
    <div>
      <PageHeader breadcrumbs={[{ label: "Bundles", href: "/admin/bundles" }]} />
      <BundleForm />
    </div>
  )
}
