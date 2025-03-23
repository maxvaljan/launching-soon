'use client';

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Mail, PhoneCall, Clock, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { submitContactForm } from "../actions/contact-form";
import { useFormState } from "react-dom";

const initialState = {
  success: false,
  message: '',
};

function ContactPageContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';
  const [formState, formAction] = useFormState(submitContactForm, initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Handle form submission feedback
  const handleSubmitWithState = async (formData: FormData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    // This calls the server action and updates formState
    await formAction(formData);
    
    // Check the updated formState
    if (formState.success) {
      setIsSuccess(true);
      // Reset form by clearing all inputs
      const form = document.getElementById('contactForm') as HTMLFormElement;
      if (form) form.reset();
    } else if (formState.message) {
      setErrorMessage(formState.message || 'Something went wrong. Please try again.');
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-maxmove-900 mb-6 text-center">
            Contact Us
          </h1>
          <p className="text-lg text-maxmove-700 mb-12 text-center">
            Have questions or need assistance? Our team is here to help. Fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-4">
                <div className="bg-maxmove-100 p-3 rounded-full mr-4">
                  <PhoneCall className="h-5 w-5 text-maxmove-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-maxmove-900 mb-1">Call Us</h3>
                  <p className="text-maxmove-700">+49 1734224371</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-4">
                <div className="bg-maxmove-100 p-3 rounded-full mr-4">
                  <Mail className="h-5 w-5 text-maxmove-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-maxmove-900 mb-1">Email Us</h3>
                  <p className="text-maxmove-700">support@maxmove.com</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-4">
                <div className="bg-maxmove-100 p-3 rounded-full mr-4">
                  <Clock className="h-5 w-5 text-maxmove-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-maxmove-900 mb-1">Working Hours</h3>
                  <p className="text-maxmove-700">24/7</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <Card className="p-6 shadow-lg h-full">
                <h2 className="text-xl font-semibold text-maxmove-900 mb-6">
                  Visit Our Office
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-maxmove-100 p-3 rounded-full mr-4">
                      <Building className="h-5 w-5 text-maxmove-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-maxmove-900 mb-1">Headquarters</h3>
                      <p className="text-maxmove-700">
                        Eulenbergstr.37<br />
                        51065 Cologne, Germany
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-maxmove-900 mb-3">Departments</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <MapPin className="h-4 w-4 text-maxmove-600 mr-2" />
                        <span className="text-maxmove-700">Customer Support</span>
                      </li>
                      <li className="flex items-center">
                        <MapPin className="h-4 w-4 text-maxmove-600 mr-2" />
                        <span className="text-maxmove-700">Business Inquiries</span>
                      </li>
                      <li className="flex items-center">
                        <MapPin className="h-4 w-4 text-maxmove-600 mr-2" />
                        <span className="text-maxmove-700">Driver Relations</span>
                      </li>
                      <li className="flex items-center">
                        <MapPin className="h-4 w-4 text-maxmove-600 mr-2" />
                        <span className="text-maxmove-700">Press & Media</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="mb-3">
                      <h3 className="font-semibold text-maxmove-900">Connect With Us</h3>
                      <p className="text-sm text-maxmove-700">Follow us on social media</p>
                    </div>
                    <div className="flex space-x-3">
                      <a href="https://twitter.com/maxmove" className="bg-maxmove-100 hover:bg-maxmove-200 transition-colors p-2 rounded-full" aria-label="Follow us on X (Twitter)" title="X (Twitter)">
                        <svg width="20" height="20" fill="currentColor" className="text-maxmove-600">
                          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                      <a href="https://www.linkedin.com/company/maxmove" className="bg-maxmove-100 hover:bg-maxmove-200 transition-colors p-2 rounded-full" aria-label="Connect with us on LinkedIn" title="LinkedIn">
                        <svg width="20" height="20" fill="currentColor" className="text-maxmove-600">
                          <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm-3.11 14.33c0 .106-.094.192-.21.192h-2.29c-.116 0-.21-.086-.21-.192V9.28c0-.105.094-.192.21-.192h2.29c.116 0 .21.087.21.192v5.05zm-1.39-5.786c-.756 0-1.372-.617-1.372-1.377 0-.758.616-1.375 1.372-1.375.76 0 1.376.617 1.376 1.375 0 .76-.617 1.377-1.376 1.377zm10.76 5.786c0 .106-.093.192-.21.192h-2.29c-.115 0-.208-.086-.208-.192v-2.785c0-.915-.325-1.537-1.142-1.537-.623 0-.994.43-1.164.84-.06.146-.075.35-.075.554v2.93c0 .105-.092.19-.21.19H8.76c-.116 0-.21-.086-.21-.192V9.252c0-.105.094-.192.21-.192h2.29c.117 0 .21.087.21.192v.947c.34-.447.94-1.086 2.273-1.086 1.66 0 2.902 1.086 2.902 3.42v2.796l-.006.002z"></path>
                        </svg>
                      </a>
                      <a href="https://www.instagram.com/maxmove" className="bg-maxmove-100 hover:bg-maxmove-200 transition-colors p-2 rounded-full" aria-label="Follow us on Instagram" title="Instagram">
                        <svg width="20" height="20" fill="currentColor" className="text-maxmove-600">
                          <path d="M10 0C7.283 0 6.944.012 5.877.06 2.246.227.227 2.242.061 5.877.01 6.944 0 7.283 0 10s.012 3.057.06 4.123c.167 3.632 2.182 5.65 5.817 5.817 1.067.048 1.407.06 4.123.06s3.057-.012 4.123-.06c3.629-.167 5.652-2.182 5.816-5.817.05-1.066.061-1.407.061-4.123s-.012-3.056-.06-4.122C19.777 2.249 17.76.228 14.124.06 13.057.01 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.976 1.409 4.099 4.099.047 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.718-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zm0 3.063a5.136 5.136 0 100 10.27 5.136 5.136 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm6.538-8.671a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card className="p-6 shadow-lg">
                {isSuccess ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-maxmove-900 mb-4">
                      Message Sent Successfully!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Thank you for reaching out. Our team will review your message and get back to you shortly.
                    </p>
                    <Button 
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      className="mx-auto"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-maxmove-900 mb-6">
                      Send Us a Message
                    </h2>
                    
                    {errorMessage && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        {errorMessage}
                      </div>
                    )}
                    
                    <form id="contactForm" action={handleSubmitWithState} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name"
                            placeholder="Your name" 
                            required 
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input 
                            id="email" 
                            name="email"
                            type="email" 
                            placeholder="your.email@example.com" 
                            required 
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <select 
                            id="department" 
                            name="department"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            aria-label="Department"
                            disabled={isSubmitting}
                          >
                            <option value="" disabled selected>Select department</option>
                            <option value="Customer Support">Customer Support</option>
                            <option value="Business Inquiries">Business Inquiries</option>
                            <option value="Driver Relations">Driver Relations</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Press & Media">Press & Media</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input 
                            id="subject" 
                            name="subject"
                            defaultValue={initialSubject}
                            placeholder="Message subject" 
                            required 
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea 
                          id="message" 
                          name="message"
                          placeholder="How can we help you?" 
                          className="min-h-[150px]" 
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-maxmove-navy text-maxmove-creme hover:bg-maxmove-navy/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : 'Send Message'}
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-maxmove-800"></div>
      </div>
    }>
      <ContactPageContent />
    </Suspense>
  );
}