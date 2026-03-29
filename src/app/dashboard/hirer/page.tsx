import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ShoppingBag, Heart, MessageSquare, Search, Calendar } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";

export default async function HirerDashboard() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      hirerProfile: {
        include: {
          _count: {
            select: {
              events: true,
            }
          }
        }
      },
      _count: {
        select: {
          buyerOrders: true,
        }
      }
    }
  });

  if (!dbUser?.hirerProfile) {
    redirect("/onboarding");
  }

  const stats = {
    orders: dbUser._count.buyerOrders,
    events: dbUser.hirerProfile._count.events,
    favorites: 0, // Placeholder
    spent: 0, // Placeholder
  };

  return (
    <DashboardLayout role="HIRER">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Hirer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {dbUser.fullName}! Manage your events and bookings here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
              <p className="text-xs text-muted-foreground">Active bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events}</div>
              <p className="text-xs text-muted-foreground">Total events posted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favorites}</div>
              <p className="text-xs text-muted-foreground">Artists saved</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Spent</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.spent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Lifetime spend</p>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.events === 0 ? (
               <p className="text-sm text-muted-foreground italic">You haven't posted any events yet. Create one to start hiring!</p>
            ) : (
               <p className="text-sm text-muted-foreground italic">Check your My Events tab for details.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
