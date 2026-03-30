"use client";

import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <DashboardLayout role="ADMIN">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track platform growth and booking metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Growth Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center border-t mt-4 text-muted-foreground italic">
                Analytics visualization coming soon.
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Booking Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center border-t mt-4 text-muted-foreground italic">
                Booking reports will appear here.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
