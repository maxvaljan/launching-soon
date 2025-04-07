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
                      
                      <div className="border-t pt-6">
                        <Button 
                          type="submit" 
                          className="w-full bg-maxmove-navy hover:bg-maxmove-blue text-maxmove-creme"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </div>
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