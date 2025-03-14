import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, MapPin, Package, Truck, Users, Clock } from "lucide-react";

// SEO Metadata
export const metadata = {
  title: "About MaxMove | Your Logistics Partner",
  description: "Learn about MaxMove, your reliable logistics partner. We connect customers and drivers to provide fast, efficient delivery services across Germany.",
  keywords: ["logistics", "delivery service", "courier", "package delivery", "same-day delivery", "MaxMove"],
  openGraph: {
    title: "About MaxMove | Your Logistics Partner",
    description: "Learn about MaxMove, your reliable logistics partner. We connect customers and drivers to provide fast, efficient delivery services across Germany.",
    url: "https://maxmove.com/about",
    siteName: "MaxMove",
    images: [
      {
        url: "/images/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "MaxMove Logistics",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

// Using Server Component for better performance and SEO
export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <section className="py-16 bg-maxmove-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-maxmove-900 mb-6">
                Delivering Excellence, <span className="text-maxmove-600">Every Time</span>
              </h1>
              <p className="text-lg text-maxmove-700 mb-8">
                MaxMove is a modern logistics platform that connects customers with reliable drivers 
                to provide fast, efficient delivery services across Germany. Our mission is to make 
                logistics simple, transparent, and affordable for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-maxmove-800 hover:bg-maxmove-900 text-white">
                  <Link href="/book">Book a Delivery</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/account-type">Join Our Network</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-80 sm:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/delivery-van.jpg" 
                alt="MaxMove delivery van"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-maxmove-900 mb-12">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative h-80 sm:h-96 rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/images/team-photo.jpg" 
                alt="MaxMove team"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-semibold text-maxmove-800 mb-4">From Vision to Reality</h3>
              <p className="text-maxmove-700 mb-4">
                Founded in 2020, MaxMove started with a simple idea: to make package delivery as easy 
                as ordering a ride. Our founders, experienced in both technology and logistics, saw a 
                gap in the market for a service that could provide same-day deliveries with transparency 
                and reliability.
              </p>
              <p className="text-maxmove-700 mb-4">
                What began as a small operation in Berlin has now expanded to major cities across 
                Germany, with a growing network of drivers and a loyal customer base that includes 
                both individuals and businesses.
              </p>
              <p className="text-maxmove-700">
                Today, MaxMove is known for its reliable service, user-friendly platform, and commitment 
                to sustainability, with a growing fleet of electric vehicles and carbon-offset initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-maxmove-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-maxmove-900 mb-4">Why Choose MaxMove</h2>
          <p className="text-center text-maxmove-700 max-w-2xl mx-auto mb-12">
            We're committed to providing the best logistics experience for all our customers and partners.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-maxmove-100 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-maxmove-600" />
              </div>
              <h3 className="text-xl font-semibold text-maxmove-900 mb-2">Fast Delivery</h3>
              <p className="text-maxmove-700">
                Same-day and next-day delivery options to meet your urgent needs, with real-time tracking and updates.
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-maxmove-100 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-maxmove-600" />
              </div>
              <h3 className="text-xl font-semibold text-maxmove-900 mb-2">Secure Handling</h3>
              <p className="text-maxmove-700">
                Your packages are treated with care, with insurance coverage included for all deliveries.
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-maxmove-100 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-maxmove-600" />
              </div>
              <h3 className="text-xl font-semibold text-maxmove-900 mb-2">Nationwide Coverage</h3>
              <p className="text-maxmove-700">
                Serving major cities across Germany, with plans to expand to more locations soon.
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-maxmove-100 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-maxmove-600" />
              </div>
              <h3 className="text-xl font-semibold text-maxmove-900 mb-2">Diverse Fleet</h3>
              <p className="text-maxmove-700">
                From motorcycles to vans, we have the right vehicle for packages of all sizes.
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-maxmove-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-maxmove-600" />
              </div>
              <h3 className="text-xl font-semibold text-maxmove-900 mb-2">Professional Drivers</h3>
              <p className="text-maxmove-700">
                Our vetted and trained driver network ensures your deliveries are in good hands.
              </p>
            </Card>
            
            <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-full bg-maxmove-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-maxmove-600" />
              </div>
              <h3 className="text-xl font-semibold text-maxmove-900 mb-2">Easy to Use</h3>
              <p className="text-maxmove-700">
                Our intuitive platform makes booking, tracking, and managing deliveries simple and stress-free.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-maxmove-800 mb-2">500K+</p>
              <p className="text-maxmove-700">Deliveries Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-maxmove-800 mb-2">10+</p>
              <p className="text-maxmove-700">Cities Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-maxmove-800 mb-2">1000+</p>
              <p className="text-maxmove-700">Driver Partners</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-maxmove-800 mb-2">98%</p>
              <p className="text-maxmove-700">On-Time Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-maxmove-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience MaxMove?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-maxmove-100">
            Join thousands of satisfied customers who trust MaxMove for their delivery needs. 
            Whether you need to send a package, become a driver, or set up business deliveries, 
            we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-white text-maxmove-800 hover:bg-maxmove-100">
              <Link href="/book">Book Now</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-maxmove-700">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}