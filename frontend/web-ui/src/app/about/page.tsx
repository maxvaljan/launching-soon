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
                <Button asChild className="bg-maxmove-navy hover:bg-maxmove-dark-blue text-maxmove-creme">
                  <Link href="/contact">Join our Partner Network</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-80 sm:h-96 lg:h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="https://whadz2ols6ge6eli.public.blob.vercel-storage.com/MAXMOVE-9.png" 
                alt="MaxMove delivery"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "contain", width: "100%" }}
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
                src="/images/team-photo-new.jpg" 
                alt="MaxMove team"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-semibold text-maxmove-800 mb-4">From Vision to Reality</h3>
              <p className="text-maxmove-700 mb-4">
                Founded in 2025 in Cologne, MaxMove started with a clear mission: to make last-mile logistics
                more efficient and sustainable. Our founders recognized the need for innovative solutions
                that could transform how goods are delivered in urban areas.
              </p>
              <p className="text-maxmove-700 mb-4">
                Through cutting-edge technology and a commitment to environmental responsibility,
                we're building a logistics platform that reduces carbon emissions while maintaining
                exceptional delivery speeds and reliability.
              </p>
              <p className="text-maxmove-700">
                MaxMove is dedicated to creating a sustainable future for urban logistics, where
                efficiency and environmental consciousness go hand in hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16">
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
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-maxmove-creme">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-maxmove-navy">Ready to Experience MaxMove?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-maxmove-navy">
            Join thousands of satisfied customers who trust MaxMove for their delivery needs. 
            Whether you need to send a package, become a driver, or set up business deliveries, 
            we're here to help.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-maxmove-navy text-maxmove-creme hover:bg-maxmove-navy/90">
              <Link href="/book">Book Now</Link>
            </Button>
            <Button asChild className="bg-maxmove-navy text-maxmove-creme hover:bg-maxmove-navy/90">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
