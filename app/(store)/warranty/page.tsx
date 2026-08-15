import type { Metadata } from "next"
import { ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Warranty Policy | Bindu Premium",
  description: "Bindu Premium warranty and quality guarantee policy. We stand behind every piece we make.",
}

const sections = [
  {
    title: "Quality Guarantee",
    body: "Every Bindu Premium piece is produced under strict quality control. If your item arrives with a manufacturing defect — faulty stitching, broken hardware, or printing errors — we will replace it at no cost within 7 days of delivery.",
  },
  {
    title: "What Is Covered",
    items: [
      "Manufacturing defects in stitching or construction",
      "Incorrect item sent (wrong size, color, or product)",
      "Printing defects present at the time of delivery",
      "Broken zippers, buttons, or hardware on arrival",
    ],
  },
  {
    title: "What Is Not Covered",
    items: [
      "Normal wear and tear over time",
      "Damage caused by improper washing or ironing",
      "Fading due to prolonged sun exposure",
      "Damage resulting from misuse or alterations",
      "Items without proof of purchase from Bindu Premium",
    ],
  },
  {
    title: "How to Claim",
    body: "To make a warranty claim, contact us within 7 days of delivery via WhatsApp or the Contact page. Include your order number and clear photos of the defect. We will review your claim within 24–48 hours and arrange a replacement or refund if the claim is approved.",
  },
  {
    title: "Care Instructions",
    body: "To preserve the quality of your Bindu Premium items: machine wash cold on a gentle cycle, turn garments inside out before washing, do not bleach, hang to dry or tumble dry on low heat, iron inside out on a low setting. Following these instructions keeps your pieces looking sharp for longer and is not required for warranty claims.",
  },
]

export default function WarrantyPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">

      {/* Header */}
      <div className="border-b border-bindu-border-grey py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-14 max-w-4xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <ShieldCheck className="w-6 h-6 text-bindu-orange shrink-0" />
            <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-bindu-orange">Quality Promise</p>
          </div>
          <h1
            className="font-heading font-black text-bindu-navy uppercase leading-none tracking-tighter mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            Warranty Policy
          </h1>
          <p className="text-bindu-text-muted text-sm max-w-xl mx-auto leading-relaxed">
            We build Bindu Premium to last. Every item leaves our facility checked — and if something slips through, we make it right.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-14 max-w-4xl py-16 md:py-24 space-y-12">
        {sections.map((section) => (
          <div key={section.title} className="border-t border-bindu-border-grey pt-10">
            <h2 className="font-heading font-bold text-bindu-navy uppercase tracking-tight text-xl mb-5">
              {section.title}
            </h2>
            {section.body && (
              <p className="text-bindu-text-muted text-sm leading-relaxed max-w-2xl">{section.body}</p>
            )}
            {section.items && (
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-bindu-text-muted text-sm">
                    <span className="w-1.5 h-1.5 bg-bindu-orange rounded-full mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Contact CTA */}
        <div className="border-t border-bindu-border-grey pt-10">
          <div className="bg-white border border-bindu-border-grey p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-bindu-orange mb-2">Need Help?</p>
              <p className="text-bindu-navy font-heading font-bold text-lg uppercase tracking-tight">Contact Our Team</p>
              <p className="text-bindu-text-muted text-xs mt-1">We respond within 24 hours.</p>
            </div>
            <a
              href="/contact"
              className="px-8 py-3 bg-bindu-navy text-white text-xs font-bold uppercase tracking-widest hover:bg-bindu-orange transition-colors shrink-0"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
