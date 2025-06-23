"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import type { Artist, ArtistContextType, FilterState } from "@/src/types";
import { mockArtists } from "@/src/lib/mock-data";

const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export function ArtistProvider({ children }: { children: React.ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>(mockArtists);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    location: "",
    priceRange: [0, 3000],
  });

  const addArtist = (artistData: Omit<Artist, "id" | "createdAt">) => {
    const newArtist: Artist = {
      ...artistData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setArtists((prev) => [...prev, newArtist]);
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredArtists: Artist[] = artists.filter((artist) => {
    const categoryMatch =
      !filters.category || artist.categories.includes(filters.category);
    const locationMatch =
      !filters.location ||
      artist.location.toLowerCase().includes(filters.location.toLowerCase());

    // Extract price range from fee string
    const feeMatch = artist.feeRange.match(/\$(\d+)-(\d+)/);
    const minFee = feeMatch ? Number.parseInt(feeMatch[1]) : 0;
    const maxFee = feeMatch ? Number.parseInt(feeMatch[2]) : 3000;

    const priceMatch =
      minFee >= filters.priceRange[0] && maxFee <= filters.priceRange[1];

    return categoryMatch && locationMatch && priceMatch;
  });

  return (
    <ArtistContext.Provider
      value={{
        artists,
        addArtist,
        filteredArtists,
        filters,
        updateFilters,
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
}

export function useArtist() {
  const context = useContext(ArtistContext);
  if (context === undefined) {
    throw new Error("useArtist must be used within an ArtistProvider");
  }
  return context;
}
