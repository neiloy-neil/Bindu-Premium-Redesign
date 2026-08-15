import Link from "next/link"
import { Accordion } from "@/components/premium/Accordion"

export const metadata = {
  title: "FAQ | Bindu Premium",
  description: "Frequently Asked Questions about Bindu Premium orders, shipping, and returns.",
}

const faqData = [
  {
    category: "Orders & Payment",
    items: [
      {
        id: "order-1",
        title: "What payment methods do you accept?",
        content: "We accept Cash on Delivery (COD) nationwide. We also accept secure online payments via bKash, Nagad, and all major Credit/Debit Cards (Visa, Mastercard, Amex) through our secure payment gateway."
      },
      {
        id: "order-2",
        title: "Can I modify or cancel my order?",
        content: "Orders can only be modified or canceled within 2 hours of placement. Please contact our support team immediately via WhatsApp or Phone if you need to make changes. Once an order is processed for shipping, it cannot be altered."
      },
      {
        id: "order-3",
        title: "How do I use a promo code?",
        content: "You can apply your promo code during checkout. Look for the 'Gift card or discount code' field on the payment page, enter your code, and click 'Apply'."
      }
    ]
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        id: "shipping-1",
        title: "How long does delivery take?",
        content: "Inside Dhaka: 1-2 business days. Outside Dhaka: 3-5 business days. Please note that during major campaigns or holidays, delivery times may be slightly extended."
      },
      {
        id: "shipping-2",
        title: "Do you offer free shipping?",
        content: "Yes, we offer complimentary standard shipping on all orders over ৳5,000 nationwide."
      },
      {
        id: "shipping-3",
        title: "How can I track my order?",
        content: "Once your order is dispatched, you will receive an SMS and email with your tracking number and a link to trace your package via our courier partner's portal."
      }
    ]
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        id: "returns-1",
        title: "What is your return policy?",
        content: "We offer a 7-day return and exchange policy from the date of delivery. Items must be unworn, unwashed, and have all original tags attached. Please note that sale items and undergarments are final sale."
      },
      {
        id: "returns-2",
        title: "How do I initiate an exchange?",
        content: "To initiate an exchange, please contact our support team with your Order ID and the reason for exchange. We will arrange a pickup for the original item and dispatch the replacement once the quality check is complete."
      },
      {
        id: "returns-3",
        title: "What if I receive a defective item?",
        content: "We apologize if you receive a defective product. Please contact us within 48 hours of delivery with photos of the defect, and we will process a replacement or full refund immediately."
      }
    ]
  },
  {
    category: "Product & Sizing",
    items: [
      {
        id: "product-1",
        title: "How do I find my size?",
        content: "Each product page features a detailed size chart. You can also view our comprehensive Size Guide page for measuring instructions. If you are between sizes, we generally recommend sizing up for a relaxed fit."
      },
      {
        id: "product-2",
        title: "Will the cotton garments shrink?",
        content: "Most of our cotton garments undergo a pre-shrinking process. However, to ensure longevity and minimal shrinkage, we recommend washing in cold water and hang-drying. Please refer to the specific care label on your garment."
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-bindu-text-muted text-lg">
          Everything you need to know about shopping with Bindu Premium. Can't find the answer? <Link href="/contact" className="text-bindu-orange hover:underline font-medium">Contact our support team.</Link>
        </p>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 border border-bindu-border-grey space-y-16">
          {faqData.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-6">
                {section.category}
              </h2>
              <Accordion items={section.items} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
