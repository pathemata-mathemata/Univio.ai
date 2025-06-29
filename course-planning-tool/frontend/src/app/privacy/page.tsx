import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: December 2024</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">1. Introduction</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              UniVio.AI ("we," "our," or "us") is committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              use our course planning and transfer assistance platform at univio.ai (the "Service").
            </p>
            <p className="mb-4 text-gray-300 leading-relaxed">
              By using our Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">2.1 Personal Information</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">We collect the following personal information:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Name, email address, and phone number</li>
              <li>Educational institution information</li>
              <li>Academic records and course history</li>
              <li>Transfer goals and career objectives</li>
              <li>Academic advisor information (if provided)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">2.2 Educational Data</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">We collect academic information including:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Course enrollment and completion records</li>
              <li>Grades and GPA information</li>
              <li>Transfer credit evaluations</li>
              <li>Degree progress tracking</li>
              <li>Academic planning documents</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">2.3 Technical Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Usage patterns and preferences</li>
              <li>Log files and analytics data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">3. How We Use Your Information</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">We use your information to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Provide personalized course planning and transfer assistance</li>
              <li>Generate AI-powered academic recommendations</li>
              <li>Track your degree progress and requirements</li>
              <li>Send important updates about your academic plan</li>
              <li>Improve our Service and develop new features</li>
              <li>Comply with legal obligations and educational regulations</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">4.1 We Do Not Sell Your Data</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties for commercial purposes.
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">4.2 Limited Sharing</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">We may share your information only in these circumstances:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li><strong>Educational Institutions:</strong> With your explicit consent, to facilitate transfer applications</li>
              <li><strong>Service Providers:</strong> Trusted third parties who assist in operating our Service</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Safety:</strong> To prevent fraud or protect user safety</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">4.3 ASSIST.org Integration</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We retrieve publicly available transfer requirement data from ASSIST.org to provide accurate 
              course planning. No personal information is shared with ASSIST.org.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">5. Data Security</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">We implement industry-standard security measures:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>End-to-end encryption for data transmission</li>
              <li>Secure database storage with encryption at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Multi-factor authentication for account access</li>
              <li>Limited access controls for our team members</li>
              <li>Secure backup and disaster recovery procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">6. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">6.1 California Residents (CCPA)</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">Under the California Consumer Privacy Act, you have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Know what personal information we collect about you</li>
              <li>Delete your personal information</li>
              <li>Opt-out of the sale of personal information (we don't sell data)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">6.2 General Rights</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Access and download your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability to other services</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">6.3 Exercising Your Rights</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              To exercise your rights, contact us at <a href="mailto:privacy@univio.ai" className="text-blue-400 underline">privacy@univio.ai</a> 
              or through your account settings. We will respond within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">7. Data Retention</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We retain your information for as long as necessary to provide our Service and comply with legal obligations:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Academic Records:</strong> 7 years after graduation or account deletion</li>
              <li><strong>Communication Records:</strong> 3 years for customer support purposes</li>
              <li><strong>Analytics Data:</strong> Anonymized after 2 years</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">8. International Data Transfers</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your information in accordance 
              with this Privacy Policy and applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">9. Children's Privacy</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Our Service is not intended for children under 13. We do not knowingly collect personal 
              information from children under 13. For users under 18, we require parental consent for 
              certain data processing activities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">10. Cookies and Tracking</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We use cookies and similar technologies to improve your experience. See our 
              <Link href="/cookies" className="text-blue-400 underline">Cookie Policy</Link> for detailed information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">11. Changes to This Policy</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by email or through our Service. Your continued use of the Service after such 
              modifications constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">12. Contact Information</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, contact us:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300"><strong>UniVio.AI Privacy Team</strong></p>
              <p className="text-gray-300">Email: <a href="mailto:privacy@univio.ai" className="text-blue-400 underline">privacy@univio.ai</a></p>
              <p className="text-gray-300">General Contact: <a href="mailto:info@univio.ai" className="text-blue-400 underline">info@univio.ai</a></p>
              <p className="text-gray-300">Address: [Your Business Address]</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              This Privacy Policy is effective as of December 2024 and governs the privacy practices of UniVio.AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 