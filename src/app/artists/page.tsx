import { FilterSidebar } from "@/src/components/filter-sidebar";
import { Suspense } from "react";
import ArtistsLayout from "./ArtistsLayout";
import { prisma } from "@/src/lib/prisma";
import { ServiceCategory } from "@prisma/client";
import type { Artist } from "@/src/types";


interface PageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    view?: string;
  }>;
}

export default async function ArtistListingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // Build Prisma query based on search params
  const where: any = {};
  
  if (params.category && params.category !== "all") {
    where.category = params.category as ServiceCategory;
  }
  
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = Number(params.minPrice);
    if (params.maxPrice) where.price.lte = Number(params.maxPrice);
  }

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const artistsData = await prisma.artistProfile.findMany({
    include: {
      user: true,
      services: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform to match the Artist interface
  const artists: Artist[] = artistsData.map(profile => ({
    id: profile.id,
    name: profile.user.fullName || "Unnamed Artist",
    bio: profile.bio || "Professional artist ready to perform.",
    location: "Global",
    city: "Remote",
    categories: profile.skills.length > 0 ? profile.skills : ["General Performance"],
    languages: ["English"],
    feeRange: `$${profile.services[0]?.price || 0}`,
    profileImage: profile.user.imageUrl || undefined,
    createdAt: profile.createdAt,
  }));

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-[#f5e642] font-mono uppercase tracking-widest animate-pulse">Loading Artists...</p>
      </div>
    }>
      <div className="min-h-screen bg-[#0d0d0d]">
        {/* Hero header */}
        <div className="border-b border-white/10 py-12">
          <div className="container mx-auto px-4">
            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-3">// browse</p>
            <h1 className="text-5xl font-black text-white">FIND ARTISTS</h1>
            <p className="text-white/40 mt-2">{artists.length} verified artists available</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-72 flex-shrink-0">
              <FilterSidebar />
            </div>
            <div className="flex-1 min-w-0">
              <ArtistsLayout artists={artists} />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
