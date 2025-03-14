'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, PersonStanding, Building, Car } from 'lucide-react';

type AccountType = 'personal' | 'business' | 'driver';

interface AccountOption {
  id: AccountType;
  title: string;
  description: string;
  icon: React.ReactNode;
  dashboardPath: string;
}

export default function AccountSwitcher() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const accountOptions: AccountOption[] = [
    {
      id: 'personal',
      title: 'Personal Account',
      description: 'Send and receive packages for personal use',
      icon: <PersonStanding className="h-8 w-8 text-blue-500" />,
      dashboardPath: '/dashboard',
    },
    {
      id: 'business',
      title: 'Business Account',
      description: 'Manage deliveries for your business',
      icon: <Building className="h-8 w-8 text-purple-500" />,
      dashboardPath: '/dashboard',
    },
    {
      id: 'driver',
      title: 'Driver Account',
      description: 'Deliver packages and earn money',
      icon: <Car className="h-8 w-8 text-green-500" />,
      dashboardPath: '/driver-dashboard',
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.replace('/signin');
          return;
        }
        
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          throw profileError;
        }
        
        setUserProfile(profile);
        setSelectedType(profile.account_type as AccountType || 'personal');
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load your profile information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);

  // Handle switching account type
  const switchAccountType = async (type: AccountType) => {
    try {
      if (!userProfile) return;
      
      // If user is already on this account type, navigate to the dashboard
      if (selectedType === type) {
        const option = accountOptions.find(opt => opt.id === type);
        if (option) {
          router.push(option.dashboardPath);
        }
        return;
      }
      
      setSelectedType(type);
      
      // Update account type in database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_type: type, 
          role: type === 'driver' ? 'driver' : type === 'business' ? 'business' : 'user'
        })
        .eq('id', userProfile.id);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Switched to ${type} account`);
      
      // Redirect to the appropriate dashboard
      const option = accountOptions.find(opt => opt.id === type);
      if (option) {
        router.push(option.dashboardPath);
      }
    } catch (error) {
      console.error('Error switching account type:', error);
      toast.error('Failed to switch account type');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-maxmove-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Choose Account Type</h1>
        <p className="text-gray-600 text-center mb-10">
          Switch between different account types based on your needs
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accountOptions.map((option) => (
            <Card 
              key={option.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedType === option.id ? 'ring-2 ring-maxmove-500 ring-offset-2' : ''
              }`}
              onClick={() => switchAccountType(option.id)}
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="mb-4">
                  {option.icon}
                  {selectedType === option.id && (
                    <div className="h-6 w-6 bg-maxmove-500 rounded-full flex items-center justify-center absolute -right-2 -top-2">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-6">{option.description}</p>
                
                <Button 
                  variant={selectedType === option.id ? "default" : "outline"}
                  className="mt-auto w-full"
                  onClick={() => switchAccountType(option.id)}
                >
                  {selectedType === option.id ? 'Current Account' : 'Switch'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Note: Switching account types will change your dashboard and available features.
          </p>
        </div>
      </div>
    </div>
  );
}