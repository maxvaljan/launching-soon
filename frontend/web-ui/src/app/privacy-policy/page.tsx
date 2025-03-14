import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | MaxMove',
  description: 'Privacy policy for the MaxMove logistics and delivery platform. Learn how we handle your personal data and protect your privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-maxmove-900 mb-8">Privacy Policy</h1>
          
          <Card className="p-8 shadow-md mb-8">
            <div className="prose max-w-none">
              <p className="text-sm text-maxmove-600 mb-6">Last updated: March 1, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">1. Introduction</h2>
                <p className="mb-4">
                  At MaxMove, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services (collectively, the "Service").
                </p>
                <p>
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">2.1 Personal Data</h3>
                <p className="mb-4">
                  We collect personal information that you voluntarily provide to us when you register for the Service, express an interest in obtaining information about us or our products and services, or otherwise contact us. The personal information we collect may include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Name and contact information (email address, phone number, etc.)</li>
                  <li>Account credentials (username, password, etc.)</li>
                  <li>Profile information (profile picture, preferences, etc.)</li>
                  <li>Payment information (credit card details, billing address, etc.)</li>
                  <li>Location information (GPS data, pickup and delivery addresses, etc.)</li>
                  <li>Identity verification information (for drivers: driving license, vehicle information, etc.)</li>
                </ul>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">2.2 Usage Data</h3>
                <p className="mb-4">
                  We also collect information about how the Service is accessed and used. This usage data may include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Device information (IP address, browser type, device type, etc.)</li>
                  <li>Log data (time and date of access, features used, crashes, etc.)</li>
                  <li>Cookies and tracking technologies</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">
                  We use the collected data for various purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To allow you to participate in interactive features of our Service</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent, and address technical issues</li>
                  <li>To fulfill any other purpose for which you provide it</li>
                  <li>To process and manage delivery requests</li>
                  <li>To facilitate payments and transactions</li>
                  <li>To verify driver identity and eligibility</li>
                  <li>To communicate with you about promotions, updates, and other information about our Service</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">4. Data Sharing and Disclosure</h2>
                <p className="mb-4">
                  We may share your personal information in the following situations:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business.
                  </li>
                  <li>
                    <strong>With Other Users:</strong> When you share personal information or otherwise interact in public areas with other users, such information may be viewed by all users and may be publicly distributed.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your information where we are legally required to do so.
                  </li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">5. Data Security</h2>
                <p className="mb-4">
                  The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
                <p>
                  We implement appropriate technical and organizational measures to protect the security of your personal information, including encryption, access controls, and regular security assessments.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">6. Your Data Protection Rights</h2>
                <p className="mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The right to access, update, or delete your information</li>
                  <li>The right to rectification (to correct information)</li>
                  <li>The right to object (to processing of your information)</li>
                  <li>The right of restriction (to limit processing of your information)</li>
                  <li>The right to data portability (to receive an electronic copy of your information)</li>
                  <li>The right to withdraw consent</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">7. Cookies and Tracking Technologies</h2>
                <p className="mb-4">
                  We use cookies and similar tracking technologies to track the activity on our Service and we hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
                </p>
                <p className="mb-4">
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>
                <p>
                  For more information about the cookies we use, please see our <Link href="/cookie-policy" className="text-maxmove-600 hover:text-maxmove-800 underline">Cookie Policy</Link>.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">8. Children's Privacy</h2>
                <p>
                  Our Service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">9. Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">10. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@maxmove.com" className="text-maxmove-600 hover:text-maxmove-800 underline">privacy@maxmove.com</a>.
                </p>
              </section>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-maxmove-600 mb-4">
              For privacy-related inquiries, please contact our privacy team at{' '}
              <a href="mailto:privacy@maxmove.com" className="text-maxmove-600 hover:text-maxmove-800 underline">
                privacy@maxmove.com
              </a>
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/terms" className="text-sm text-maxmove-600 hover:text-maxmove-800 underline">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-sm text-maxmove-600 hover:text-maxmove-800 underline">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}