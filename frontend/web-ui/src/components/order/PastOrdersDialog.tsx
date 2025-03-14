'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PastOrder {
  id: string;
  pickup_address: string;
  dropoff_address: string;
}

interface PastOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pastOrders: PastOrder[];
}

const PastOrdersDialog = ({ open, onOpenChange, pastOrders }: PastOrdersDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Past Orders</DialogTitle>
        </DialogHeader>
        {pastOrders.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No past orders found</p>
        ) : (
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  From: {order.pickup_address}
                </p>
                <p className="text-sm text-gray-500">
                  To: {order.dropoff_address}
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PastOrdersDialog;