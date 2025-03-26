'use client';

import { DollarSign, Clock, Truck, Shield, MapPin } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const DeliveryFeatures = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const images = [
    {
      src: "/lovable-uploads/01ec132b-c367-4e95-9389-96294b1140dd.png",
      alt: "Maxmove delivery team loading boxes into a truck",
    },
    {
      src: "/lovable-uploads/462a0b5e-62c8-472a-999a-27c0aeaddfe6.png",
      alt: "Maxmove movers handling packages with care",
    },
  ];

  const features = [
    { icon: DollarSign, title: "Affordable", description: "Transparent pricing with no hidden costs." },
    { icon: Clock, title: "Speedy order matching", description: "Match orders and deliver your goods immediately." },
    { icon: Truck, title: "Reliable driver network", description: "Different vehicle types and courier services for all kinds of delivery needs." },
    { icon: Shield, title: "Safe delivery", description: "Professional and trained drivers ensure all your goods safely reach their destination." },
    { icon: MapPin, title: "Real-time tracking", description: "In-app tracking allows you and the receiver to track your order in real time during the delivery." },
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"> {/* Ensures text aligns with images */}
        
        {/* Left Column: Image Carousel */}
        <div className="flex flex-col items-start relative">
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-[500px]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      priority
                      className="rounded-2xl object-cover shadow-lg"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Right Column: Text Content */}
        <div className="space-y-8 self-center"> {/* Ensures text block aligns with images */}
          <motion.div 
            className="space-y-4 text-center lg:text-left" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-4" // Aligns icon & text in center
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
              >
                {/* Feature Icon */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.2, type: "spring" }}
                  className="flex items-center justify-center h-10 w-10"
                >
                  <feature.icon className="h-6 w-6 text-maxmove-creme" />
                </motion.div>

                {/* Feature Text */}
                <div>
                  <h3 className="font-semibold text-maxmove-creme">{feature.title}</h3>
                  <p className="text-maxmove-creme">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryFeatures;
