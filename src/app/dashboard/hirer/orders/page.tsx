"use client";

import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { ShoppingBag, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function HirerOrdersPage() {
  return (
    <DashboardLayout role="HIRER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders</h1>
            <p className="text-muted-foreground">Manage your current and past artist bookings.</p>
          </div>
          <Link href="/artists">
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Find Artists
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track the progress of your active projects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg">
               <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
               <p className="text-muted-foreground italic text-center">
                 You haven't placed any orders yet.
               </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
