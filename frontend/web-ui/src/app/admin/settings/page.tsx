'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'MaxMove',
    supportEmail: 'support@maxmove.com',
    supportPhone: '+1 (800) 123-4567',
    defaultCurrency: 'USD',
    isMaintenanceMode: false,
    enableRegistration: true
  });

  const [serviceSettings, setServiceSettings] = useState({
    enableRating: true,
    enableLiveTracking: true,
    enableMultipleStops: false
  });

  // Stripe settings removed

  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSMSNotifications: true,
    adminEmailRecipients: 'admin@maxmove.com',
    orderCreatedNotification: true,
    orderCompletedNotification: true,
    orderCancelledNotification: true,
    newUserNotification: true
  });

  const handleSaveGeneral = () => {
    // In a real app, this would save to the database
    toast.success('General settings updated successfully');
  };

  const handleSaveService = () => {
    // In a real app, this would save to the database
    toast.success('Service settings updated successfully');
  };

  // Stripe settings handler removed

  const handleSaveNotifications = () => {
    // In a real app, this would save to the database
    toast.success('Notification settings updated successfully');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">System Settings</h1>
      
      <div className="space-y-8">
        {/* General Settings */}
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <Input 
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Support Email</label>
                <Input 
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Support Phone</label>
                <Input 
                  value={generalSettings.supportPhone}
                  onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Default Currency</label>
                <select 
                  className="w-full h-10 rounded-md border border-gray-300 px-3"
                  value={generalSettings.defaultCurrency}
                  onChange={(e) => setGeneralSettings({...generalSettings, defaultCurrency: e.target.value})}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Maintenance Mode</h3>
                <p className="text-sm text-gray-500">Enable to show a maintenance page to users</p>
              </div>
              <Switch 
                checked={generalSettings.isMaintenanceMode}
                onCheckedChange={(checked) => setGeneralSettings({...generalSettings, isMaintenanceMode: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Allow New Registrations</h3>
                <p className="text-sm text-gray-500">Enable to allow new user registrations</p>
              </div>
              <Switch 
                checked={generalSettings.enableRegistration}
                onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableRegistration: checked})}
              />
            </div>
            
            <Button className="mt-2" onClick={handleSaveGeneral}>
              Save General Settings
            </Button>
          </div>
        </Card>
        
        {/* Service Settings */}
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Service Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service settings fields removed */}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Enable Driver Ratings</h3>
                <p className="text-sm text-gray-500">Allow customers to rate drivers after delivery</p>
              </div>
              <Switch 
                checked={serviceSettings.enableRating}
                onCheckedChange={(checked) => setServiceSettings({...serviceSettings, enableRating: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Enable Live Tracking</h3>
                <p className="text-sm text-gray-500">Allow customers to track their deliveries in real-time</p>
              </div>
              <Switch 
                checked={serviceSettings.enableLiveTracking}
                onCheckedChange={(checked) => setServiceSettings({...serviceSettings, enableLiveTracking: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Enable Multiple Stops</h3>
                <p className="text-sm text-gray-500">Allow customers to add multiple delivery stops in one order</p>
              </div>
              <Switch 
                checked={serviceSettings.enableMultipleStops}
                onCheckedChange={(checked) => setServiceSettings({...serviceSettings, enableMultipleStops: checked})}
              />
            </div>
            
            <Button className="mt-2" onClick={handleSaveService}>
              Save Service Settings
            </Button>
          </div>
        </Card>
        
        {/* Payment Settings section removed */}
        
        {/* Notification Settings */}
        <Card className="p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Admin Email Recipients</label>
                <Input 
                  value={notificationSettings.adminEmailRecipients}
                  onChange={(e) => setNotificationSettings({...notificationSettings, adminEmailRecipients: e.target.value})}
                  placeholder="Comma-separated email addresses"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple email addresses with commas</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Enable Email Notifications</h3>
                <p className="text-sm text-gray-500">Send email notifications to users</p>
              </div>
              <Switch 
                checked={notificationSettings.enableEmailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableEmailNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Enable Push Notifications</h3>
                <p className="text-sm text-gray-500">Send push notifications to mobile devices</p>
              </div>
              <Switch 
                checked={notificationSettings.enablePushNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enablePushNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div>
                <h3 className="font-medium">Enable SMS Notifications</h3>
                <p className="text-sm text-gray-500">Send SMS notifications to users</p>
              </div>
              <Switch 
                checked={notificationSettings.enableSMSNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, enableSMSNotifications: checked})}
              />
            </div>
            
            <h3 className="font-medium mt-4">Notification Events</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm">New Order Created</span>
                <Switch 
                  checked={notificationSettings.orderCreatedNotification}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderCreatedNotification: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm">Order Completed</span>
                <Switch 
                  checked={notificationSettings.orderCompletedNotification}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderCompletedNotification: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm">Order Cancelled</span>
                <Switch 
                  checked={notificationSettings.orderCancelledNotification}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderCancelledNotification: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm">New User Registration</span>
                <Switch 
                  checked={notificationSettings.newUserNotification}
                  onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newUserNotification: checked})}
                />
              </div>
            </div>
            
            <Button className="mt-2" onClick={handleSaveNotifications}>
              Save Notification Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}