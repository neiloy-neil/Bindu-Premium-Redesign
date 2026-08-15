"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/premium/Button"

export default function WholesaleInquiryPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, send data to backend here
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="bg-bindu-light-grey min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 max-w-xl text-center border border-bindu-border-grey shadow-bindu">
          <div className="w-16 h-16 bg-bindu-navy text-bindu-orange rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
            Inquiry Received
          </h1>
          <p className="text-bindu-text-muted mb-8 leading-relaxed">
            Thank you for your interest in partnering with Bindu Premium. Our B2B team will review your details and be in touch within 48 hours.
          </p>
          <Link href="/">
            <Button className="bg-bindu-navy hover:bg-bindu-orange text-white h-12 px-8 text-sm uppercase tracking-widest font-bold">
              Return to Store
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bindu-white min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 max-w-3xl mx-auto">
        <Link href="/wholesale" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-bindu-text-muted hover:text-bindu-orange transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Wholesale
        </Link>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Wholesale Inquiry
        </h1>
        <p className="text-bindu-text-muted text-lg">
          Please provide your business details below to begin the application process.
        </p>
      </section>

      {/* Form Section */}
      <section className="max-w-3xl mx-auto px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="businessName" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                required
                className="w-full bg-bindu-light-grey border border-bindu-border-grey h-14 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
                placeholder="e.g. Apex Retailers Ltd."
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="businessType" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                Business Type *
              </label>
              <select
                id="businessType"
                required
                className="w-full bg-bindu-light-grey border border-bindu-border-grey h-14 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors text-bindu-text-muted"
              >
                <option value="">Select Type</option>
                <option value="boutique">Independent Boutique</option>
                <option value="chain">Retail Chain</option>
                <option value="online">E-Commerce</option>
                <option value="corporate">Corporate Gifting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="contactName" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                Contact Name *
              </label>
              <input
                type="text"
                id="contactName"
                required
                className="w-full bg-bindu-light-grey border border-bindu-border-grey h-14 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="w-full bg-bindu-light-grey border border-bindu-border-grey h-14 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              required
              className="w-full bg-bindu-light-grey border border-bindu-border-grey h-14 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="productInterest" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
              Product Interest
            </label>
            <input
              type="text"
              id="productInterest"
              className="w-full bg-bindu-light-grey border border-bindu-border-grey h-14 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
              placeholder="e.g. Polos, T-Shirts, Panjabis"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
              Additional Information
            </label>
            <textarea
              id="message"
              rows={5}
              className="w-full bg-bindu-light-grey border border-bindu-border-grey p-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors resize-none"
              placeholder="Tell us about your target audience, current brands carried, or specific volume requirements."
            ></textarea>
          </div>

          <Button type="submit" className="w-full bg-bindu-navy hover:bg-bindu-orange text-white h-14 text-sm uppercase tracking-widest font-bold transition-colors">
            Submit Application
          </Button>

        </form>
      </section>
    </div>
  )
}
