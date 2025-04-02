'use client';

import { DollarSign, Clock, Truck, Shield, MapPin } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const DeliveryFeatures = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    {
      src: 'https://xuehdmslktlsgpoexilo.supabase.co/storage/v1/object/public/pics//Maxmove%20Wroker%20real%20live.png',
      alt: 'Maxmove delivery team loading boxes into a truck',
    },
    {
      src: '/lovable-uploads/462a0b5e-62c8-472a-999a-27c0aeaddfe6.png',
      alt: 'Maxmove movers handling packages with care',
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (typeof window !== 'undefined') {
      timer = setInterval(() => {
        const carouselElement = document.querySelector('[data-embla-container]');
        if (!carouselElement) return;

        try {
          const emblaApi = (carouselElement as any).__embla;
          if (!emblaApi) return;

          if (currentSlide === images.length - 1) {
            emblaApi.scrollTo(0);
            setCurrentSlide(0);
          } else {
            emblaApi.scrollNext();
            setCurrentSlide(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error controlling carousel:', error);
        }
      }, 5000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentSlide, images.length]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 mx-auto bg-maxmove-navy">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {' '}
        {/* Added items-center for alignment */}
        {/* Left Column: Image Carousel */}
        <div className="flex flex-col items-center relative">
          {' '}
          {/* Centered images */}
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[480px] lg:h-[540px]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      priority
                      className="rounded-2xl object-contain scale-[0.95] lg:scale-[0.95] md:scale-[0.95] sm:scale-[0.85]"
                      quality={90}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* Right Column: Text Content */}
        <div className="space-y-8 flex flex-col justify-center">
          {' '}
          {/* Centered text vertically */}
          <motion.div
            className="space-y-4 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-maxmove-creme"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Your 24/7 delivery partner
            </motion.h2>
            <motion.p
              className="text-2xl sm:text-3xl text-maxmove-creme font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Fast. Simple. Affordable.
            </motion.p>
          </motion.div>
          {/* Features List */}
          <div className="space-y-6">
            <motion.div
              className="flex gap-4 items-center" // Centered each feature row
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <DollarSign className="h-6 w-6 text-maxmove-creme flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-maxmove-creme">Affordable</h3>
                <p className="text-maxmove-creme">Transparent pricing with no hidden costs.</p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4 items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Clock className="h-6 w-6 text-maxmove-creme flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-maxmove-creme">Speedy order matching</h3>
                <p className="text-maxmove-creme">
                  Match orders and deliver your goods immediately.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4 items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Truck className="h-6 w-6 text-maxmove-creme flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-maxmove-creme">Reliable driver network</h3>
                <p className="text-maxmove-creme">
                  Different vehicle types and courier services for all kinds of delivery needs.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4 items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Shield className="h-6 w-6 text-maxmove-creme flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-maxmove-creme">Safe delivery</h3>
                <p className="text-maxmove-creme">
                  Professional and trained drivers ensure all your goods safely reach their
                  destination.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex gap-4 items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <MapPin className="h-6 w-6 text-maxmove-creme flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-maxmove-creme">Real-time tracking</h3>
                <p className="text-maxmove-creme">
                  In-app tracking allows you and the receiver to track your order in real time
                  during the delivery.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryFeatures;
