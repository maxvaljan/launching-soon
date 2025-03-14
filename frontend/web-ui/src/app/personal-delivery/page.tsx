'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, Clock, Shield, Truck, ArrowRight } from "lucide-react";

export default function PersonalDelivery() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-maxmove-50 to-white">
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-maxmove-900 mb-6 animate-slide-up">
            Personal Delivery
            <br />
            <span className="text-maxmove-700">Made Simple</span>
          </h1>
          <p className="text-lg text-maxmove-600 mb-8 max-w-2xl mx-auto">
            Whether you're moving apartments, delivering furniture, or sending packages,
            we've got you covered with our reliable personal delivery service.
          </p>
          <Button size="lg" className="bg-maxmove-800 hover:bg-maxmove-900 text-white" asChild>
            <Link href="/book">
              Book Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Package,
                title: "Any Size Package",
                description: "From small parcels to large furniture, we handle items of all sizes",
              },
              {
                icon: Clock,
                title: "Flexible Scheduling",
                description: "Book deliveries at times that work best for you",
              },
              {
                icon: Shield,
                title: "Full Insurance",
                description: "Your items are protected throughout the delivery process",
              },
              {
                icon: Truck,
                title: "Same-Day Delivery",
                description: "Available for urgent deliveries within the city",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <feature.icon className="h-10 w-10 text-maxmove-700 mb-4" />
                <h3 className="text-xl font-semibold text-maxmove-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-maxmove-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-maxmove-900 text-center mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Book Your Delivery",
                  description: "Choose your pickup and delivery locations, and select a convenient time slot",
                },
                {
                  step: "2",
                  title: "Prepare Your Items",
                  description: "Pack your items securely - we'll handle the rest with care",
                },
                {
                  step: "3",
                  title: "Track in Real-Time",
                  description: "Follow your delivery's progress with our real-time tracking system",
                },
                {
                  step: "4",
                  title: "Delivery Confirmation",
                  description: "Receive confirmation once your items have been safely delivered",
                },
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-maxmove-800 text-white rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-maxmove-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-maxmove-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <div className="bg-maxmove-800 text-white rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              Experience the convenience of personal delivery with Maxmove
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-maxmove-800 hover:bg-maxmove-50"
              asChild
            >
              <Link href="/book">
                Book Your Delivery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}