import { redirect } from "next/navigation"

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  redirect(`/blog?tag=${encodeURIComponent(decodeURIComponent(tag))}`)
}
