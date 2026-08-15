import ManualOrderForm from "@/components/admin/ManualOrderForm"
import PageHeader from "@/components/admin/PageHeader"

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: "Orders", href: "/admin/orders" }]}
        title="New Order"
        description="Create an order on behalf of a customer — for orders taken by phone, Messenger, or WhatsApp."
      />
      <ManualOrderForm />
    </div>
  )
}
