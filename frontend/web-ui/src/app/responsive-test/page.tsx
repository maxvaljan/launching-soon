'use client';

import { ResponsiveCheck, ResponsiveDebug } from '@/components/ui/responsive-check';
import { Button } from '@/components/ui/button';
import { PageLayout, PageHeader, PageSection } from '@/components/layouts/page-layout';
import { TextField, TextareaField, SelectField, CheckboxField, SwitchField } from '@/components/ui/form-field';
import { FormError, FormSuccess } from '@/components/ui/form-error';
import { useState } from 'react';
import { MailIcon, LockIcon, SearchIcon, InfoIcon } from 'lucide-react';
import { Loading, PageLoading, LoadingButton } from '@/components/ui/loading';
import { Card } from '@/components/ui/card';

export default function ResponsiveTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFullPageLoading, setShowFullPageLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleLoadingToggle = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleFullPageLoadingToggle = () => {
    setShowFullPageLoading(true);
    setTimeout(() => setShowFullPageLoading(false), 2000);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setIsLoading(true);
    
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        setFormSuccess('Form submitted successfully!');
      } else {
        setFormError('There was an error submitting the form. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      <ResponsiveCheck />
      <ResponsiveDebug />
      
      {showFullPageLoading && <PageLoading message="Loading page content..." />}
      
      <PageLayout maxWidth="2xl" paddingTop="header">
        <PageHeader 
          title="Responsive Testing Page" 
          description="This page shows the UI components and tests responsive behavior"
          action={
            <Button variant="outline" onClick={handleFullPageLoadingToggle}>
              Show Page Loading
            </Button>
          }
        />
        
        <PageSection 
          className="bg-gray-50 rounded-lg"
          paddingX="md"
          paddingY="md"
        >
          <h2 className="text-xl font-semibold mb-4">Responsive Breakpoints</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <div className="bg-red-100 p-4 rounded-lg border border-red-200 text-center">
              <div className="block sm:hidden font-bold">xs</div>
              <div className="hidden sm:block font-bold text-muted-foreground">xs</div>
              <div className="text-xs">Default</div>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg border border-orange-200 text-center">
              <div className="hidden sm:block md:hidden font-bold">sm</div>
              <div className="block sm:hidden md:block font-bold text-muted-foreground">sm</div>
              <div className="text-xs">≥640px</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200 text-center">
              <div className="hidden md:block lg:hidden font-bold">md</div>
              <div className="block md:hidden lg:block font-bold text-muted-foreground">md</div>
              <div className="text-xs">≥768px</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg border border-green-200 text-center">
              <div className="hidden lg:block xl:hidden font-bold">lg</div>
              <div className="block lg:hidden xl:block font-bold text-muted-foreground">lg</div>
              <div className="text-xs">≥1024px</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-200 text-center">
              <div className="hidden xl:block 2xl:hidden font-bold">xl</div>
              <div className="block xl:hidden 2xl:block font-bold text-muted-foreground">xl</div>
              <div className="text-xs">≥1280px</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg border border-purple-200 text-center">
              <div className="hidden 2xl:block font-bold">2xl</div>
              <div className="block 2xl:hidden font-bold text-muted-foreground">2xl</div>
              <div className="text-xs">≥1536px</div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-sm text-muted-foreground mb-4">You can toggle the responsive checker by pressing <kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded">Alt</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded">R</kbd></p>
          </div>
        </PageSection>
        
        <PageSection 
          className="mt-8"
          paddingY="md"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Form Components & Loading States</h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formError && <FormError message={formError} />}
              {formSuccess && <FormSuccess message={formSuccess} />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextField 
                  label="Email" 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  required
                  icon={<MailIcon className="h-4 w-4" />}
                  description="We'll never share your email with anyone else."
                />
                
                <TextField 
                  label="Password" 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  required
                  icon={<LockIcon className="h-4 w-4" />}
                  showPasswordToggle
                  error={formError ? "Password is incorrect" : undefined}
                />
              </div>
              
              <TextareaField 
                label="Message" 
                id="message" 
                placeholder="Enter your message" 
                rows={4}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField 
                  label="Country" 
                  id="country" 
                  placeholder="Select your country"
                  options={[
                    { value: 'us', label: 'United States' },
                    { value: 'ca', label: 'Canada' },
                    { value: 'mx', label: 'Mexico' },
                    { value: 'uk', label: 'United Kingdom' },
                    { value: 'de', label: 'Germany' },
                    { value: 'fr', label: 'France' },
                  ]}
                />
                
                <div className="space-y-4">
                  <CheckboxField 
                    label="I agree to the terms and conditions" 
                    id="terms" 
                    required
                  />
                  
                  <SwitchField 
                    label="Subscribe to newsletter" 
                    id="newsletter" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <LoadingButton 
                  type="submit" 
                  isLoading={isLoading}
                >
                  Submit Form
                </LoadingButton>
                
                <Button type="button" variant="outline" onClick={handleLoadingToggle}>
                  Show Button Loading
                </Button>
              </div>
            </form>
          </Card>
        </PageSection>
        
        <PageSection className="mt-8" paddingY="md">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Loading Components</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center gap-2">
                <Loading variant="spinner" size="lg" />
                <p className="text-sm font-medium">Spinner</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <Loading variant="dots" size="md" />
                <p className="text-sm font-medium">Dots</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-full max-w-[200px]">
                  <Loading variant="bar" />
                </div>
                <p className="text-sm font-medium">Bar</p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-full max-w-[200px] h-12">
                  <Loading variant="skeleton" className="h-full w-full" />
                </div>
                <p className="text-sm font-medium">Skeleton</p>
              </div>
            </div>
          </Card>
        </PageSection>
        
        <PageSection className="mt-8 mb-12" paddingY="md">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Responsive Grid</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex items-center justify-center aspect-video"
                >
                  <p className="font-medium">Item {i + 1}</p>
                </div>
              ))}
            </div>
          </Card>
        </PageSection>
      </PageLayout>
    </>
  );
}