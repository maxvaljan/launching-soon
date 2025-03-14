'use client';

import { Briefcase, Wallet, PenTool, Headphones, MapPinned, Snowflake } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const services = [
  {
    icon: Briefcase,
    title: "Corporate Account",
    description: "Bring multiple users under one business account so everyone is in the loop."
  },
  {
    icon: Wallet,
    title: "Wallet",
    description: "Enjoy cashless & hassle-free payments."
  },
  {
    icon: PenTool,
    title: "E-signature feature",
    description: "Get instant updates with proof of delivery!"
  },
  {
    icon: Headphones,
    title: "Account management",
    description: "Our account management team is dedicated to providing a tailored service suitable for your business needs!"
  },
  {
    icon: MapPinned,
    title: "Multi-stop delivery",
    description: "Select up to 20 drop off points in one order saving you time and money."
  },
  {
    icon: Snowflake,
    title: "Maxbag",
    description: "Restock your fresh goods anytime! Business owners can deliver goods that need to be kept fresh for delivery."
  }
];

const BusinessServices = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/signup?type=business");
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Maxmove services our business clients love
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center">
                <service.icon className="w-12 h-12 text-maxmove-600" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-maxmove-900">
                {service.title}
              </h3>
              <p className="text-maxmove-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignUp}
            className="bg-maxmove-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-maxmove-700 transition-colors"
          >
            Sign up now
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default BusinessServices;