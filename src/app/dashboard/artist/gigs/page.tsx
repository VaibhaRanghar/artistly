import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import { Briefcase, DollarSign, Clock, Plus } from "lucide-react";
import Link from "next/link";
import GigCreateModal from "./GigCreateModal";
import GigManageCard from "./GigManageCard";

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

  const gigs = dbUser.artistProfile.services.map(gig => ({
    ...gig,
    price: Number(gig.price)
  }));

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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gigs.map((gig) => (
              <GigManageCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
