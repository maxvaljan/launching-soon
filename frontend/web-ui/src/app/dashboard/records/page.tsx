'use client';

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecordsPage() {
  return (
    <div className="px-4 py-6 md:px-8 lg:px-16 max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Records</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Cards */}
        {[
          { title: "Total Orders", subtitle: "Lifetime total" },
          { title: "Active Orders", subtitle: "Currently in progress" },
          { title: "Completed Orders", subtitle: "Successfully delivered" },
          { title: "Cancelled Orders", subtitle: "Orders cancelled" },
        ].map(({ title, subtitle }, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg border">
        <div className="p-4">
          <h3 className="text-lg font-medium">Recent Orders</h3>
          <p className="text-sm text-muted-foreground">
            Your order history will appear here
          </p>
        </div>
        <div className="p-4">No orders found</div>
      </div>
    </div>
  );
}
