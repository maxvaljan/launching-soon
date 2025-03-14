'use client';

import { useToast } from "@/hooks/use-toast";
import OrderActions from "./OrderActions";

interface FileImportActionsProps {
  isLoading: boolean;
  onPastOrders: () => void;
}

const FileImportActions = ({ isLoading, onPastOrders }: FileImportActionsProps) => {
  const { toast } = useToast();

  const downloadTemplate = () => {
    const template = "pickup_address,pickup_latitude,pickup_longitude,dropoff_address,dropoff_latitude,dropoff_longitude\n123 Pickup St,40.7128,-74.0060,456 Dropoff Ave,40.7589,-73.9851";
    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "address_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "CSV Import",
        description: "CSV import functionality will be implemented here",
      });
    }
  };

  return (
    <OrderActions
      onPastOrders={onPastOrders}
      onDownloadTemplate={downloadTemplate}
      onCsvImport={handleCsvImport}
      isLoading={isLoading}
    />
  );
};

export default FileImportActions;