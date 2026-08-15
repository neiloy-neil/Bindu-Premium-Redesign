import prisma from "@/lib/prisma"
import ContactInbox from "./ContactInbox"
import PageHeader from "@/components/admin/PageHeader"

export const dynamic = "force-dynamic"

export default async function ContactAdminPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })
  return (
    <div className="space-y-4">
      <PageHeader title="Contact Inbox" description="Messages submitted via the Contact Us form." />
      <ContactInbox initialMessages={messages} />
    </div>
  )
}
