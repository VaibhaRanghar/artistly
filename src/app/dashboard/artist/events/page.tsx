import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Calendar, MapPin, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ExpressInterestModal from "./ExpressInterestModal";

export default async function ArtistEventsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      artistProfile: {
        include: { services: true }
      }
    }
  });

  if (!dbUser?.artistProfile) redirect("/onboarding");

  // Fetch all events from hirers as requested
  const events = await prisma.event.findMany({
    include: {
      hirer: { include: { user: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { date: "asc" },
  });

  // Check which events this artist has already applied to
  const appliedOrders = await prisma.order.findMany({
    where: { sellerId: dbUser.id, eventId: { not: null } },
    select: { eventId: true }
  });
  const appliedEventIds = new Set(appliedOrders.map(o => o.eventId));

  const artistServices = dbUser.artistProfile.services.map(s => ({
    id: s.id,
    title: s.title,
    price: Number(s.price),
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "border-[#00ffcc] text-[#00ffcc]";
      case "IN_PROGRESS": return "border-[#f5e642] text-[#f5e642]";
      case "COMPLETED": return "border-white/30 text-white/30";
      case "CANCELLED": return "border-red-500/50 text-red-500/50";
      default: return "border-white/10 text-white/10";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OPEN": return "Open";
      case "IN_PROGRESS": return "Ongoing";
      case "COMPLETED": return "Finished";
      case "CANCELLED": return "Cancelled";
      default: return status;
    }
  };

  return (
    <DashboardLayout role="ARTIST">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-1">{"// opportunities"}</p>
            <h1 className="text-4xl font-black text-white">ALL EVENTS</h1>
            <p className="text-white/40 mt-2">Discover upcoming and ongoing events looking for talent.</p>
          </div>
          <Link href="/events" className="text-xs font-black uppercase tracking-widest text-[#f5e642] border-b border-[#f5e642] pb-1 hover:text-white hover:border-white transition-colors">
            View Public List →
          </Link>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="border-2 border-dashed border-white/10 p-16 text-center">
            <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/30 font-black uppercase tracking-wider text-lg mb-2">No events found</p>
            <p className="text-white/20 text-sm">Check back soon — hirers post events regularly.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => {
              const budgetNum = event.budget ? Number(event.budget) : null;
              const hasApplied = appliedEventIds.has(event.id);
              const isJoinable = event.status === "OPEN" && !hasApplied;

              return (
                <div
                  key={event.id}
                  className="border-2 border-white/10 bg-[#111] p-6 hover:border-[#f5e642] transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${getStatusColor(event.status)}`}>
                          {getStatusLabel(event.status)}
                        </span>
                        {hasApplied && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#f5e642] text-black">
                            APPLICATION SENT
                          </span>
                        )}
                        <span className="text-[10px] text-white/30 font-mono">
                          {event._count.orders} proposals
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-[#f5e642] transition-colors mb-2">
                        {event.title}
                      </h3>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4 max-w-2xl">{event.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wide text-white/40">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        {budgetNum && (
                          <div className="flex items-center gap-1 text-[#00ffcc]">
                            <DollarSign className="h-3 w-3" />
                            ${budgetNum.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0 text-right">
                      <div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Posted by</p>
                        <p className="text-sm font-bold text-white">
                          {event.hirer.user.fullName || "Hirer"}
                        </p>
                      </div>
                      {isJoinable ? (
                        <ExpressInterestModal 
                          eventId={event.id} 
                          services={artistServices} 
                          defaultAmount={budgetNum || undefined} 
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-white/30 border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-wider">
                          {hasApplied ? "Applied" : "Registration Closed"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
