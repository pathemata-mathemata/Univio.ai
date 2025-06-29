import Link from 'next/link';
import { Shield, Lock, Eye, Server, CheckCircle } from 'lucide-react';

export default function Security() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 mr-3 text-green-400" />
            <h1 className="text-4xl font-bold">Security</h1>
          </div>
          <p className="text-gray-400">Last updated: December 2024</p>
          <p className="text-gray-300 mt-4 text-lg leading-relaxed">
            Your trust is paramount to us. We implement industry-leading security measures to protect your 
            personal information and academic data.
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center">
              <Lock className="w-6 h-6 mr-2" />
              Data Encryption
            </h2>
            
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-medium mb-3 text-white">End-to-End Protection</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                <li><strong>Encryption in Transit:</strong> All data transmitted between your device and our servers is protected using TLS 1.3 encryption</li>
                <li><strong>Encryption at Rest:</strong> Your data is encrypted using AES-256 encryption when stored in our databases</li>
                <li><strong>Key Management:</strong> Encryption keys are managed using hardware security modules (HSMs)</li>
                <li><strong>Database Security:</strong> Multiple layers of encryption protect your academic records and personal information</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <h4 className="font-semibold text-white">TLS 1.3 Encryption</h4>
                </div>
                <p className="text-gray-300 text-sm">Latest encryption protocol for all data transmission</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <h4 className="font-semibold text-white">AES-256 Storage</h4>
                </div>
                <p className="text-gray-300 text-sm">Military-grade encryption for stored data</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center">
              <Server className="w-6 h-6 mr-2" />
              Infrastructure Security
            </h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">Cloud Security</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              Our infrastructure is built on enterprise-grade cloud platforms with multiple security certifications:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-1">
              <li>SOC 2 Type II certified data centers</li>
              <li>ISO 27001 compliance for information security management</li>
              <li>Multi-region data replication for disaster recovery</li>
              <li>Automated security monitoring and threat detection</li>
              <li>Regular penetration testing and vulnerability assessments</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">Network Security</h3>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6">
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li><strong>Firewall Protection:</strong> Multi-layer firewall systems protect against unauthorized access</li>
                <li><strong>DDoS Protection:</strong> Advanced protection against distributed denial-of-service attacks</li>
                <li><strong>Intrusion Detection:</strong> 24/7 monitoring for suspicious network activity</li>
                <li><strong>VPN Access:</strong> Secure remote access for our team members only</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              Access Controls & Authentication
            </h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">User Authentication</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Multi-Factor Authentication (MFA)</h4>
                <p className="text-gray-300 text-sm">Required for all accounts to add an extra layer of security</p>
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Strong Password Policy</h4>
                <p className="text-gray-300 text-sm">Enforced password complexity and regular rotation</p>
              </div>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white">Internal Access Controls</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li><strong>Principle of Least Privilege:</strong> Team members have access only to data necessary for their role</li>
              <li><strong>Role-Based Access:</strong> Strict access controls based on job function and responsibility</li>
              <li><strong>Access Logging:</strong> All access to user data is logged and monitored</li>
              <li><strong>Regular Access Reviews:</strong> Periodic audits of access permissions and privileges</li>
              <li><strong>Secure Development:</strong> Code reviews and security testing for all software updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Data Protection & Privacy</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">Educational Data Privacy</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We understand the sensitive nature of educational data and implement special protections:
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li><strong>FERPA Compliance:</strong> Adherence to Family Educational Rights and Privacy Act requirements</li>
                <li><strong>CCPA Compliance:</strong> Full compliance with California Consumer Privacy Act</li>
                <li><strong>GDPR Ready:</strong> European privacy standards implemented globally</li>
                <li><strong>Data Minimization:</strong> We collect only the data necessary to provide our service</li>
                <li><strong>Retention Policies:</strong> Clear data retention and deletion policies</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white">Third-Party Security</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              All third-party services and vendors undergo rigorous security assessments:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Security questionnaires and audits for all vendors</li>
              <li>Data processing agreements (DPAs) with strict security requirements</li>
              <li>Regular security reviews of third-party integrations</li>
              <li>Limited data sharing with explicit user consent only</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Incident Response & Monitoring</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">24/7 Security Monitoring</h4>
                <p className="text-gray-300 text-sm">Continuous monitoring for security threats and anomalies</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Incident Response Plan</h4>
                <p className="text-gray-300 text-sm">Established procedures for rapid response to security incidents</p>
              </div>
            </div>

            <h3 className="text-xl font-medium mb-3 text-white">Security Monitoring</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Real-time threat detection and alerting systems</li>
              <li>Automated security scanning and vulnerability assessment</li>
              <li>Log analysis and security information event management (SIEM)</li>
              <li>Regular security audits by independent third parties</li>
              <li>Continuous security training for all team members</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">Incident Response</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              In the unlikely event of a security incident, we have established procedures to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-1">
              <li>Immediately contain and assess the incident</li>
              <li>Notify affected users within 72 hours when required by law</li>
              <li>Coordinate with law enforcement and regulatory authorities as needed</li>
              <li>Conduct post-incident analysis and implement preventive measures</li>
              <li>Provide regular updates throughout the resolution process</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Compliance & Certifications</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">SOC 2</div>
                <div className="text-sm text-gray-300">Type II Certified</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">ISO 27001</div>
                <div className="text-sm text-gray-300">Compliant</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">CCPA</div>
                <div className="text-sm text-gray-300">Compliant</div>
              </div>
            </div>

            <p className="mb-4 text-gray-300 leading-relaxed">
              We maintain compliance with major security and privacy frameworks to ensure the highest 
              standards of data protection for our users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Your Security Responsibilities</h2>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3 text-white">Best Practices for Users</h3>
              <p className="mb-4 text-gray-300 leading-relaxed">
                While we implement comprehensive security measures, your security also depends on following best practices:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li>Use a strong, unique password for your UniVio.AI account</li>
                <li>Enable multi-factor authentication (MFA) on your account</li>
                <li>Keep your contact information up to date for security notifications</li>
                <li>Log out of your account when using public computers</li>
                <li>Report suspicious activity immediately</li>
                <li>Keep your browser and devices updated with security patches</li>
                <li>Never share your login credentials with others</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Security Updates & Transparency</h2>
            
            <h3 className="text-xl font-medium mb-3 text-white">Regular Security Updates</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We continuously improve our security posture through:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-1">
              <li>Regular security patches and system updates</li>
              <li>Quarterly security assessments and penetration testing</li>
              <li>Annual third-party security audits</li>
              <li>Continuous monitoring of emerging security threats</li>
              <li>Regular review and update of security policies</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 text-white">Transparency Commitment</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              We believe in transparency about our security practices. This security page is updated regularly 
              to reflect our current security measures and any material changes to our security posture.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">Report Security Issues</h2>
            <p className="mb-4 text-gray-300 leading-relaxed">
              If you discover a security vulnerability or have security concerns, please contact us immediately:
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
              <p className="text-gray-300 mb-2"><strong>Security Team:</strong></p>
              <p className="text-gray-300">Email: <a href="mailto:security@univio.ai" className="text-red-400 underline">security@univio.ai</a></p>
              <p className="text-gray-300">For urgent security issues: <a href="mailto:urgent-security@univio.ai" className="text-red-400 underline">urgent-security@univio.ai</a></p>
              <p className="text-gray-300 mt-4 text-sm">
                We appreciate responsible disclosure and will acknowledge receipt of security reports within 24 hours.
              </p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              This Security page is effective as of December 2024. We may update our security practices to 
              maintain the highest standards of protection for your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 