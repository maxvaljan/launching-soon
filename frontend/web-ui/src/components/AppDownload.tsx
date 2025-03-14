'use client';

import Image from 'next/image';

const AppDownload = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-maxmove-900">Our Apps</h2>
        <p className="mt-2 text-maxmove-600">Coming Soon</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Customer App */}
        <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
          <h3 className="text-2xl font-bold text-maxmove-800 mb-6">
            User App
          </h3>
          <div className="relative inline-block w-32 h-32 mx-auto mb-6">
            <Image
              src="/lovable-uploads/733343bb-df0b-41e6-82b8-3fd5582b9f1b.png"
              alt="Maxmove Customer App"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex justify-center gap-4">
            <div className="relative h-10 w-32">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on App Store"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <div className="relative h-10 w-32">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                fill
                className="object-contain opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Driver App */}
        <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
          <h3 className="text-2xl font-bold text-maxmove-800 mb-6">
            Driver App
          </h3>
          <div className="relative inline-block w-32 h-32 mx-auto mb-6">
            <Image
              src="/lovable-uploads/abbdffc4-d880-4221-96b3-c26c250bc82a.png"
              alt="Maxmove Driver App"
              fill
              className="object-contain rounded-lg"
            />
          </div>
          <div className="flex justify-center gap-4">
            <div className="relative h-10 w-32">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="Download on App Store"
                fill
                className="object-contain opacity-50"
              />
            </div>
            <div className="relative h-10 w-32">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                fill
                className="object-contain opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;