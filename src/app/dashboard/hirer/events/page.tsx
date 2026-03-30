import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Calendar, MapPin, DollarSign } from "lucide-react";
import EventCreateModal from "./EventCreateModal";
import EventManageCard from "./EventManageCard";

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

  const events = dbUser.hirerProfile.events.map((e) => ({
    ...e,
    budget: e.budget ? Number(e.budget) : null,
  }));

  return (
    <DashboardLayout role="HIRER">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#ff2a6d] font-mono text-xs uppercase tracking-widest mb-1">
              {"// hirer"}
            </p>
            <h1 className="text-4xl font-black text-white">MY EVENTS</h1>
          </div>
          <EventCreateModal />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            { label: "Total Events", value: events.length, color: "#ff2a6d" },
            {
              label: "Open",
              value: events.filter((e) => e.status === "OPEN").length,
              color: "#00ffcc",
            },
            {
              label: "Completed",
              value: events.filter((e) => e.status === "COMPLETED").length,
              color: "#888",
            },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] p-5">
              <div className="text-2xl font-black" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Event List */}
        {events.length === 0 ? (
          <div className="border-2 border-dashed border-white/10 p-16 text-center">
            <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/30 font-black uppercase tracking-wider text-lg mb-2">
              No events yet
            </p>
            <p className="text-white/20 text-sm">
              Post your first event to start finding artists.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <EventManageCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
