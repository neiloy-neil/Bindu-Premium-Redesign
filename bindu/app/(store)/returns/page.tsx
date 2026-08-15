import Link from "next/link"
import { RefreshCcw, ShieldAlert, BadgeInfo } from "lucide-react"

export const metadata = {
  title: "Returns & Exchanges | Bindu Premium",
  description: "Bindu Premium's return policy, exchange procedures, and defective item handling.",
}

export default function ReturnsPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
          Returns & Exchanges
        </h1>
        <p className="text-bindu-text-muted text-lg">
          We stand behind the quality of our garments. If you are not entirely satisfied with your purchase, we're here to help.
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white border border-bindu-border-grey p-8 md:p-12">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-bindu-border-grey">
            <div className="flex flex-col items-center text-center">
              <RefreshCcw className="w-8 h-8 text-bindu-orange mb-4" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">7-Day Window</h3>
              <p className="text-sm text-bindu-text-muted">Return or exchange within 7 days of delivery.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <BadgeInfo className="w-8 h-8 text-bindu-orange mb-4" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Original Condition</h3>
              <p className="text-sm text-bindu-text-muted">Items must be unworn, unwashed, with tags attached.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <ShieldAlert className="w-8 h-8 text-bindu-orange mb-4" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Final Sale</h3>
              <p className="text-sm text-bindu-text-muted">Undergarments and clearance items cannot be returned.</p>
            </div>
          </div>

          <div className="prose prose-bindu max-w-none">
            <h2 className="text-2xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
              Our Return Policy
            </h2>
            <p className="text-bindu-text-muted mb-6">
              Bindu Premium accepts returns and exchanges on full-priced merchandise that has not been worn, altered, or washed, and with all original tags attached. Returns must be initiated within 7 days of receiving your order.
            </p>
            
            <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4 mt-12">
              How to Initiate a Return or Exchange
            </h3>
            <ol className="list-decimal pl-5 space-y-4 text-bindu-text-muted mb-12">
              <li><strong>Contact Support:</strong> Reach out to our customer service team via <Link href="/contact" className="text-bindu-orange hover:underline font-medium">Contact Form</Link> or WhatsApp within 7 days of delivery. Include your Order ID and reason for return.</li>
              <li><strong>Approval & Pickup:</strong> Once approved, we will arrange a reverse pickup from your delivery address within 2-3 business days.</li>
              <li><strong>Quality Check:</strong> Upon receiving the item at our facility, our quality control team will inspect the garment.</li>
              <li><strong>Resolution:</strong> If the item passes inspection, we will dispatch your requested exchange item or process your refund within 3 business days.</li>
            </ol>

            <div className="bg-bindu-light-grey p-6 border-l-4 border-bindu-orange mb-12">
              <h4 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-2">Defective or Incorrect Items</h4>
              <p className="text-sm text-bindu-text-muted mb-0">
                In the rare event that you receive a defective item or an incorrect order, please notify us within 48 hours of delivery. Include clear photographs of the defect. We will prioritize a replacement and cover all associated shipping costs.
              </p>
            </div>

            <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
              Exceptions & Non-Returnable Items
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-bindu-text-muted mb-12">
              <li><strong>Intimates:</strong> For hygiene reasons, undergarments (boxers, briefs, socks) are strictly non-returnable.</li>
              <li><strong>Sale Items:</strong> Items purchased during a Flash Sale, clearance event, or heavily discounted promotions are considered final sale.</li>
              <li><strong>Altered Items:</strong> Garments that have been tailored or altered in any way cannot be returned.</li>
            </ul>

            <h3 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
              Refund Process
            </h3>
            <p className="text-bindu-text-muted mb-0">
              Approved refunds will be processed back to the original method of payment. For Cash on Delivery (COD) orders, we will require your Mobile Banking (bKash/Nagad) details or Bank Account information to process the transfer. Please allow up to 7-10 business days for the refund to reflect in your account, depending on your bank's processing times.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
