'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { format } from "date-fns";

interface PastOrder {
  id: string;
  pickup_address: string;
  dropoff_address: string;
  created_at?: string;
  vehicle_type?: string;
}

interface PastOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pastOrders: PastOrder[];
}

const PastOrdersDialog = ({ open, onOpenChange, pastOrders }: PastOrdersDialogProps) => {
  const handleSelectOrder = (order: PastOrder) => {
    // You would implement the logic to load the selected order
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-maxmove-navy">Past Orders</DialogTitle>
          <p className="text-sm text-gray-500">Select an order to use as a template</p>
        </DialogHeader>
        
        <div className="mt-4">
          {pastOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 p-3 bg-gray-100 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12L14 14" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M3.05493 11.5C3.55238 6.81764 7.4775 3 12 3C16.5225 3 20.4476 6.81764 20.9451 11.5C21.3176 14.9463 20.8058 19 14.0000 19H10.0000C3.19415 19 2.68237 14.9463 3.05493 11.5Z" stroke="#6B7280" strokeWidth="1.5"/>
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No past orders found</p>
              <p className="text-sm text-gray-500 mt-1">Your previous orders will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {pastOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-maxmove-navy hover:bg-maxmove-creme transition-all cursor-pointer"
                  onClick={() => handleSelectOrder(order)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-maxmove-navy">
                      Order #{order.id.substring(0, 8)}
                    </h3>
                    {order.created_at && (
                      <span className="text-xs text-gray-500">
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="mt-1 mr-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">Pickup</p>
                        <p className="text-gray-600 text-xs">{order.pickup_address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mt-1 mr-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">Dropoff</p>
                        <p className="text-gray-600 text-xs">{order.dropoff_address}</p>
                      </div>
                    </div>
                  </div>
                  
                  {order.vehicle_type && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <span className="mr-1">🚚</span> {order.vehicle_type}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PastOrdersDialog;