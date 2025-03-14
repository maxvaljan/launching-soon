'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  section: string;
}

interface SettingsSidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  onSignOut: () => void;
}

export const SettingsSidebar = ({
  menuItems,
  activeSection,
  onSectionChange,
  onSignOut,
}: SettingsSidebarProps) => {
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      {Object.entries(groupedMenuItems).map(([section, items]) => (
        <div key={section} className="mb-8">
          <h3 className="text-xs text-gray-500 font-medium mb-2">{section}</h3>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activeSection === item.id
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
      
      <Button
        onClick={onSignOut}
        className="w-full flex items-center space-x-3 px-3 py-2 mt-auto text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
        variant="ghost"
      >
        <LogOut className="h-5 w-5" />
        <span>Log Out</span>
      </Button>
    </div>
  );
};