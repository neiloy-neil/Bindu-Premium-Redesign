"use client"

import { useState } from "react"
import Link from "next/link"
import { Phone, Mail, MessageSquare, MapPin } from "lucide-react"
import { Button } from "@/components/premium/Button"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-bindu-text-muted text-lg max-w-2xl mx-auto">
          We are here to assist you with orders, sizing, styling, and general inquiries.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-8">
                Get In Touch
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-bindu-orange mt-1" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-1">Phone Support</h3>
                    <p className="text-bindu-text-muted mb-1">+880 1700 000000</p>
                    <p className="text-xs text-bindu-text-muted">Saturday - Thursday, 10am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-bindu-orange mt-1" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-1">Email</h3>
                    <p className="text-bindu-text-muted mb-1">support@bindupremium.com</p>
                    <p className="text-xs text-bindu-text-muted">We aim to reply within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageSquare className="w-6 h-6 text-bindu-orange mt-1" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-1">WhatsApp</h3>
                    <p className="text-bindu-text-muted mb-2">+880 1700 000000</p>
                    <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-bindu-orange hover:text-bindu-navy transition-colors">
                      Message Us Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-bindu-border-grey">
              <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
                Corporate HQ
              </h2>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-bindu-navy mt-1" />
                <div>
                  <p className="text-bindu-text-muted leading-relaxed">
                    Bindu Premium HQ<br />
                    House 12, Road 11, Block F<br />
                    Banani, Dhaka 1213<br />
                    Bangladesh
                  </p>
                  <Link href="/stores" className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-bindu-navy hover:text-bindu-orange transition-colors">
                    View Retail Stores
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 border border-bindu-border-grey">
            <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-8">
              Send a Message
            </h2>
            
            {isSubmitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-bindu-light-grey text-bindu-orange rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
                  Message Sent
                </h3>
                <p className="text-bindu-text-muted">
                  Thank you for reaching out. A member of our support team will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full bg-bindu-light-grey border border-bindu-border-grey h-12 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full bg-bindu-light-grey border border-bindu-border-grey h-12 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="orderNumber" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                    Order Number (Optional)
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    className="w-full bg-bindu-light-grey border border-bindu-border-grey h-12 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    required
                    className="w-full bg-bindu-light-grey border border-bindu-border-grey h-12 px-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors text-bindu-text-muted"
                  >
                    <option value="">Select a topic</option>
                    <option value="order_status">Order Status</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="sizing">Sizing Advice</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-bold uppercase tracking-widest text-bindu-navy">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    className="w-full bg-bindu-light-grey border border-bindu-border-grey p-4 focus:border-bindu-navy focus:ring-0 outline-none transition-colors resize-none"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full bg-bindu-navy hover:bg-bindu-orange text-white h-14 text-sm uppercase tracking-widest font-bold transition-colors">
                  Send Message
                </Button>
              </form>
            )}
          </div>
          
        </div>
      </section>
    </div>
  )
}
