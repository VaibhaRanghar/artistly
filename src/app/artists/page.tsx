import { FilterSidebar } from "@/src/components/filter-sidebar";
import { Suspense } from "react";
import ArtistsLayout from "./ArtistsLayout";
import { prisma } from "@/src/lib/prisma";
import { Prisma, ServiceCategory } from "@prisma/client";
import type { Artist } from "@/src/types";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    view?: string;
    page?: string;
  }>;
}

export default async function ArtistListingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const limit = 20;
  const skip = (page - 1) * limit;
  
  // Build Prisma query based on search params
  const serviceWhere: Prisma.ServiceWhereInput = {};
  let hasServiceFilter = false;

  if (params.category && params.category !== "all") {
    serviceWhere.category = params.category.toUpperCase() as ServiceCategory;
    hasServiceFilter = true;
  }
  
  if (params.minPrice || params.maxPrice) {
    const min = Number(params.minPrice || 0);
    const max = Number(params.maxPrice || 1000000);
    
    // Only apply price filter if it's explicitly set to non-default bounds
    if (min > 0 || max < 3000) {
      serviceWhere.price = { gte: min, lte: max };
      hasServiceFilter = true;
    }
  }

  if (params.search) {
    serviceWhere.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
    hasServiceFilter = true;
  }

  const artistWhere: Prisma.ArtistProfileWhereInput = {};
  if (hasServiceFilter) {
    artistWhere.services = { some: serviceWhere };
  }

  const [artistsData, totalArtists] = await Promise.all([
    prisma.artistProfile.findMany({
      where: artistWhere,
      include: {
        user: true,
        services: {
          // removed take: 1 so we get all matching services
          where: serviceWhere,
          orderBy: { price: "asc" }
        },
        _count: {
          select: { services: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.artistProfile.count({ where: artistWhere })
  ]);

  // Transform to match the Artist interface
  const artists: Artist[] = artistsData.map(profile => {
    const minPrice = Number(profile.minimumPrice) || Number(profile.services[0]?.price) || 0;
    const maxPrice = Number(profile.maximumPrice) || minPrice;
    const feeRange = minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`;

    // Combine explicit skills and dynamic service categories
    const serviceCats = profile.services.map(s => s.category);
    const allCategories = Array.from(new Set([...profile.skills, ...serviceCats]));

    return {
      id: profile.id,
      name: profile.user.fullName || "Unnamed Artist",
      bio: profile.bio || "Professional artist ready to perform.",
      location: profile.location || "Global",
      city: profile.city || "Remote",
      categories: allCategories.length > 0 ? allCategories : ["General Performance"],
      languages: profile.languages.length > 0 ? profile.languages : ["English"],
      feeRange,
      profileImage: profile.user.imageUrl || undefined,
      createdAt: profile.createdAt,
    };
  });

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
            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-3">{"// browse"}</p>
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
