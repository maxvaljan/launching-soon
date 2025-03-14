import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'Cookie Policy | MaxMove',
  description: 'Cookie policy for the MaxMove logistics platform. Learn about the cookies we use and how they enhance your experience.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-maxmove-900 mb-8">Cookie Policy</h1>
          
          <Card className="p-8 shadow-md mb-8">
            <div className="prose max-w-none">
              <p className="text-sm text-maxmove-600 mb-6">Last updated: March 1, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">1. Introduction</h2>
                <p className="mb-4">
                  This Cookie Policy explains how MaxMove ("we", "us", or "our") uses cookies and similar technologies on our website, mobile application, and online services (collectively, the "Service").
                </p>
                <p>
                  By using our Service, you consent to the use of cookies in accordance with this Cookie Policy. If you do not accept the use of cookies, please disable them as described below so they are not downloaded to your device when you use our Service.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">2. What Are Cookies</h2>
                <p className="mb-4">
                  Cookies are small text files that are placed on your computer, mobile device, or other device by a webpage server. They are widely used to make websites work more efficiently, as well as to provide information to the website owners.
                </p>
                <p>
                  Cookies allow our Service to recognize your device and remember certain information about your visit, such as your preferences and settings. This helps us improve your experience and provide you with personalized services.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">3. Types of Cookies We Use</h2>
                <p className="mb-4">
                  We use the following types of cookies on our Service:
                </p>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">3.1 Essential Cookies</h3>
                <p className="mb-4">
                  These cookies are necessary for the Service to function properly. They enable core functionality such as security, network management, and account access. You may disable these by changing your browser settings, but this may affect how the Service functions.
                </p>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">3.2 Performance and Analytics Cookies</h3>
                <p className="mb-4">
                  These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. They help us measure and improve the performance of our Service.
                </p>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">3.3 Functionality Cookies</h3>
                <p className="mb-4">
                  These cookies allow the Service to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. They can also be used to remember changes you have made to text size, fonts, and other customizable parts of the website.
                </p>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">3.4 Targeting and Advertising Cookies</h3>
                <p className="mb-4">
                  These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They remember that you have visited a website and this information may be shared with other organizations such as advertisers.
                </p>
                
                <h3 className="text-lg font-medium text-maxmove-800 mb-2">3.5 Social Media Cookies</h3>
                <p>
                  These cookies are set by social media services that we have added to the site to enable you to share our content with your friends and networks. They are capable of tracking your browser across other sites and building up a profile of your interests. This may impact the content and messages you see on other websites you visit.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">4. Specific Cookies We Use</h2>
                <p className="mb-4">
                  Here is a list of the main cookies we use and what we use them for:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Cookie Name</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Purpose</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">session_id</td>
                        <td className="border border-gray-300 px-4 py-2">Preserves user session state across page requests</td>
                        <td className="border border-gray-300 px-4 py-2">Session</td>
                        <td className="border border-gray-300 px-4 py-2">Essential</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">_ga</td>
                        <td className="border border-gray-300 px-4 py-2">Google Analytics - Used to distinguish users</td>
                        <td className="border border-gray-300 px-4 py-2">2 years</td>
                        <td className="border border-gray-300 px-4 py-2">Analytics</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">_gid</td>
                        <td className="border border-gray-300 px-4 py-2">Google Analytics - Used to distinguish users</td>
                        <td className="border border-gray-300 px-4 py-2">24 hours</td>
                        <td className="border border-gray-300 px-4 py-2">Analytics</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">lang</td>
                        <td className="border border-gray-300 px-4 py-2">Remembers the user's selected language version</td>
                        <td className="border border-gray-300 px-4 py-2">Session</td>
                        <td className="border border-gray-300 px-4 py-2">Functionality</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">sb_preferences</td>
                        <td className="border border-gray-300 px-4 py-2">Stores user preferences in Supabase</td>
                        <td className="border border-gray-300 px-4 py-2">1 year</td>
                        <td className="border border-gray-300 px-4 py-2">Functionality</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">5. Managing Cookies</h2>
                <p className="mb-4">
                  Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies, or to alert you when cookies are being sent. The methods for doing so vary from browser to browser, and from version to version.
                </p>
                <p className="mb-4">
                  Please note that if you choose to reject cookies, you may not be able to use the full functionality of our Service.
                </p>
                <p className="mb-4">
                  You can generally find out how to manage cookies in your browser settings from the following links:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><a href="https://support.google.com/chrome/answer/95647?hl=en" target="_blank" rel="noopener noreferrer" className="text-maxmove-600 hover:text-maxmove-800 underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-maxmove-600 hover:text-maxmove-800 underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-maxmove-600 hover:text-maxmove-800 underline">Microsoft Edge</a></li>
                  <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-maxmove-600 hover:text-maxmove-800 underline">Safari</a></li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">6. Third-Party Cookies</h2>
                <p className="mb-4">
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.
                </p>
                <p>
                  The use of these cookies is subject to the respective privacy policies of these third parties. We do not have access to or control over cookies or other features that advertisers and third-party sites may use. The information practices of these third parties are not covered by our Privacy Policy or this Cookie Policy.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">7. Updates to This Cookie Policy</h2>
                <p>
                  We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page. You are advised to review this Cookie Policy periodically for any changes. Changes to this Cookie Policy are effective when they are posted on this page.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-maxmove-900 mb-4">8. Contact Us</h2>
                <p>
                  If you have any questions about our Cookie Policy, please contact us at <a href="mailto:privacy@maxmove.com" className="text-maxmove-600 hover:text-maxmove-800 underline">privacy@maxmove.com</a>.
                </p>
              </section>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-maxmove-600 mb-4">
              For cookie-related inquiries, please contact our privacy team at{' '}
              <a href="mailto:privacy@maxmove.com" className="text-maxmove-600 hover:text-maxmove-800 underline">
                privacy@maxmove.com
              </a>
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/terms" className="text-sm text-maxmove-600 hover:text-maxmove-800 underline">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="text-sm text-maxmove-600 hover:text-maxmove-800 underline">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}