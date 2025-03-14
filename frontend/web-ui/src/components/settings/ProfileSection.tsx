'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileSectionProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  onSave: () => void;
  onUpdateFirstName: (value: string) => void;
  onUpdateLastName: (value: string) => void;
  onUpdatePhone: (value: string) => void;
  onUpdateEmail: (value: string) => void;
}

export const ProfileSection = ({
  firstName,
  lastName,
  phone,
  email,
  onSave,
  onUpdateFirstName,
  onUpdateLastName,
  onUpdatePhone,
  onUpdateEmail,
}: ProfileSectionProps) => {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Profile</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500 uppercase">First Name</label>
          <Input 
            value={firstName}
            onChange={(e) => onUpdateFirstName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 uppercase">Last Name</label>
          <Input 
            value={lastName}
            onChange={(e) => onUpdateLastName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500 uppercase">Phone</label>
          <div className="flex items-center justify-between mt-1">
            {isEditingPhone ? (
              <Input 
                value={phone}
                onChange={(e) => onUpdatePhone(e.target.value)}
                className="mr-2"
              />
            ) : (
              <span className="text-gray-700">{phone || 'Add phone number'}</span>
            )}
            <Button 
              variant="ghost" 
              className="text-orange-500 hover:text-orange-600"
              onClick={() => setIsEditingPhone(!isEditingPhone)}
            >
              {isEditingPhone ? 'Save' : 'Change'}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 uppercase">Login Email</label>
          <div className="flex items-center justify-between mt-1">
            {isEditingEmail ? (
              <Input 
                value={email}
                onChange={(e) => onUpdateEmail(e.target.value)}
                className="mr-2"
              />
            ) : (
              <span className="text-gray-700">{email || 'Add email'}</span>
            )}
            <Button 
              variant="ghost" 
              className="text-orange-500 hover:text-orange-600"
              onClick={() => setIsEditingEmail(!isEditingEmail)}
            >
              {isEditingEmail ? 'Save' : 'Change'}
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 uppercase">Password</label>
          <div className="mt-1">
            <Button 
              variant="ghost" 
              className="text-orange-500 hover:text-orange-600 p-0"
            >
              Change Password
            </Button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500 uppercase">Account</label>
          <div className="mt-1">
            <Button 
              variant="ghost" 
              className="text-red-500 hover:text-red-600 p-0"
            >
              Delete Account
            </Button>
          </div>
        </div>

        <Button 
          onClick={onSave}
          className="mt-4 bg-orange-500 hover:bg-orange-600"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};