import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Truck, Package, Shield, ArrowRight } from "lucide-react";

// Using Next.js Server Component for enhanced performance and SEO
export const metadata = {
  title: "Our Services | MaxMove",
  description: "Discover MaxMove's logistics services - same-day delivery, scheduled deliveries, and business solutions for all your transport needs.",
  keywords: ["delivery services", "logistics", "same-day delivery", "business logistics", "package delivery"],
  openGraph: {
    title: "Our Services | MaxMove",
    description: "Discover MaxMove's logistics services - same-day delivery, scheduled deliveries, and business solutions for all your transport needs.",
    images: [{ url: '/images/services-og.jpg' }],
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-maxmove-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-maxmove-900 mb-6">
              Delivery Services Tailored to Your Needs
            </h1>
            <p className="text-lg text-maxmove-700 mb-8">
              From quick local deliveries to scheduled transport and business solutions,
              MaxMove offers reliable logistics services for individuals and companies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-maxmove-800 hover:bg-maxmove-900 text-white">
                <Link href="/book">Book a Delivery</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/business">Business Solutions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-maxmove-900 mb-4">
            Our Services
          </h2>
          <p className="text-center text-maxmove-700 max-w-3xl mx-auto mb-12">
            Whatever your delivery needs, we've got you covered with our range of services designed for speed, reliability, and convenience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Express Delivery */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src="/images/express-delivery.jpg"
                  alt="Express Delivery"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={true}
                  style={{ objectFit: "cover" }}
                  quality={80}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-maxmove-900">Express Delivery</h3>
                  <Clock className="h-6 w-6 text-maxmove-600" />
                </div>
                <p className="text-maxmove-700 mb-6">
                  Need it there fast? Our express service gets your package delivered within 2 hours in urban areas, with real-time tracking.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Delivery within 2 hours</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Live tracking and updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Available 7 days a week</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white">
                  <Link href="/book?type=express">Book Express Delivery</Link>
                </Button>
              </div>
            </Card>

            {/* Same-Day Delivery */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src="/images/same-day-delivery.jpg"
                  alt="Same-Day Delivery"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  quality={80}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-maxmove-900">Same-Day Delivery</h3>
                  <Truck className="h-6 w-6 text-maxmove-600" />
                </div>
                <p className="text-maxmove-700 mb-6">
                  Get your packages delivered on the same day. Perfect for when you need reliability without the express premium.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Delivered by end of day</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Cost-effective solution</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Order by 11am for same-day delivery</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white">
                  <Link href="/book?type=same-day">Book Same-Day Delivery</Link>
                </Button>
              </div>
            </Card>

            {/* Scheduled Delivery */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src="/images/scheduled-delivery.jpg"
                  alt="Scheduled Delivery"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  quality={80}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-maxmove-900">Scheduled Delivery</h3>
                  <Package className="h-6 w-6 text-maxmove-600" />
                </div>
                <p className="text-maxmove-700 mb-6">
                  Plan ahead with our scheduled delivery service. Choose your preferred date and time slot for maximum convenience.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Choose your delivery date & time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Book up to 30 days in advance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Flexible scheduling options</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-maxmove-800 hover:bg-maxmove-900 text-white">
                  <Link href="/book?type=scheduled">Book Scheduled Delivery</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Solutions */}
      <section className="py-16 bg-maxmove-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-maxmove-900 mb-4">
                Business Solutions
              </h2>
              <p className="text-maxmove-700 mb-6">
                MaxMove offers tailored logistics solutions for businesses of all sizes. From regular scheduled deliveries to API integration for your e-commerce platform, we have the tools to streamline your logistics operations.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-maxmove-100 p-2 rounded-full mr-4 mt-1">
                    <Shield className="h-5 w-5 text-maxmove-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-maxmove-900 mb-1">Dedicated Account Management</h3>
                    <p className="text-maxmove-700">Get personalized support from our dedicated account managers who understand your business needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-maxmove-100 p-2 rounded-full mr-4 mt-1">
                    <Truck className="h-5 w-5 text-maxmove-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-maxmove-900 mb-1">Fleet Management</h3>
                    <p className="text-maxmove-700">Access our diverse fleet of vehicles to meet all your delivery requirements, from small packages to large freight.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-maxmove-100 p-2 rounded-full mr-4 mt-1">
                    <MapPin className="h-5 w-5 text-maxmove-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-maxmove-900 mb-1">API Integration</h3>
                    <p className="text-maxmove-700">Seamlessly integrate our delivery services with your e-commerce platform or order management system.</p>
                  </div>
                </div>
              </div>
              
              <Button asChild className="bg-maxmove-800 hover:bg-maxmove-900 text-white">
                <Link href="/business">
                  Learn More About Business Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/business-solutions.jpg"
                alt="Business Logistics Solutions"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                quality={80}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-maxmove-900 mb-4">
            Our Service Areas
          </h2>
          <p className="text-center text-maxmove-700 max-w-3xl mx-auto mb-12">
            MaxMove operates across major cities in Germany, with plans to expand our coverage. Check if we deliver to your area.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Berlin</h3>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Munich</h3>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Hamburg</h3>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Cologne</h3>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Frankfurt</h3>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Stuttgart</h3>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Düsseldorf</h3>
            </div>
            <div className="bg-white shadow rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-maxmove-900">Leipzig</h3>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link href="/book">
                Check Your Delivery Area
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-maxmove-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-maxmove-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-maxmove-900 mb-3">How quickly can you deliver my package?</h3>
              <p className="text-maxmove-700">
                With our express service, we can deliver within 2 hours in urban areas. For same-day delivery, orders must be placed before 11am.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-maxmove-900 mb-3">What size packages can you deliver?</h3>
              <p className="text-maxmove-700">
                We handle packages of all sizes, from small envelopes to large items. Different vehicle types are available for larger deliveries.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-maxmove-900 mb-3">How much does delivery cost?</h3>
              <p className="text-maxmove-700">
                Pricing depends on distance, package size, and delivery speed. You can get an instant quote by entering your details in our booking form.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-maxmove-900 mb-3">Can I track my delivery?</h3>
              <p className="text-maxmove-700">
                Yes, all deliveries include real-time tracking. You'll receive a tracking link via email and SMS once your order is confirmed.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-maxmove-900 mb-3">Are my packages insured?</h3>
              <p className="text-maxmove-700">
                Yes, all deliveries include basic insurance coverage. Additional coverage options are available for high-value items.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-maxmove-900 mb-3">Do you offer international shipping?</h3>
              <p className="text-maxmove-700">
                Currently, we operate in Germany only. International shipping options are planned for future expansion.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <p className="text-maxmove-700 mb-4">
              Still have questions about our services?
            </p>
            <Button asChild className="bg-maxmove-800 hover:bg-maxmove-900 text-white">
              <Link href="/contact">
                Contact Our Support Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-maxmove-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ship with MaxMove?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Experience fast, reliable delivery services tailored to your needs. Book your first delivery today and see the MaxMove difference.
          </p>
          <Button asChild size="lg" className="bg-white text-maxmove-800 hover:bg-maxmove-100">
            <Link href="/book">
              Book Your Delivery Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}