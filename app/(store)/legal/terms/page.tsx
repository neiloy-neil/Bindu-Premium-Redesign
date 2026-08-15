import Link from "next/link"

export const metadata = {
  title: "Terms & Conditions | Bindu Premium",
  description: "Terms and conditions of use for the Bindu Premium website and services.",
}

export default function TermsPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Terms & Conditions
        </h1>
        <p className="text-bindu-text-muted text-sm font-bold uppercase tracking-widest">
          Last Updated: August 2026
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-bindu-border-grey p-8 md:p-16 prose prose-bindu max-w-none">
          
          <p className="lead text-lg text-bindu-navy font-medium mb-8">
            Welcome to Bindu Premium. These Terms & Conditions govern your access to and use of our website, products, and services. By accessing or using our site, you agree to be bound by these terms.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            1. General Conditions
          </h2>
          <p className="text-bindu-text-muted mb-8">
            We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve transmissions over various networks. Credit card information is always encrypted during transfer over networks.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            2. Products and Pricing
          </h2>
          <p className="text-bindu-text-muted mb-8">
            All descriptions of products or product pricing are subject to change at anytime without notice, at our sole discretion. We reserve the right to discontinue any product at any time. We have made every effort to display as accurately as possible the colors and images of our products that appear on the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            3. Accuracy of Billing and Account Information
          </h2>
          <p className="text-bindu-text-muted mb-8">
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            4. User Comments and Feedback
          </h2>
          <p className="text-bindu-text-muted mb-8">
            If you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-bindu-text-muted mb-8">
            All content included on this site, such as text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of Bindu Premium or its content suppliers and protected by international copyright laws.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            6. Governing Law
          </h2>
          <p className="text-bindu-text-muted mb-8">
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Bangladesh.
          </p>

          <div className="mt-16 pt-8 border-t border-bindu-border-grey">
            <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-4">Contact Information</h3>
            <p className="text-bindu-text-muted text-sm">
              Questions about the Terms & Conditions should be sent to us at: <br/>
              <strong className="text-bindu-orange">legal@bindupremium.com</strong>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
