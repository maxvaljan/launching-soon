'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OrdersSectionProps {
  eReceiptEnabled: boolean;
  eReceiptEmail: string;
  proofOfDeliveryEnabled: boolean;
  email: string;
  onUpdateEReceiptEnabled: (value: boolean) => void;
  onUpdateEReceiptEmail: (value: string) => void;
  onUpdateProofOfDeliveryEnabled: (value: boolean) => void;
  onSave: () => void;
}

export const OrdersSection = ({
  eReceiptEnabled,
  eReceiptEmail,
  proofOfDeliveryEnabled,
  email,
  onUpdateEReceiptEnabled,
  onUpdateEReceiptEmail,
  onUpdateProofOfDeliveryEnabled,
  onSave,
}: OrdersSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Orders Preferences</h2>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-medium">E-Receipts</h3>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="e-receipt"
              checked={eReceiptEnabled}
              onCheckedChange={onUpdateEReceiptEnabled}
            />
            <Label htmlFor="e-receipt">Send e-receipts for completed orders</Label>
          </div>
          
          {eReceiptEnabled && (
            <div className="mt-4">
              <label className="text-sm text-gray-500 uppercase">Receipt Email</label>
              <Input 
                value={eReceiptEmail || email}
                onChange={(e) => onUpdateEReceiptEmail(e.target.value)}
                placeholder="Email for receipts"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to use your account email
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Proof of Delivery</h3>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="proof-of-delivery"
              checked={proofOfDeliveryEnabled}
              onCheckedChange={onUpdateProofOfDeliveryEnabled}
            />
            <Label htmlFor="proof-of-delivery">
              Require photo proof of delivery
            </Label>
          </div>
          
          <p className="text-sm text-gray-500">
            When enabled, drivers will be required to take a photo of the delivered package at the destination
          </p>
        </div>
        
        <Button 
          onClick={onSave}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};