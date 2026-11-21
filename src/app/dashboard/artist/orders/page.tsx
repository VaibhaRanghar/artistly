import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Badge } from "@/src/components/ui/badge";
import OrderActions from "./OrderActions";
import { getAuthUser } from "@/src/lib/auth";

export default async function ArtistOrdersPage() {
  const { dbUser: db } = await getAuthUser();
  if (!db?.artistProfile) redirect("/onboarding");

  const orders = await prisma.order.findMany({
    where: { sellerId: db.artistProfile.id },
    include: {
      buyer: { select: { fullName: true } },
      service: { select: { title: true } },
      event: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <DashboardLayout role="ARTIST">
      <div className="space-y-6">
        <div>
          <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-1">
            {"// bookings"}
          </p>
          <h1 className="text-3xl font-black text-white">
            MY ORDERS & PROPOSALS
          </h1>
          <p className="text-white/40 mt-1">
            Track incoming bookings and your submitted event proposals.
          </p>
        </div>

        <Card className="bg-[#111] border-white/10">
          <CardHeader>
            <CardTitle>Active Orders</CardTitle>
            <CardDescription className="text-white/40">
              Manage your workload and order statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/10 rounded-lg">
                <ShoppingBag className="h-12 w-12 text-white/20 mb-4" />
                <p className="text-white/30 font-bold uppercase tracking-wider text-center">
                  No orders found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isEventApplication = !!order.eventId;
                  const buyerName = order.buyer.fullName || "Someone";

                  return (
                    <div
                      key={order.id}
                      className="p-5 border-2 border-white/10 bg-black/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-white/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge
                            variant="outline"
                            className={
                              order.status === "COMPLETED"
                                ? "text-[#00ffcc] border-[#00ffcc]/30 bg-[#00ffcc]/10"
                                : order.status === "PENDING"
                                  ? "text-[#f5e642] border-[#f5e642]/30 bg-[#f5e642]/10"
                                  : order.status === "IN_PROGRESS"
                                    ? "text-[#ff2a6d] border-[#ff2a6d]/30 bg-[#ff2a6d]/10"
                                    : order.status === "CANCELLED"
                                      ? "text-red-500 border-red-500/30 bg-red-500/10"
                                      : "text-white/50 border-white/20"
                            }
                          >
                            {order.status === "IN_PROGRESS"
                              ? "ACTIVE PROJECT"
                              : order.status === "PENDING"
                                ? "PENDING APPROVAL"
                                : order.status === "COMPLETED"
                                  ? "COMPLETED"
                                  : order.status}
                          </Badge>
                          {isEventApplication && (
                            <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 border border-white/10 uppercase font-black">
                              Event Proposal
                            </span>
                          )}
                          {!isEventApplication && (
                            <span className="text-xs text-white/40 bg-[#00ffcc]/5 text-[#00ffcc] px-2 py-0.5 border border-[#00ffcc]/20 uppercase font-black">
                              Direct Booking
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-white text-lg mb-1 leading-tight">
                          {isEventApplication
                            ? order.event?.title
                            : order.service.title}
                        </h3>

                        <p className="text-sm text-white/50 mb-3">
                          {isEventApplication
                            ? `You proposed your service '${order.service.title}' to ${buyerName}`
                            : `Booked by ${buyerName}`}
                        </p>

                        {order.requirements && (
                          <div className="bg-[#0d0d0d] border border-white/5 p-3 rounded-none mb-3 text-sm text-white/70 italic border-l-2 border-l-[#f5e642]">
                            {`${order.requirements}`}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-[#00ffcc] font-bold">
                            ${Number(order.amount).toFixed(2)}
                          </span>
                          <span className="text-white/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {order.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="w-full md:w-auto shrink-0 flex flex-col items-end gap-2">
                        <OrderActions
                          orderId={order.id}
                          status={order.status}
                          isEventApplication={isEventApplication}
                        />
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
