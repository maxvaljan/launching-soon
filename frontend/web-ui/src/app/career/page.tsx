'use client';

import { useState } from 'react';

interface JobListing {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
}

const jobListings: JobListing[] = [
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Developer',
    location: 'Cologne, Germany / Remote',
    type: 'Full-time',
    description: `We're looking for a Full-Stack Developer to build Maxmove with us.

You're a great fit if you're fast, flexible, and thrive in a high-speed startup environment. You know how to get things done and how to leverage AI tools to move even faster.

Ideally, you have experience with technologies like Next.js/React, Node.js, PostgreSQL, Golang, or React Native (or any other mobile stack). You'll play a key role in shaping our platform and will have a real impact from day one.

We're a small, driven team working out of Cologne – but you're welcome to join us remotely. You'll get equity, competitive pay, and a front-row seat in building a generational company.

Reach out at careers@maxmove.com.`,
  },
  {
    id: 'Marketing-intern',
    title: 'Marketing Intern',
    location: 'Cologne, Germany / Remote',
    type: 'Full-time',
    description: `As Marketing Intern you will have great impact in building Maxmove's brand and digital presence.

You're a great fit if you're creative, have an eye for design, and thrive in a high-speed startup environment. You know how to create engaging content and leverage AI tools to accelerate your workflow.  A strong sense of design and visual storytelling is essential.

Reach out at careers@maxmove.com.`,
  },
  {
    id: 'ios-dev',
    title: 'iOS Developer',
    location: 'Cologne, Germany / Remote',
    type: 'Full-time',
    description: `We're looking for an iOS Developer to build Maxmove with us – the future of logistics in Europe.

You're a great fit if you're fast, flexible, and ready to work long hours in a high-speed startup environment. You are able to ship high-quality apps quickly and use AI tools to accelerate your workflow.

Ideally, you have experience with SwiftUI, and a strong understanding of building simple and fast mobile apps.

You'll be the driving force behind our iOS experience – shaping how customers, drivers, and businesses interact with Maxmove on the go.`,
  },
  {
    id: 'backend-dev',
    title: 'Backend Engineer',
    location: 'Cologne, Germany / Remote',
    type: 'Full-time',
    description: `We're looking for a Backend Engineer to build Maxmove with us – the future of logistics in Europe.

You're fast, flexible, and thrive in a high-speed startup environment. You know how to build and scale real-time systems, and you leverage AI tools to move even faster.

Experience with Node.js, PostgreSQL, Golang, WebSockets, and event-driven architecture is ideal.

You'll be the driving force behind our backend infrastructure, building scalable systems that power the future of urban logistics.`,
  },
  {
    id: 'eng-intern',
    title: 'Software Engineering Intern',
    location: 'Cologne, Germany / Remote',
    type: 'Internship',
    description: `As Software Engineering Intern you will have great impact to build Maxmove with us.

You're a great fit if you're fast, flexible and thrive in a high-speed startup environment. You know how to get things done and how to leverage AI tools to move even faster.

Reach out at careers@maxmove.com.`,
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
              <h1 className="text-4xl md:text-5xl font-bold text-maxmove-900">Join Our Team</h1>
              <p className="mt-4 text-lg text-maxmove-700 max-w-3xl mx-auto">
                We&apos;re solving one of today&apos;s most essential challenges by building the
                future of logistics in Germany. Our AI-powered platform and autonomous robots are
                revolutionizing how people access goods – 100% sustainable delivery within 15
                minutes.
              </p>
              <a
                href="/about"
                className="mt-6 inline-block px-6 py-3 bg-maxmove-navy-dark text-white rounded-lg hover:bg-maxmove-navy transition-colors duration-200"
              >
                Learn more about our mission
              </a>
            </div>
          </div>
        </section>

        {/* Job Listings Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-maxmove-900 text-center mb-8">Open Positions</h2>
            <div className="grid gap-6">
              {jobListings.map(job => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm border border-maxmove-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => toggleJobDescription(job.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-maxmove-900">{job.title}</h3>
                    <p className="text-sm text-maxmove-600">
                      {job.location} · {job.type}
                    </p>
                  </div>
                  {/* Description Section */}
                  <div
                    className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                      expandedJob === job.id ? 'max-h-40 mt-3' : 'max-h-0'
                    }`}
                  >
                    <p className="text-maxmove-700">{job.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-maxmove-600">
              Send your application to{' '}
              <a
                href="mailto:careers@maxmove.com"
                className="text-maxmove-navy hover:text-maxmove-navy-dark"
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
