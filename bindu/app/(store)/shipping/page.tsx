import Link from "next/link"
import { Truck, MapPin, Clock, PackageCheck } from "lucide-react"

export const metadata = {
  title: "Shipping & Delivery | Bindu Premium",
  description: "Information regarding Bindu Premium shipping rates, delivery times, and order tracking.",
}

export default function ShippingPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
          Shipping & Delivery
        </h1>
        <p className="text-bindu-text-muted text-lg">
          We are committed to delivering your premium menswear efficiently and securely across Bangladesh.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white border border-bindu-border-grey p-8 md:p-12">
          
          {/* Policy Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 pb-16 border-b border-bindu-border-grey">
            <div className="flex items-start gap-4">
              <Truck className="w-6 h-6 text-bindu-orange mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Free Shipping</h3>
                <p className="text-bindu-text-muted leading-relaxed">
                  Complimentary standard shipping is applied automatically to all orders over ৳5,000.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-bindu-orange mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Dispatch Times</h3>
                <p className="text-bindu-text-muted leading-relaxed">
                  Orders placed before 2:00 PM are typically processed and dispatched the same business day.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-bindu-orange mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Nationwide Coverage</h3>
                <p className="text-bindu-text-muted leading-relaxed">
                  We deliver to all 64 districts in Bangladesh through our trusted logistics partners.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <PackageCheck className="w-6 h-6 text-bindu-orange mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Order Tracking</h3>
                <p className="text-bindu-text-muted leading-relaxed">
                  You will receive an SMS and email with tracking details once your package leaves our fulfillment center.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-bindu max-w-none">
            <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
              Delivery Rates & Times
            </h2>
            
            <div className="overflow-x-auto mb-12">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-bindu-navy">
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Region</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy">Estimated Time</th>
                    <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-bindu-navy text-right">Standard Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bindu-border-grey text-bindu-text-muted">
                  <tr>
                    <td className="py-4 px-4 font-medium text-bindu-navy">Inside Dhaka City</td>
                    <td className="py-4 px-4">1-2 Business Days</td>
                    <td className="py-4 px-4 text-right">৳80</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-bindu-navy">Dhaka Suburbs (Savar, Gazipur, etc.)</td>
                    <td className="py-4 px-4">2-3 Business Days</td>
                    <td className="py-4 px-4 text-right">৳100</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-bindu-navy">Outside Dhaka (All other districts)</td>
                    <td className="py-4 px-4">3-5 Business Days</td>
                    <td className="py-4 px-4 text-right">৳150</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
              Important Notes
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-bindu-text-muted mb-12">
              <li>Business days are Sunday through Thursday, excluding national holidays.</li>
              <li>Delivery times are estimates and commence from the date of shipping, rather than the date of order.</li>
              <li>During promotional periods, campaigns, or extreme weather conditions, delivery times may be slightly extended.</li>
              <li>If your package appears damaged upon arrival, please refuse the delivery and contact us immediately.</li>
            </ul>

            <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
              Need Assistance?
            </h3>
            <p className="text-bindu-text-muted mb-0">
              If you have any questions regarding your delivery or if your order is delayed, please don't hesitate to <Link href="/contact" className="text-bindu-orange hover:underline font-medium">contact our support team</Link> with your order number. We are here to help.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
