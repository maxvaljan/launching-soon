'use client';

import { Building2, Truck, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const ServiceBanners = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ['anything', 'anytime', 'anywhere'], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-[url('https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/pics//Maxmove%20Urban.png')] bg-cover bg-[85%_center] md:bg-[center_5%] h-full"
        style={{
          minHeight: '85svh',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
      </div>

      <div className="relative z-10 pt-16 md:pt-32 pb-4 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[85svh] md:min-h-[100svh] flex flex-col justify-between items-center">
        <div className="flex flex-col items-center mb-4 md:mb-10 w-full md:scale-100 mt-auto">
          <div className="flex justify-center mb-4 text-center">
            <h1 className="text-4xl md:text-7xl font-bold text-white flex flex-row items-center justify-center">
              <span className="mr-2 md:mr-4">Move</span>
              <div className="relative h-[1.2em] w-[160px] md:w-[330px] overflow-hidden">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute inset-0 flex items-center justify-start"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </div>
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 mb-4 md:mb-6 text-center w-full">
            Smart Logistics
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-6 w-full mt-auto mb-4 md:mb-8">
          {/* Move Banner */}
          <Link
            href="/book"
            className="group relative overflow-hidden p-2 md:p-6 transition-all cursor-pointer bg-white/20 backdrop-blur-md hover:bg-white/30 aspect-square md:aspect-auto md:h-[220px] flex flex-col justify-between"
          >
            <div>
              <Truck className="h-6 w-6 md:h-12 md:w-12 text-white group-hover:text-white transition-colors mb-1 md:mb-4" />
              <h3 className="text-base md:text-2xl font-bold text-white group-hover:text-white transition-colors mb-1 md:mb-2">
                Move Now!
              </h3>
              <p className="text-white/90 group-hover:text-white transition-colors mb-auto hidden md:block">
                Click here to book your delivery
              </p>
            </div>
            <ChevronRight className="absolute bottom-2 right-2 w-5 h-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          {/* Business Banner */}
          <Link
            href="/business"
            className="group relative overflow-hidden p-2 md:p-6 transition-all cursor-pointer bg-white/20 backdrop-blur-md hover:bg-white/30 aspect-square md:aspect-auto md:h-[220px] flex flex-col justify-between"
          >
            <div>
              <Building2 className="h-6 w-6 md:h-12 md:w-12 text-white group-hover:text-white transition-colors mb-1 md:mb-4" />
              <h3 className="text-base md:text-2xl font-bold text-white group-hover:text-white transition-colors mb-1 md:mb-2">
                Business
              </h3>
              <p className="text-white/90 group-hover:text-white transition-colors mb-auto hidden md:block">
                Logistics solutions for all kind of businesses
              </p>
            </div>
            <ChevronRight className="absolute bottom-2 right-2 w-5 h-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>

          {/* Driver Banner */}
          <Link
            href="/drivers"
            className="group relative overflow-hidden p-2 md:p-6 transition-all cursor-pointer bg-white/20 backdrop-blur-md hover:bg-white/30 aspect-square md:aspect-auto md:h-[220px] flex flex-col justify-between"
          >
            <div>
              <Users className="h-6 w-6 md:h-12 md:w-12 text-white group-hover:text-white transition-colors mb-1 md:mb-4" />
              <h3 className="text-base md:text-2xl font-bold text-white group-hover:text-white transition-colors mb-1 md:mb-2">
                Driver
              </h3>
              <p className="text-white/90 group-hover:text-white transition-colors mb-auto hidden md:block">
                Deliver goods with Maxmove
              </p>
            </div>
            <ChevronRight className="absolute bottom-2 right-2 w-5 h-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceBanners;
