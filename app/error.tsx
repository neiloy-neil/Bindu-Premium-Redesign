"use client"

import { useEffect } from "react"
import { Button } from "@/components/premium/Button"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bindu-light-grey p-4 text-center">
      <div className="max-w-md w-full bg-white p-8 border border-bindu-border-grey space-y-6 shadow-sm">
        <div className="w-16 h-16 bg-bindu-error/10 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-bindu-error" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight">Something went wrong</h2>
          <p className="text-bindu-text-muted text-sm leading-relaxed">
            We encountered an unexpected error. Please try again or contact support if the issue persists.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            className="w-full bg-bindu-navy hover:bg-bindu-orange text-white font-bold uppercase tracking-widest text-xs h-12 transition-colors"
          >
            Try Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="w-full font-bold uppercase tracking-widest text-xs h-12"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
