'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserCircle, Lock, BellRing, CreditCard, Car } from "lucide-react";
import { PhoneInput } from "@/components/signup/PhoneInput";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().min(8, "Invalid phone number"),
  marketingConsent: z.boolean().default(false),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  orderUpdates: z.boolean().default(true),
  promotions: z.boolean().default(false),
});

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [countryCode, setCountryCode] = useState("+49");
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      marketingConsent: false,
    },
  });
  
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      orderUpdates: true,
      promotions: false,
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data?.session?.user) {
          router.replace('/signin');
          return;
        }
        
        setUser(data.session.user);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        setProfile(profileData);
        
        // Set form values
        if (profileData) {
          // Extract country code and phone number
          const phone = profileData.phone || "";
          const phoneRegex = /^(\+\d+)(\d+)$/;
          const match = phone.match(phoneRegex);
          
          let extractedCountryCode = "+49";
          let phoneNumber = "";
          
          if (match) {
            extractedCountryCode = match[1];
            phoneNumber = match[2];
          }
          
          setCountryCode(extractedCountryCode);
          
          profileForm.reset({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            email: data.session.user.email || "",
            phoneNumber: phoneNumber,
            marketingConsent: profileData.marketing_consent || false,
          });
          
          notificationsForm.reset({
            emailNotifications: profileData.notifications?.email || true,
            smsNotifications: profileData.notifications?.sms || true,
            marketingEmails: profileData.notifications?.marketing || false,
            orderUpdates: profileData.notifications?.orders || true,
            promotions: profileData.notifications?.promotions || false,
          });
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        router.replace('/signin');
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, [router, profileForm, notificationsForm]);

  const handleProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    try {
      setSaving(true);
      
      // Format the phone number with country code
      const formattedPhone = `${countryCode}${data.phoneNumber}`;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: formattedPhone,
          marketing_consent: data.marketingConsent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };
  
  const handlePasswordSubmit = async (data: z.infer<typeof passwordFormSchema>) => {
    try {
      setSaving(true);
      
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });
      
      if (signInError) {
        throw new Error("Current password is incorrect");
      }
      
      // Then update the password
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password updated successfully");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };
  
  const handleNotificationsSubmit = async (data: z.infer<typeof notificationsFormSchema>) => {
    try {
      setSaving(true);
      
      const notificationsSettings = {
        email: data.emailNotifications,
        sms: data.smsNotifications,
        marketing: data.marketingEmails,
        orders: data.orderUpdates,
        promotions: data.promotions,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          notifications: notificationsSettings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Notification preferences updated");
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Successfully signed out');
      router.replace('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message);
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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 col-span-1 bg-white">
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full bg-maxmove-100 flex items-center justify-center mb-4">
                <UserCircle className="h-16 w-16 text-maxmove-600" />
              </div>
              <h2 className="text-lg font-semibold">{profile?.first_name} {profile?.last_name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-xs bg-maxmove-100 text-maxmove-700 px-2 py-1 rounded-full mt-2">
                {profile?.role === 'driver' ? 'Driver' : 
                 profile?.account_type === 'business' ? 'Business' : 'Personal'}
              </p>
            </div>
            
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === 'account' ? 'bg-maxmove-50 text-maxmove-900' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                Account
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === 'security' ? 'bg-maxmove-50 text-maxmove-900' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Lock className="mr-2 h-4 w-4" />
                Security
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === 'notifications' ? 'bg-maxmove-50 text-maxmove-900' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <BellRing className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              {profile?.role === 'driver' && (
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === 'driver' ? 'bg-maxmove-50 text-maxmove-900' : ''}`}
                  onClick={() => setActiveTab('driver')}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Driver Details
                </Button>
              )}
              <Button
                variant="ghost"
                className={`w-full justify-start ${activeTab === 'billing' ? 'bg-maxmove-50 text-maxmove-900' : ''}`}
                onClick={() => setActiveTab('billing')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payment Methods
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          </Card>
          
          <div className="col-span-1 md:col-span-3">
            {activeTab === 'account' && (
              <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} disabled />
                          </FormControl>
                          <FormDescription>
                            Email cannot be changed. Contact support if needed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
                      <PhoneInput 
                        form={profileForm} 
                        countryCode={countryCode} 
                        setCountryCode={setCountryCode} 
                      />
                    </div>
                    
                    <FormField
                      control={profileForm.control}
                      name="marketingConsent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Marketing Communications
                            </FormLabel>
                            <FormDescription>
                              Receive emails about new features, promotions, and news from MaxMove.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="bg-maxmove-800 hover:bg-maxmove-900 text-white" disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </Card>
            )}
            
            {activeTab === 'security' && (
              <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">Security</h2>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 6 characters long.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="bg-maxmove-800 hover:bg-maxmove-900 text-white" disabled={saving}>
                      {saving ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-medium mb-4">Account Security</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Two-Factor Authentication</Label>
                        <Button variant="outline" size="sm" className="bg-maxmove-50 text-maxmove-700">
                          Enable
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account by requiring a verification code in addition to your password.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Recent Logins</Label>
                        <Button variant="link" size="sm" className="text-maxmove-600 p-0">
                          View All
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Monitor recent login activity on your account.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            
            {activeTab === 'notifications' && (
              <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(handleNotificationsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Communication Channels</h3>
                      
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Email Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive notifications via email.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                SMS Notifications
                              </FormLabel>
                              <FormDescription>
                                Receive notifications via text message.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-medium">Notification Types</h3>
                      
                      <FormField
                        control={notificationsForm.control}
                        name="orderUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Order Updates
                              </FormLabel>
                              <FormDescription>
                                Updates about your order status, delivery confirmations, etc.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="marketingEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Marketing Emails
                              </FormLabel>
                              <FormDescription>
                                Newsletters, product updates, and company announcements.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationsForm.control}
                        name="promotions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Promotions and Offers
                              </FormLabel>
                              <FormDescription>
                                Discounts, special offers, and promotional campaigns.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="bg-maxmove-800 hover:bg-maxmove-900 text-white" disabled={saving}>
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </form>
                </Form>
              </Card>
            )}
            
            {activeTab === 'driver' && profile?.role === 'driver' && (
              <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">Driver Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-500 text-sm">Vehicle Type</Label>
                    <p className="font-medium">{profile?.vehicle_type || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500 text-sm">License Number</Label>
                    <p className="font-medium">{profile?.license_number || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500 text-sm">Account Status</Label>
                    <p className="font-medium">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        profile?.status === 'active' ? 'bg-green-100 text-green-700' : 
                        profile?.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {profile?.status || "Active"}
                      </span>
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500 text-sm">Completed Orders</Label>
                    <p className="font-medium">{profile?.completed_orders || "0"}</p>
                  </div>
                  
                  <div>
                    <Label className="text-gray-500 text-sm">Rating</Label>
                    <div className="flex items-center">
                      <p className="font-medium mr-1">{profile?.rating || "N/A"}</p>
                      {profile?.rating && <span className="text-yellow-500">★</span>}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-medium mb-4">Documents</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload or update your driver's license, insurance, and other documents required for your driver account.
                  </p>
                  
                  <Button className="bg-maxmove-800 hover:bg-maxmove-900 text-white">
                    Manage Documents
                  </Button>
                </div>
                
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-medium mb-4">Availability Settings</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Set your working hours and availability for receiving delivery requests.
                  </p>
                  
                  <Button className="bg-maxmove-800 hover:bg-maxmove-900 text-white">
                    Set Availability
                  </Button>
                </div>
              </Card>
            )}
            
            {activeTab === 'billing' && (
              <Card className="p-6 bg-white">
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                
                <div className="rounded-md border p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-blue-100 rounded mr-3 flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-800">VISA</span>
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm" className="h-8 text-sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-sm text-red-600">
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      Default
                    </span>
                  </div>
                </div>
                
                <Button className="mb-6">
                  Add Payment Method
                </Button>
                
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                  
                  <div className="space-y-2 mb-6">
                    <p>John Doe</p>
                    <p>123 Main Street</p>
                    <p>Apt 4B</p>
                    <p>Berlin, 10115</p>
                    <p>Germany</p>
                  </div>
                  
                  <Button variant="outline">
                    Edit Billing Address
                  </Button>
                </div>
                
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-medium mb-4">Billing History</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #12345</p>
                        <p className="text-sm text-gray-500">October 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€49.99</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #12344</p>
                        <p className="text-sm text-gray-500">September 28, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€29.99</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Order #12343</p>
                        <p className="text-sm text-gray-500">September 15, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€39.99</p>
                        <p className="text-xs text-green-600">Paid</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="link" className="mt-4 text-maxmove-600 p-0">
                    View All Transactions
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}