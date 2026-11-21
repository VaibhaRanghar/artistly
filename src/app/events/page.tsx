import { prisma } from "@/src/lib/prisma";
import { Calendar, MapPin, DollarSign, Search, Filter } from "lucide-react";
import { redirect } from "next/navigation";
import ExpressInterestModal from "../dashboard/artist/events/ExpressInterestModal";
import { getAuthUser } from "@/src/lib/auth";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PublicEventsPage({ searchParams }: PageProps) {
  const [{ dbUser }, params] = await Promise.all([getAuthUser(), searchParams]);

  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 20;
  const skip = (page - 1) * limit;

  if (!dbUser?.artistProfile) redirect("/onboarding");

  // Fetch services for the express interest modal
  const profile = await prisma.artistProfile.findUnique({
    where: { id: dbUser.artistProfile.id },
    select: {
      id: true,
      services: {
        select: { id: true, title: true, price: true, category: true },
      },
    },
  });

  const events = await prisma.event.findMany({
    include: {
      hirer: {
        select: { user: { select: { fullName: true } } },
      },
      orders: {
        where: { sellerId: dbUser.artistProfile.id },
        select: { id: true },
      },
    },
    orderBy: { date: "desc" },
    skip,
    take: limit,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "border-[#00ffcc] text-[#00ffcc]";
      case "IN_PROGRESS":
        return "border-[#f5e642] text-[#f5e642]";
      case "COMPLETED":
        return "border-white/30 text-white/30";
      case "CANCELLED":
        return "border-red-500/50 text-red-500/50";
      default:
        return "border-white/10 text-white/10";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Upcoming / Open";
      case "IN_PROGRESS":
        return "Ongoing";
      case "COMPLETED":
        return "Finished";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="border-b border-white/10 py-12">
        <div className="container mx-auto px-4">
          <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-3">
            {"// browse"}
          </p>
          <h1 className="text-5xl font-black text-white">ALL EVENTS</h1>
          <p className="text-white/40 mt-2">
            Ongoing and upcoming opportunities in the community.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {events.length === 0 ? (
            <div className="border-2 border-dashed border-white/10 p-20 text-center">
              <Calendar className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/30 font-black uppercase tracking-wider text-lg">
                No events found
              </p>
            </div>
          ) : (
            events.map((event) => {
              const hasApplied = event.orders.length > 0;
              const budget = event.budget ? Number(event.budget) : null;
              const isJoinable = event.status === "OPEN" && !hasApplied;

              return (
                <div
                  key={event.id}
                  className="border-2 border-white/10 bg-[#111] p-6 hover:border-[#f5e642] transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 border ${getStatusColor(event.status)}`}
                        >
                          {getStatusLabel(event.status)}
                        </span>
                        {hasApplied && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#f5e642] text-black">
                            APPLICATION SENT
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-white group-hover:text-[#f5e642] transition-colors mb-2">
                        {event.title}
                      </h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-2 max-w-2xl">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wide text-white/40">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#f5e642]" />
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#f5e642]" />
                          {event.location}
                        </div>
                        {budget && (
                          <div className="flex items-center gap-2 text-[#00ffcc]">
                            <DollarSign className="h-4 w-4" />
                            Budget: ${budget.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-3 text-right">
                      <div>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">
                          Posted By
                        </p>
                        <p className="text-white font-bold">
                          {event.hirer.user.fullName}
                        </p>
                      </div>
                      {isJoinable ? (
                        <ExpressInterestModal
                          eventId={event.id}
                          eventTitle={event.title}
                          hirerId={event.hirerId}
                          services={(profile?.services || []).map((s:any) => ({
                            ...s,
                            price: Number(s.price),
                          }))}
                        />
                      ) : (
                        <div className="px-6 py-3 border-2 border-white/10 text-white/30 font-black uppercase text-sm italic">
                          {hasApplied ? "Applied" : "Registration Closed"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

