import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | MaxMove',
  description: 'Terms and conditions for using the MaxMove logistics and delivery platform. Read our terms of service for important legal information.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-maxmove-900 mb-8">Terms of Service</h1>
          
          <Card className="p-8 shadow-md mb-8">
            <div className="prose max-w-none">
              <p className="text-sm text-maxmove-600 mb-6">Last updated: March 1, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">1. Introduction</h2>
                <p className="mb-4">
                  Welcome to MaxMove. These Terms of Service ("Terms") govern your use of the MaxMove website, mobile application, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Services.
                </p>
                <p>
                  Our Privacy Policy, available at <Link href="/privacy-policy" className="text-maxmove-600 hover:text-maxmove-800 underline">https://maxmove.com/privacy-policy</Link>, also governs your use of our Services and explains how we collect, safeguard and disclose information that results from your use of our web pages.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">2. Definitions</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>"Service"</strong> refers to the MaxMove application, website, and services operated by MaxMove GmbH.</li>
                  <li><strong>"User"</strong> refers to individuals who register for and use our Services, including both customers requesting deliveries and drivers providing delivery services.</li>
                  <li><strong>"Customer"</strong> refers to individuals or businesses that request delivery services through our platform.</li>
                  <li><strong>"Driver"</strong> refers to independent contractors who provide delivery services through our platform.</li>
                  <li><strong>"Content"</strong> refers to text, images, or other information that can be posted, uploaded, linked to or otherwise made available through the Services.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">3. User Accounts</h2>
                <p className="mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p className="mb-4">
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                </p>
                <p>
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">4. Service Usage</h2>
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">4.1 Customers</h3>
                <p className="mb-4">
                  As a Customer, you may use our Services to request delivery services. You are responsible for providing accurate information about the pick-up and delivery locations, as well as any special instructions for the delivery.
                </p>
                <p className="mb-4">
                  You agree to be present at the pick-up location at the scheduled time, or to ensure that the package is available for pick-up as arranged. Similarly, you are responsible for ensuring that someone is available to receive the delivery at the destination.
                </p>
                <p className="mb-4">
                  You are responsible for the contents of any package sent through our Services. You agree not to send any prohibited items, including but not limited to illegal substances, dangerous goods, or perishable items without proper packaging.
                </p>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2 mt-6">4.2 Drivers</h3>
                <p className="mb-4">
                  As a Driver, you are an independent contractor and not an employee of MaxMove. You are responsible for complying with all applicable laws and regulations, including those related to transportation, taxes, and insurance.
                </p>
                <p className="mb-4">
                  You are required to maintain your vehicle in good operating condition and to drive safely and in compliance with all traffic laws. You are also required to maintain appropriate insurance coverage as required by law.
                </p>
                <p>
                  You understand that MaxMove does not guarantee a minimum number of delivery requests and that the number of requests you receive may vary based on factors such as your location, availability, and customer demand.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">5. Payment Terms</h2>
                <p className="mb-4">
                  Customers agree to pay the fees indicated for the delivery services requested. Fees may vary based on factors such as distance, size and weight of the package, time of day, and demand.
                </p>
                <p className="mb-4">
                  Drivers will receive payment for completed deliveries in accordance with the rates and payment schedule established by MaxMove, which may be updated from time to time.
                </p>
                <p>
                  MaxMove reserves the right to change its fees at any time, upon notice to Users through the Services or by email.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">6. Prohibited Uses</h2>
                <p className="mb-4">
                  You may use our Services only for lawful purposes and in accordance with these Terms. You agree not to use the Services:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>In any way that violates any applicable national or international law or regulation.</li>
                  <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                  <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
                  <li>To impersonate or attempt to impersonate MaxMove, a MaxMove employee, another user, or any other person or entity.</li>
                  <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
                  <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which, as determined by us, may harm MaxMove or users of the Services or expose them to liability.</li>
                </ul>
                <p>
                  Additionally, you agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Services in any manner that could disable, overburden, damage, or impair the site or interfere with any other party's use of the Services.</li>
                  <li>Use any robot, spider, or other automatic device, process, or means to access the Services for any purpose, including monitoring or copying any of the material on the site.</li>
                  <li>Introduce any viruses, trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful.</li>
                  <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services, the server on which the site is stored, or any server, computer, or database connected to the site.</li>
                  <li>Attack the site via a denial-of-service attack or a distributed denial-of-service attack.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">7. Limitation of Liability</h2>
                <p className="mb-4">
                  In no event shall MaxMove, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Services; (ii) any conduct or content of any third party on the Services; (iii) any content obtained from the Services; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>
                <p>
                  Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for incidental or consequential damages. Accordingly, some of the above limitations may not apply to you.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">8. Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with the laws of Germany, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Services, and supersede and replace any prior agreements we might have between us regarding the Services.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">9. Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Services.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">10. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at <a href="mailto:legal@maxmove.com" className="text-maxmove-600 hover:text-maxmove-800 underline">legal@maxmove.com</a>.
                </p>
              </section>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-maxmove-600 mb-4">
              For questions regarding our terms, please contact our legal team at{' '}
              <a href="mailto:legal@maxmove.com" className="text-maxmove-600 hover:text-maxmove-800 underline">
                legal@maxmove.com
              </a>
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/privacy-policy" className="text-sm text-maxmove-600 hover:text-maxmove-800 underline">
                Privacy Policy
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