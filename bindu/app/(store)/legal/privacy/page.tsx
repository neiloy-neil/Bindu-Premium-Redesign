export const metadata = {
  title: "Privacy Policy | Bindu Premium",
  description: "Bindu Premium Privacy Policy. Learn how we collect, use, and protect your personal data.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-bindu-light-grey min-h-screen pb-32">
      {/* Header */}
      <section className="pt-32 pb-16 px-4 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-bindu-navy uppercase tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-bindu-text-muted text-sm font-bold uppercase tracking-widest">
          Last Updated: August 2026
        </p>
      </section>

      {/* Main Content */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="bg-white border border-bindu-border-grey p-8 md:p-16 prose prose-bindu max-w-none">
          
          <p className="lead text-lg text-bindu-navy font-medium mb-8">
            At Bindu Premium, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our website and services.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-bindu-text-muted">
            We collect information you provide directly to us when you make a purchase, create an account, sign up for our newsletter, or contact customer support. This may include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-bindu-text-muted mb-8">
            <li>Name and contact information (email, phone number, shipping/billing address).</li>
            <li>Payment details (processed securely via our payment gateways; we do not store full credit card numbers).</li>
            <li>Account credentials and purchase history.</li>
            <li>Communications and correspondence.</li>
          </ul>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-bindu-text-muted">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-bindu-text-muted mb-8">
            <li>To process and fulfill your orders, including sending shipping notifications.</li>
            <li>To communicate with you about products, services, offers, and promotions (if opted in).</li>
            <li>To improve our website, customer service, and overall shopping experience.</li>
            <li>To detect, prevent, and address fraud or technical issues.</li>
          </ul>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            3. Information Sharing
          </h2>
          <p className="text-bindu-text-muted mb-8">
            We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers (such as logistics partners and payment processors) strictly for the purpose of operating our business and fulfilling your orders. These partners are bound by confidentiality agreements.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            4. Cookies & Tracking
          </h2>
          <p className="text-bindu-text-muted mb-8">
            Our website uses cookies and similar technologies to enhance your browsing experience, remember your preferences, and analyze site traffic. You can choose to disable cookies through your browser settings, though this may affect the functionality of certain site features.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            5. Data Security
          </h2>
          <p className="text-bindu-text-muted mb-8">
            We implement industry-standard security measures, including SSL encryption, to protect your personal information during transmission and storage. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-heading font-bold text-bindu-navy uppercase tracking-tight mt-12 mb-4">
            6. Your Rights
          </h2>
          <p className="text-bindu-text-muted mb-8">
            You have the right to access, update, or request the deletion of your personal information. If you wish to exercise these rights or opt-out of marketing communications, please contact us or manage your preferences through your account settings.
          </p>

          <div className="mt-16 pt-8 border-t border-bindu-border-grey">
            <h3 className="text-sm font-bold uppercase tracking-widest text-bindu-navy mb-4">Contacting Us</h3>
            <p className="text-bindu-text-muted text-sm">
              If you have any questions regarding this Privacy Policy, please contact our Data Protection Officer at: <br/>
              <strong className="text-bindu-orange">privacy@bindupremium.com</strong>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
