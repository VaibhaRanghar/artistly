import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import EventCreateModal from "./EventCreateModal";

export default async function HirerEventsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      hirerProfile: {
        include: {
          events: {
            orderBy: { date: "asc" },
            include: { _count: { select: { orders: true } } },
          },
        },
      },
    },
  });

  if (!dbUser?.hirerProfile) redirect("/onboarding");

  const events = dbUser.hirerProfile.events;

  const statusColor: Record<string, string> = {
    OPEN: "#00ffcc",
    IN_PROGRESS: "#f5e642",
    COMPLETED: "#888",
    CANCELLED: "#ff2a6d",
  };

  return (
    <DashboardLayout role="HIRER">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#ff2a6d] font-mono text-xs uppercase tracking-widest mb-1">// hirer</p>
            <h1 className="text-4xl font-black text-white">MY EVENTS</h1>
          </div>
          <EventCreateModal />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            { label: "Total Events", value: events.length,                                          color: "#ff2a6d" },
            { label: "Open",         value: events.filter(e => e.status === "OPEN").length,         color: "#00ffcc" },
            { label: "Completed",    value: events.filter(e => e.status === "COMPLETED").length,    color: "#888"    },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] p-5">
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Event List */}
        {events.length === 0 ? (
          <div className="border-2 border-dashed border-white/10 p-16 text-center">
            <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/30 font-black uppercase tracking-wider text-lg mb-2">No events yet</p>
            <p className="text-white/20 text-sm">Post your first event to start finding artists.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => {
              const budget = event.budget ? Number(event.budget) : null;
              const color = statusColor[event.status] || "#888";
              return (
                <div key={event.id} className="border-2 border-white/10 bg-[#111] p-6 hover:border-[#ff2a6d] transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 border"
                          style={{ borderColor: color + "60", color }}>
                          {event.status}
                        </span>
                        <span className="text-xs text-white/30 font-mono">{event._count.orders} proposals</span>
                      </div>
                      <h3 className="text-xl font-black text-white group-hover:text-[#ff2a6d] transition-colors mb-2">{event.title}</h3>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        {budget && (
                          <div className="flex items-center gap-1 text-[#00ffcc] font-bold">
                            <DollarSign className="h-3 w-3" />
                            ${budget.toLocaleString()}
                          </div>
                        )}
                      </div>
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
