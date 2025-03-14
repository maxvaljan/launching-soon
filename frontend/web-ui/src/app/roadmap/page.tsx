'use client';

import { Milestone, ArrowDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Roadmap() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Our Vision for the Future
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">Building the next generation of logistics infrastructure backed by science</p>
            <ArrowDown className="mx-auto w-16 h-16 text-blue-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="space-y-24">
            {/* 2024 */}
            <div className="relative">
              <Card className="transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border-2 border-blue-500/20 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">Q1-Q4 2025</span>
                    <Milestone className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-white text-2xl">Development & Market Entry</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    <ul className="list-disc pl-5 space-y-3 mt-4">
                      <li>Launch operations in Rhein-Ruhr metropolitan region. Develop scalable applications, with integrated AI-route optimization, -matching and -agents</li>
                      <li>Launch operations in Rhein-Ruhr metropolitan region</li>
                      <li>Secure EXIST Grant Funding and recruit team</li>
                      <li>Start prototyping and planning autonomous underground delivery robot and network.</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
              {/* Connecting Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-24 w-0.5 bg-gradient-to-b from-blue-500 to-transparent bottom-[-96px]" />
            </div>

            {/* 2025 */}
            <div className="relative">
              <Card className="transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border-2 border-blue-500/20 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">Q1-Q4 2026</span>
                    <Milestone className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-white text-2xl">Expansion & Infrastructure Development</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    <ul className="list-disc pl-5 space-y-3 mt-4">
                      <li>Begin construction of first underground logistics pilot project and autonomous robots</li>
                      <li>Start fundraising: Goal $12M for underground hyperlogistics platform & autonomous robot production</li>
                      <li>Expand with Maxmove Platform through Germany</li>
                      <li>Start moving items in our underground hyperlogistics network</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
              {/* Connecting Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-24 w-0.5 bg-gradient-to-b from-blue-500 to-transparent bottom-[-96px]" />
            </div>

            {/* 2026 */}
            <div className="relative">
              <Card className="transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border-2 border-blue-500/20 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">2027</span>
                    <Milestone className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-white text-2xl">Innovation & European Expansion</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    <ul className="list-disc pl-5 space-y-3 mt-4">
                      <li>Complete first underground logistics network in Rhein-Ruhr Area</li>
                      <li>Launch operations of Maxmove platform in major European cities</li>
                      <li>Become Germany's most innovative and profitable mid- and last mile logistics platform</li>
                      <li>Establish strategic partnerships across Europe</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
              {/* Connecting Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-24 w-0.5 bg-gradient-to-b from-blue-500 to-transparent bottom-[-96px]" />
            </div>

            {/* 2027+ */}
            <div className="relative">
              <Card className="transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 border-2 border-blue-500/20 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">2028+</span>
                    <Milestone className="h-8 w-8 text-blue-500" />
                  </div>
                  <CardTitle className="text-white text-2xl">Future Vision</CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    <ul className="list-disc pl-5 space-y-3 mt-4">
                      <li>Scale autonomous logistics networks across Europe</li>
                      <li>Achieve full automation of delivery operations</li>
                      <li>Establish Maxmove as one of Europe's leading logistics platform</li>
                      <li>Drive innovation in sustainable urban logistics</li>
                    </ul>
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Investment and Career CTA Section */}
      <section className="py-8 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-6">
            <Button size="lg" className="text-lg px-8 py-6 bg-gray-50 text-slate-800 hover:bg-gray-100" asChild>
              <Link href="/career">
                Join Our Team
              </Link>
            </Button>
            <Button size="lg" className="text-lg px-8 py-6 bg-gray-50 text-slate-800 hover:bg-gray-100" asChild>
              <Link href="/investment">
                Investment
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}