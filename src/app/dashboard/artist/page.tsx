import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Briefcase, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export default async function ArtistDashboard() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      artistProfile: {
        include: {
          _count: {
            select: {
              services: true,
              sellerOrders: true,
            }
          }
        }
      }
    }
  });

  if (!dbUser?.artistProfile) {
    redirect("/onboarding");
  }

  const stats = {
    earnings: 0, // Placeholder for actual payment integration
    gigs: dbUser.artistProfile._count.services,
    orders: dbUser.artistProfile._count.sellerOrders,
    rating: dbUser.artistProfile.rating,
  };

  return (
    <DashboardLayout role="ARTIST">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Artist Overview</h1>
          <p className="text-muted-foreground">Welcome back, {dbUser.fullName}! Here's your profile status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.earnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Payment integration coming soon</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Gigs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.gigs}</div>
              <p className="text-xs text-muted-foreground">Services offered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
              <p className="text-xs text-muted-foreground">Total bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Based on {dbUser.artistProfile.reviewCount} reviews</p>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.gigs === 0 && stats.orders === 0 ? (
               <p className="text-sm text-muted-foreground italic">You haven't added any gigs or received any orders yet. Let's get started!</p>
            ) : (
               <p className="text-sm text-muted-foreground italic">Check your Gigs and Orders tabs for details.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
