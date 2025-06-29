import Link from 'next/link';
import { Cookie, Settings, Eye, Shield } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <Cookie className="w-8 h-8 mr-3 text-orange-400" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
          </div>
          <p className="text-gray-400">Last updated: December 2024</p>
          <p className="text-gray-300 mt-4 text-lg leading-relaxed">
            This Cookie Policy explains how UniVio.AI uses cookies and similar technologies to provide, 
            protect, and improve our service.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">What Are Cookies?</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you 
              visit our website. They help us provide you with the best possible experience by remembering your 
              preferences and improving our service.
            </p>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Similar technologies include web beacons, pixels, local storage, and session storage, which serve 
              similar purposes to cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Shield className="w-6 h-6 mr-2 text-green-400" />
                  <h3 className="text-xl font-medium text-white">Essential Cookies</h3>
                </div>
                <p className="mb-3 text-gray-300 leading-relaxed">
                  These cookies are necessary for our website to function properly and cannot be disabled.
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-1">
                  <li><strong>Authentication:</strong> Keep you logged in to your account</li>
                  <li><strong>Security:</strong> Protect against fraud and ensure secure connections</li>
                  <li><strong>Site functionality:</strong> Remember your preferences and settings</li>
                  <li><strong>Load balancing:</strong> Ensure optimal performance across our servers</li>
                </ul>
                <div className="mt-4 text-sm">
                  <span className="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded">Always Active</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Settings className="w-6 h-6 mr-2 text-blue-400" />
                  <h3 className="text-xl font-medium text-white">Functional Cookies</h3>
                </div>
                <p className="mb-3 text-gray-300 leading-relaxed">
                  These cookies enhance your experience by remembering your choices and preferences.
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-1">
                  <li><strong>Language preferences:</strong> Remember your preferred language</li>
                  <li><strong>Theme settings:</strong> Save your display preferences</li>
                  <li><strong>Form data:</strong> Remember information you've entered in forms</li>
                  <li><strong>Course planning:</strong> Save your academic planning progress</li>
                  <li><strong>Dashboard layout:</strong> Remember your personalized dashboard setup</li>
                </ul>
                <div className="mt-4 text-sm">
                  <span className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Can be disabled</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Eye className="w-6 h-6 mr-2 text-purple-400" />
                  <h3 className="text-xl font-medium text-white">Analytics Cookies</h3>
                </div>
                <p className="mb-3 text-gray-300 leading-relaxed">
                  These cookies help us understand how you use our service so we can improve it.
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-1">
                  <li><strong>Usage analytics:</strong> Track how you navigate our platform</li>
                  <li><strong>Performance monitoring:</strong> Identify and fix technical issues</li>
                  <li><strong>Feature usage:</strong> Understand which features are most helpful</li>
                  <li><strong>Error tracking:</strong> Detect and resolve bugs</li>
                  <li><strong>A/B testing:</strong> Test improvements to our service</li>
                </ul>
                <div className="mt-4 text-sm">
                  <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Can be disabled</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Cookie className="w-6 h-6 mr-2 text-orange-400" />
                  <h3 className="text-xl font-medium text-white">Marketing Cookies</h3>
                </div>
                <p className="mb-3 text-gray-300 leading-relaxed">
                  These cookies help us show you relevant content and measure the effectiveness of our marketing.
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-1">
                  <li><strong>Personalized content:</strong> Show relevant educational resources</li>
                  <li><strong>Social media integration:</strong> Enable sharing and social features</li>
                  <li><strong>Campaign tracking:</strong> Measure marketing effectiveness</li>
                  <li><strong>Remarketing:</strong> Show relevant ads on other websites</li>
                  <li><strong>Conversion tracking:</strong> Understand how users find our service</li>
                </ul>
                <div className="mt-4 text-sm">
                  <span className="inline-block bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Can be disabled</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Specific Cookies We Use</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-900/50">
                    <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Cookie Name</th>
                    <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Purpose</th>
                    <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Duration</th>
                    <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Type</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr>
                    <td className="border border-gray-700 px-4 py-3 font-mono text-sm">univio_session</td>
                    <td className="border border-gray-700 px-4 py-3">Maintains your login session</td>
                    <td className="border border-gray-700 px-4 py-3">Session</td>
                    <td className="border border-gray-700 px-4 py-3"><span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-3 font-mono text-sm">univio_csrf</td>
                    <td className="border border-gray-700 px-4 py-3">Protects against security attacks</td>
                    <td className="border border-gray-700 px-4 py-3">Session</td>
                    <td className="border border-gray-700 px-4 py-3"><span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Essential</span></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-3 font-mono text-sm">univio_preferences</td>
                    <td className="border border-gray-700 px-4 py-3">Remembers your settings and preferences</td>
                    <td className="border border-gray-700 px-4 py-3">1 year</td>
                    <td className="border border-gray-700 px-4 py-3"><span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">Functional</span></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-3 font-mono text-sm">univio_analytics</td>
                    <td className="border border-gray-700 px-4 py-3">Tracks usage for service improvement</td>
                    <td className="border border-gray-700 px-4 py-3">2 years</td>
                    <td className="border border-gray-700 px-4 py-3"><span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">Analytics</span></td>
                  </tr>
                  <tr>
                    <td className="border border-gray-700 px-4 py-3 font-mono text-sm">univio_marketing</td>
                    <td className="border border-gray-700 px-4 py-3">Enables personalized marketing</td>
                    <td className="border border-gray-700 px-4 py-3">1 year</td>
                    <td className="border border-gray-700 px-4 py-3"><span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs">Marketing</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Third-Party Cookies</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We use some third-party services that may set their own cookies:
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Google Analytics</h4>
                <p className="text-gray-300 text-sm mb-2">Helps us understand website usage and performance</p>
                <p className="text-gray-300 text-xs">
                  Learn more: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Google Privacy Policy</a>
                </p>
              </div>
              
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Educational Partners</h4>
                <p className="text-gray-300 text-sm mb-2">Integration with ASSIST.org and other educational platforms</p>
                <p className="text-gray-300 text-xs">These services may use cookies for authentication and functionality</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Payment Processors</h4>
                <p className="text-gray-300 text-sm mb-2">Secure payment processing for premium subscriptions</p>
                <p className="text-gray-300 text-xs">Payment providers use cookies to ensure secure transactions</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Managing Your Cookie Preferences</h2>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium mb-3 text-white">Cookie Consent Manager</h3>
              <p className="mb-4 text-gray-300 leading-relaxed">
                When you first visit our website, you'll see a cookie consent banner that allows you to choose 
                which types of cookies you want to accept. You can change your preferences at any time.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Manage Cookie Preferences
              </button>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white">Browser Settings</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              You can also control cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-1">
              <li><strong>Chrome:</strong> Settings &gt; Privacy and security &gt; Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences &gt; Privacy &gt; Manage Website Data</li>
              <li><strong>Edge:</strong> Settings &gt; Cookies and site permissions &gt; Cookies and site data</li>
            </ul>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">⚠️ Important Note</h4>
              <p className="text-gray-300 text-sm">
                Disabling essential cookies may prevent you from using certain features of our service, 
                including logging in and accessing your course planning tools.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Mobile Apps and Local Storage</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Our mobile applications may use local storage and similar technologies to provide functionality 
              similar to cookies on websites. You can manage these through your device settings.
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li><strong>iOS:</strong> Settings &gt; Privacy &amp; Security &gt; Tracking</li>
              <li><strong>Android:</strong> Settings &gt; Privacy &gt; Ads</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Do Not Track</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Some browsers offer a "Do Not Track" feature that sends a signal to websites you visit indicating 
              you do not want to be tracked. We respect these signals and will not track users who have enabled 
              this feature, except for essential cookies necessary for functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">International Users</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">GDPR Compliance (EU Users)</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              For users in the European Union, we provide explicit consent mechanisms for all non-essential cookies 
              in compliance with the General Data Protection Regulation (GDPR).
            </p>

            <h3 className="text-xl font-medium mb-3 text-white">CCPA Compliance (California Users)</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              California residents have additional rights regarding cookies and tracking technologies under the 
              California Consumer Privacy Act (CCPA). See our <Link href="/privacy" className="text-blue-400 underline">Privacy Policy</Link> for more details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Updates to This Policy</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Updating the "Last updated" date at the top of this policy</li>
              <li>Displaying a prominent notice on our website</li>
              <li>Sending an email notification for significant changes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Contact Us</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-300"><strong>UniVio.AI Privacy Team</strong></p>
              <p className="text-gray-300">Email: <a href="mailto:privacy@univio.ai" className="text-blue-400 underline">privacy@univio.ai</a></p>
              <p className="text-gray-300">General Contact: <a href="mailto:info@univio.ai" className="text-blue-400 underline">info@univio.ai</a></p>
              <p className="text-gray-300">Subject Line: "Cookie Policy Inquiry"</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              This Cookie Policy is effective as of December 2024 and explains our use of cookies and similar 
              technologies on the UniVio.AI platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 