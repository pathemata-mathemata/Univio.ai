import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: December 2024</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Acceptance of Terms</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              These Terms of Service ("Terms") govern your use of UniVio.AI's course planning and transfer assistance 
              platform ("Service") operated by UniVio.AI ("we," "us," or "our"). By accessing or using our Service, 
              you agree to be bound by these Terms.
            </p>
            <p className="mb-4 text-gray-300 leading-relaxed">
              If you disagree with any part of these Terms, you may not access or use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Description of Service</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              UniVio.AI provides an online platform that helps California community college students plan their 
              academic courses and transfer to four-year universities. Our Service includes:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>AI-powered course planning and academic recommendations</li>
              <li>Transfer requirement tracking and progress monitoring</li>
              <li>Integration with ASSIST.org for accurate transfer information</li>
              <li>Personalized academic planning tools and resources</li>
              <li>Educational guidance and support features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. User Accounts and Registration</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">3.1 Account Creation</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              To use our Service, you must create an account by providing accurate, current, and complete information. 
              You are responsible for maintaining the security of your account credentials.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">3.2 Age Requirements</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You must be at least 13 years old to use our Service. Users under 18 must have parental consent. 
              By using our Service, you represent that you meet these age requirements.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">3.3 Account Responsibility</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You are responsible for all activities that occur under your account. You must notify us immediately 
              of any unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">4.1 Permitted Use</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">You may use our Service only for lawful purposes and in accordance with these Terms.</p>

            <h3 className="text-xl font-medium mb-3 text-white">4.2 Prohibited Activities</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">You agree not to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Share false, misleading, or inaccurate academic information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated scripts or bots to access the Service</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Distribute malware or harmful code</li>
              <li>Use the Service for commercial purposes without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Educational Disclaimer</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">5.1 Information Accuracy</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              While we strive to provide accurate and up-to-date information, educational requirements and transfer 
              policies can change. You should always verify requirements with official institutional sources.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">5.2 No Guarantee of Admission</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Our Service does not guarantee admission to any educational institution. Transfer decisions are made 
              solely by the receiving institutions based on their own criteria and policies.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">5.3 Professional Advice</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Our Service provides educational planning tools but does not replace professional academic counseling. 
              Always consult with qualified academic advisors for important educational decisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Subscription Plans and Billing</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">6.1 Free and Paid Services</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We offer both free and premium subscription plans. Premium features require payment and are subject 
              to the terms specified at the time of purchase.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">6.2 Payment Terms</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>All fees are in US dollars and are non-refundable unless required by law</li>
              <li>Subscription fees are billed in advance on a recurring basis</li>
              <li>You must provide valid payment information for paid services</li>
              <li>We may change subscription prices with 30 days' notice</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">6.3 Cancellation</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You may cancel your subscription at any time through your account settings. Cancellation takes effect 
              at the end of your current billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">7. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">7.1 Our Content</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              The Service and its original content, features, and functionality are owned by UniVio.AI and are 
              protected by international copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">7.2 Your Content</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You retain ownership of the personal information and academic data you provide. By using our Service, 
              you grant us a license to use this information to provide and improve our Service.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">7.3 Third-Party Content</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Our Service may include content from ASSIST.org and other educational institutions. This content 
              remains the property of its respective owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">8. Privacy and Data Protection</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our 
              <Link href="/privacy" className="text-blue-400 underline">Privacy Policy</Link>, which is incorporated 
              into these Terms by reference.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">9.1 Service Availability</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We provide our Service "as is" and "as available." We do not guarantee that the Service will be 
              uninterrupted, secure, or error-free.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">9.2 Limitation of Liability</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              To the maximum extent permitted by law, UniVio.AI shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, including but not limited to loss of data, revenue, or 
              educational opportunities.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">9.3 Maximum Liability</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Our total liability to you for any claims arising from these Terms or your use of the Service shall 
              not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">10. Indemnification</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You agree to indemnify and hold UniVio.AI harmless from any claims, damages, or expenses arising from 
              your use of the Service, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">11. Termination</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">11.1 Termination by You</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You may terminate your account at any time by contacting us or using the account deletion feature 
              in your settings.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">11.2 Termination by Us</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We may terminate or suspend your account immediately if you violate these Terms or engage in 
              prohibited activities.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">11.3 Effect of Termination</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Upon termination, your right to use the Service will cease immediately. We may retain certain 
              information as required by law or for legitimate business purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">12. Dispute Resolution</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">12.1 Governing Law</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of the State of California, 
              without regard to conflict of law principles.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">12.2 Arbitration</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Any disputes arising from these Terms or your use of the Service will be resolved through binding 
              arbitration rather than in court, except where prohibited by law.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">12.3 Class Action Waiver</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You agree that any arbitration will be limited to the dispute between you and UniVio.AI individually. 
              Class action lawsuits are not permitted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">13. Changes to Terms</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. Material changes will be communicated through 
              email or prominent notice on our Service. Your continued use after changes constitutes acceptance of 
              the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">14. Severability</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue 
              to be valid and enforceable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">15. Contact Information</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300"><strong>UniVio.AI Legal Team</strong></p>
              <p className="text-gray-300">Email: <a href="mailto:legal@univio.ai" className="text-blue-400 underline">legal@univio.ai</a></p>
              <p className="text-gray-300">General Contact: <a href="mailto:info@univio.ai" className="text-blue-400 underline">info@univio.ai</a></p>
              <p className="text-gray-300">Address: [Your Business Address]</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              These Terms of Service are effective as of December 2024 and govern your use of UniVio.AI's services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 