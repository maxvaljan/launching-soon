'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderActionsProps {
  onPastOrders: () => void;
  onDownloadTemplate: () => void;
  onCsvImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const OrderActions = ({ 
  onPastOrders, 
  onDownloadTemplate, 
  onCsvImport, 
  isLoading 
}: OrderActionsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="bg-white"
        onClick={onPastOrders}
        disabled={isLoading}
      >
        Past Orders
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-white">
            Import Addresses
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onDownloadTemplate}>
            Download Template
          </DropdownMenuItem>
          <DropdownMenuItem>
            <label className="cursor-pointer w-full">
              Import CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={onCsvImport}
              />
            </label>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrderActions;