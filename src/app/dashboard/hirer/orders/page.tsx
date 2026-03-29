import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { ShoppingBag, Search, Clock } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreateReview } from "@/src/components/dashboard/create-review";
import { Badge } from "@/src/components/ui/badge";
import HirerOrderActions from "./HirerOrderActions";

export default async function HirerOrdersPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) redirect("/onboarding");

  const orders = await prisma.order.findMany({
    where: { buyerId: dbUser.id },
    include: {
      service: {
        include: {
          artist: { include: { user: true } }
        }
      },
      event: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <DashboardLayout role="HIRER">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Orders & Proposals</h1>
            <p className="text-muted-foreground">Manage your current and past artist bookings.</p>
          </div>
          <Link href="/artists">
            <Button className="gap-2 bg-[#f5e642] text-black hover:bg-[#ffe31a]">
              <Search className="h-4 w-4" />
              Find Artists
            </Button>
          </Link>
        </div>

        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Track the progress of your active projects.</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-lg">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground italic text-center">
                  You haven't placed any orders yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isEventApplication = !!order.eventId;

                  return (
                    <div key={order.id} className="p-4 border border-white/10 bg-black/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-white/30 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className={
                            order.status === "COMPLETED" ? "text-green-400 border-green-400/30" : 
                            order.status === "PENDING" ? "text-yellow-400 border-yellow-400/30" : 
                            order.status === "CANCELLED" ? "text-red-500 border-red-500/30" :
                            "text-white/50 border-white/20"
                          }>
                            {order.status}
                          </Badge>
                          {isEventApplication ? (
                            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 border border-white/10 uppercase font-black">
                              Event Proposal
                            </span>
                          ) : (
                            <span className="text-xs text-[#00ffcc] bg-[#00ffcc]/5 px-2 py-0.5 border border-[#00ffcc]/20 uppercase font-black">
                              Direct Booking
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-white mb-1">
                          {isEventApplication ? order.event?.title : order.service.title}
                        </h3>
                        <p className="text-sm text-white/50 mb-2">
                          Artist: {order.service.artist.user.fullName}
                        </p>
                        
                        {order.requirements && (
                          <div className="bg-[#0d0d0d] border border-white/5 p-3 rounded-none mb-3 text-sm text-white/70 italic border-l-2 border-l-[#f5e642]">
                            "{order.requirements}"
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-white/40 font-mono">
                            ${Number(order.amount).toFixed(2)}
                          </span>
                          <span className="text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {order.status === "COMPLETED" ? (
                          <CreateReview orderId={order.id} serviceId={order.serviceId} />
                        ) : (
                          <HirerOrderActions orderId={order.id} status={order.status} isEventApplication={isEventApplication} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
