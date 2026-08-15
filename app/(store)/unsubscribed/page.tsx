import Link from "next/link"
import { MailX, CheckCircle } from "lucide-react"

export default function UnsubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>
}) {
  return (
    <UnsubscribedContent searchParams={searchParams} />
  )
}

async function UnsubscribedContent({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; error?: string }>
}) {
  const params = await searchParams
  const isError = params.error === "1"

  return (
    <div className="min-h-screen bg-bindu-bg flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center space-y-8">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isError ? "bg-red-100" : "bg-bindu-muted"}`}>
          {isError ? (
            <MailX className="w-10 h-10 text-red-500" />
          ) : (
            <CheckCircle className="w-10 h-10 text-bindu-text-muted" />
          )}
        </div>

        {isError ? (
          <>
            <h1 className="text-3xl font-heading font-bold text-bindu-black">Something went wrong</h1>
            <p className="text-bindu-text-muted text-sm">
              We couldn't process your unsubscribe request. Please try again or contact us.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-heading font-bold text-bindu-black">You're unsubscribed</h1>
            <p className="text-bindu-text-muted text-sm">
              {params.email ? (
                <>
                  <span className="font-medium text-bindu-black">{params.email}</span> has been removed from our marketing list.
                </>
              ) : (
                "Your email has been removed from our marketing list."
              )}
              <br className="hidden sm:block" />
              You'll still receive order confirmations and shipping updates.
            </p>
          </>
        )}

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-bindu-black text-white text-xs font-bold uppercase tracking-widest hover:bg-bindu-cyan transition-colors"
          >
            Back to Shop
          </Link>
          {!isError && (
            <Link
              href="/account"
              className="text-xs text-bindu-text-muted hover:text-bindu-black underline underline-offset-4 transition-colors"
            >
              Manage account preferences
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
