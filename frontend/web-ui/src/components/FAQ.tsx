'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

const FAQ = () => {
  const faqs = [
    {
      question: "How does MaxMove delivery service work?",
      answer: "MaxMove operates on a gig economy model, similar to Uber but for logistics. Currently rolling out in Germany, our platform connects you with reliable drivers through our user-friendly app. Simply enter your pickup and delivery locations, choose your vehicle type based on your needs, and get instant pricing. Our drivers will handle your delivery with care and professionalism while you track the entire process in real-time."
    },
    {
      question: "What types of vehicles are available?",
      answer: "We offer a comprehensive range of vehicles to suit all delivery needs, from motorcycles for small packages to vans and trucks for larger items. We also provide specialized services including towing services, temperature-controlled vehicles (frozen/chilled), and certified transport for hazardous goods. Each vehicle type comes with specific dimensions and weight capacity information to help you choose the right option for your delivery."
    },
    {
      question: "How is the delivery price calculated?",
      answer: "Our pricing is transparent and based on several factors including distance, vehicle type, time of day, and delivery urgency. You'll see the exact price before confirming your booking, with no hidden fees or surprises."
    },
    {
      question: "How can I track my delivery?",
      answer: "Once your delivery is confirmed, you can track its progress in real-time through our app. You'll receive live updates on your driver's location and estimated arrival time, plus notifications at key stages of the delivery process."
    },
    {
      question: "What if I need to cancel my delivery?",
      answer: "You can cancel your delivery through the app before the driver picks up your item. Our cancellation policy varies depending on how close to the pickup time you cancel. Full details are available in our terms of service."
    },
    {
      question: "How do I become a MaxMove driver?",
      answer: "To become a MaxMove driver, you'll need to meet our requirements including having a valid driver's license, vehicle insurance, and passing our background check. You can start the application process right here on our website by visiting our driver registration page or through our driver app. Ready to join? ",
      link: {
        text: "Register as a driver now",
        url: "/drivers"
      }
    },
    {
      question: "Is MaxMove available 24/7?",
      answer: "Yes, MaxMove is always available, anytime you need us - even just minutes before your desired pickup time. Our platform operates round-the-clock to ensure you can schedule and receive deliveries whenever you need them."
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-maxmove-900">Frequently Asked Questions</h2>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium text-maxmove-800">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-maxmove-600">
                {faq.answer}
                {faq.link && (
                  <Link 
                    href={faq.link.url}
                    className="inline-block mt-2 text-maxmove-800 hover:text-maxmove-900 font-medium"
                  >
                    {faq.link.text} →
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;