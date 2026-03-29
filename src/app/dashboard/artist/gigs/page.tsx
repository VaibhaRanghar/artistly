import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Briefcase, DollarSign, Clock, Plus } from "lucide-react";
import Link from "next/link";
import GigCreateModal from "./GigCreateModal";


export default async function ArtistGigsPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      artistProfile: {
        include: {
          services: { orderBy: { createdAt: "desc" } },
        },
      },
    },
  });

  if (!dbUser?.artistProfile) redirect("/onboarding");

  const gigs = dbUser.artistProfile.services;

  return (
    <DashboardLayout role="ARTIST">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-1">// my services</p>
            <h1 className="text-4xl font-black text-white">MY GIGS</h1>
          </div>
          <GigCreateModal />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-white/10 border border-white/10">
          {[
            { label: "Total Gigs", value: gigs.length, color: "#f5e642" },
            { label: "Active",     value: gigs.length, color: "#00ffcc" },
            { label: "Revenue",    value: "$0",         color: "#ff2a6d" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] p-5">
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Gig List */}
        {gigs.length === 0 ? (
          <div className="border-2 border-dashed border-white/10 p-16 text-center">
            <Briefcase className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/30 font-black uppercase tracking-wider text-lg mb-2">No gigs yet</p>
            <p className="text-white/20 text-sm">Click "Create New Gig" to start showcasing your work.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="border-2 border-white/10 bg-[#111] p-6 hover:border-[#f5e642] transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-black text-white group-hover:text-[#f5e642] transition-colors leading-tight pr-4">
                    {gig.title}
                  </h3>
                  <span className="text-xs font-bold uppercase px-2 py-0.5 border border-[#ff2a6d]/40 text-[#ff2a6d] flex-shrink-0">
                    {gig.category}
                  </span>
                </div>
                <p className="text-sm text-white/40 mb-4 line-clamp-2">{gig.description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[#00ffcc] font-black text-sm">
                    <DollarSign className="h-3.5 w-3.5" />
                    {Number(gig.price).toFixed(0)}
                  </div>
                  <div className="flex items-center gap-1 text-white/30 text-xs">
                    <Clock className="h-3 w-3" />
                    {gig.deliveryTime}d delivery
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
