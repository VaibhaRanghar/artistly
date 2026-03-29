import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Calendar, MapPin, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ArtistEventsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // Fetch all open events from hirers
  const events = await prisma.event.findMany({
    where: { status: "OPEN" },
    include: {
      hirer: { include: { user: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { date: "asc" },
  });

  return (
    <DashboardLayout role="ARTIST">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-1">// opportunities</p>
          <h1 className="text-4xl font-black text-white">BROWSE EVENTS</h1>
          <p className="text-white/40 mt-2">Events posted by hirers looking for artists like you.</p>
        </div>

        {/* Stats */}
        <div className="border-2 border-white/10 bg-[#111] px-6 py-4 flex items-center gap-4">
          <span className="text-2xl font-black text-[#f5e642]">{events.length}</span>
          <span className="text-white/40 uppercase tracking-wider text-sm font-bold">Open opportunities available</span>
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="border-2 border-dashed border-white/10 p-16 text-center">
            <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/30 font-black uppercase tracking-wider text-lg mb-2">No open events</p>
            <p className="text-white/20 text-sm">Check back soon — hirers post events regularly.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => {
              const budgetNum = event.budget ? Number(event.budget) : null;
              return (
                <div
                  key={event.id}
                  className="border-2 border-white/10 bg-[#111] p-6 hover:border-[#f5e642] transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-[#f5e642]/40 text-[#f5e642]">
                          OPEN
                        </span>
                        <span className="text-xs text-white/30 font-mono">
                          {event._count.orders} proposals
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-[#f5e642] transition-colors mb-2">
                        {event.title}
                      </h3>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">{event.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
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
                          <div className="flex items-center gap-1 text-[#00ffcc] font-bold">
                            <DollarSign className="h-3 w-3" />
                            Budget: ${budgetNum.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-white/30">Posted by</p>
                        <p className="text-sm font-bold text-white">
                          {event.hirer.user.fullName || "Hirer"}
                        </p>
                      </div>
                      <button
                        className="flex items-center gap-2 bg-[#f5e642] text-black px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors"
                      >
                        Express Interest
                        <ArrowRight className="h-3 w-3" />
                      </button>
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
