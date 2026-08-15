import Link from "next/link"
import { Button } from "@/components/premium/Button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bindu-light-grey p-4 text-center">
      <h1 className="text-9xl font-heading font-black text-bindu-navy/10 select-none">404</h1>
      
      <div className="space-y-4 -mt-10 relative z-10 bg-bindu-light-grey p-6 max-w-md w-full">
        <h2 className="text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight">Page Not Found</h2>
        <p className="text-bindu-text-muted text-sm leading-relaxed">
          We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place.
        </p>
        
        <div className="pt-6">
          <Link href="/">
            <Button className="w-full bg-bindu-navy hover:bg-bindu-orange text-white font-bold uppercase tracking-widest text-xs h-12 transition-colors">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
