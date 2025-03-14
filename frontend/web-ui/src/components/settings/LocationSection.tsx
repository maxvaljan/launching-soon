'use client';

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LocationSectionProps {
  language: string;
  onUpdateLanguage: (value: "en" | "de") => void;
  onSave: () => void;
}

export const LocationSection = ({
  language,
  onUpdateLanguage,
  onSave,
}: LocationSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Location & Language</h2>
      
      <div className="space-y-6">
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Language</h3>
          
          <RadioGroup 
            defaultValue={language}
            onValueChange={(value) => onUpdateLanguage(value as "en" | "de")}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="lang-en" />
              <Label htmlFor="lang-en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="de" id="lang-de" />
              <Label htmlFor="lang-de">Deutsch (German)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="text-lg font-medium">Service Area</h3>
          <p className="text-sm text-gray-600">
            Maxmove is currently available in the following areas:
          </p>
          
          <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
            <li>Rhein-Ruhr Region</li>
            <li>Cologne Metropolitan Area</li>
            <li>Düsseldorf</li>
            <li>Essen</li>
            <li>Dortmund</li>
          </ul>
          
          <p className="text-sm text-gray-600 mt-4">
            More cities coming soon! We're continuously expanding our service areas.
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