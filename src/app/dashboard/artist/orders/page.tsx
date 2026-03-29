"use client";

import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function ArtistOrdersPage() {
  return (
    <DashboardLayout role="ARTIST">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Track and manage your bookings and deliverables.</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium italic">Active Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-20 text-muted-foreground italic border rounded-md">
              No orders found.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
