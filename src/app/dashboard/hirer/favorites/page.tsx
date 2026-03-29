"use client";

import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Heart } from "lucide-react";

export default function HirerFavoritesPage() {
  return (
    <DashboardLayout role="HIRER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Favorites</h1>
          <p className="text-muted-foreground">Keep track of the artists you love.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Saved Artists</CardTitle>
            <CardDescription>Quickly access profiles you've short-listed for future events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20 border rounded-xl bg-muted/30">
               <Heart className="h-12 w-12 text-red-500 mb-4 opacity-50" />
               <p className="text-muted-foreground text-center font-medium">
                 Your favorites list is empty.
               </p>
               <p className="text-sm text-muted-foreground mt-1">
                 Browse artists and click the heart icon to save them here.
               </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
