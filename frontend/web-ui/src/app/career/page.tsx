'use client';

import { useState } from "react";

interface JobListing {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
}

const jobListings: JobListing[] = [
  {
    id: "fullstack-dev",
    title: "Full-Stack Developer",
    location: "Cologne, Germany / Remote",
    type: "Full-time",
    description:
      "We are looking for a Full-Stack Developer to build and enhance our AI-driven logistics platform. You will work with cutting-edge technologies, developing scalable web applications and APIs for seamless user experiences.",
  },
  {
    id: "mechanical-engineer",
    title: "Mechanical Engineer",
    location: "Cologne, Germany",
    type: "Full-time",
    description:
      "As a Mechanical Engineer at Maxmove, you will be involved in the design and development of autonomous delivery solutions. Your expertise in robotics and system integration will drive innovation in urban logistics.",
  },
  {
    id: "operations-manager",
    title: "Operations Manager",
    location: "Cologne, Germany",
    type: "Full-time",
    description:
      "We need an Operations Manager to oversee our logistics network and ensure seamless deliveries. You will coordinate with drivers, optimize routes, and manage real-time tracking to enhance efficiency.",
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    location: "Cologne, Germany / Remote",
    type: "Full-time",
    description:
      "Join our AI team to develop machine learning models for route optimization, demand forecasting, and automated logistics. Your algorithms will power the next generation of delivery solutions.",
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    location: "Cologne, Germany / Remote",
    type: "Full-time",
    description:
      "We're hiring a Marketing Manager to drive customer acquisition and brand awareness. You will create campaigns, manage social media, and collaborate with partners to expand our reach.",
  },
  {
    id: "ios-dev",
    title: "iOS Developer",
    location: "Cologne, Germany / Remote",
    type: "Full-time",
    description:
      "We are looking for an iOS Developer to build and maintain our mobile app. You will create a seamless user experience and implement real-time tracking, booking, and communication features.",
  },
  {
    id: "backend-dev",
    title: "Backend Developer",
    location: "Cologne, Germany / Remote",
    type: "Full-time",
    description:
      "As a Backend Developer, you will design and optimize the architecture of our logistics platform. You will work on APIs, databases, and system integrations to ensure high performance and scalability.",
  },
  {
    id: "eng-intern",
    title: "Software Engineering Intern",
    location: "Cologne, Germany / Remote",
    type: "Internship",
    description:
      "This internship is a great opportunity to gain hands-on experience in software development. You will assist in building and testing features, contributing to real-world applications in logistics.",
  },
];

export default function Career() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const toggleJobDescription = (id: string) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-maxmove-50 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-maxmove-900">
                Join Our Team
              </h1>
              <p className="mt-4 text-lg text-maxmove-700 max-w-3xl mx-auto">
                Explore exciting career opportunities at Maxmove and be part of shaping the future of logistics.
              </p>
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-maxmove-900 text-center mb-8">
              Open Positions
            </h2>
            <div className="grid gap-6">
              {jobListings.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm border border-maxmove-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toggleJobDescription(job.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-maxmove-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-maxmove-600">
                      {job.location} · {job.type}
                    </p>
                  </div>
                  {/* Description Section */}
                  <div
                    className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                      expandedJob === job.id ? "max-h-40 mt-3" : "max-h-0"
                    }`}
                  >
                    <p className="text-maxmove-700">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-maxmove-600">
              Send your application to{" "}
              <a 
                href="mailto:careers@maxmove.com" 
                className="text-maxmove-800 hover:underline"
              >
                careers@maxmove.com
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}