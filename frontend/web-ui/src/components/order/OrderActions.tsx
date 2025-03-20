'use client';

import { Button } from "@/components/ui/button";
import { FileText, UploadCloud, Download } from "lucide-react";
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
        className="bg-white flex items-center gap-2 font-medium text-maxmove-navy hover:bg-maxmove-navy/5 hover:text-maxmove-navy"
        onClick={onPastOrders}
        disabled={isLoading}
      >
        <FileText className="h-4 w-4 text-maxmove-navy/70" />
        Past Orders
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white flex items-center gap-2 font-medium text-maxmove-navy hover:bg-maxmove-navy/5 hover:text-maxmove-navy"
          >
            <UploadCloud className="h-4 w-4 text-maxmove-navy/70" />
            Import Addresses
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem 
            onClick={onDownloadTemplate}
            className="flex items-center gap-2.5 py-2.5"
          >
            <Download className="h-4 w-4 text-maxmove-navy/70" />
            Download Template
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2.5 py-2.5">
            <label className="cursor-pointer w-full flex items-center gap-2.5">
              <UploadCloud className="h-4 w-4 text-maxmove-navy/70" />
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