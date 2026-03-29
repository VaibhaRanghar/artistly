"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Artist, ArtistContextType, FilterState } from "@/src/types"

const ArtistContext = createContext<ArtistContextType | undefined>(undefined)

const initialArtists: Artist[] = [
  {
    id: "1",
    name: "Alex River",
    bio: "Soulful singer with over 10 years of experience in jazz and blues.",
    location: "New York, NY",
    city: "New York",
    categories: ["SINGERS"],
    languages: ["English", "Spanish"],
    feeRange: "$500-800",
    profileImage: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200&h=200",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Elena Rodriguez",
    bio: "Professional flamenco dancer performing at world-class venues.",
    location: "Madrid, Spain",
    city: "Madrid",
    categories: ["DANCERS"],
    languages: ["Spanish", "English"],
    feeRange: "$800-1200",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Marcus Chen",
    bio: "Classical violinist with a modern twist. Available for weddings and corporate events.",
    location: "San Francisco, CA",
    city: "San Francisco",
    categories: ["MUSICIANS"],
    languages: ["English", "Mandarin"],
    feeRange: "$300-500",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
    createdAt: new Date(),
  },
]

export function ArtistProvider({ children }: { children: React.ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    location: "",
    priceRange: [0, 5000],
  })

  // In a real app, this might fetch from an API
  // For now, we use the initial mock data

  const addArtist = (newArtist: Omit<Artist, "id" | "createdAt">) => {
    const artist: Artist = {
      ...newArtist,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    }
    setArtists((prev) => [artist, ...prev])
  }

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const filteredArtists = artists.filter((artist) => {
    const categoryMatch = filters.category === "all" || artist.categories.includes(filters.category.toUpperCase())
    const locationMatch = !filters.location || artist.location.toLowerCase().includes(filters.location.toLowerCase())
    
    // Simple price range check - extracting the first number from feeRange string
    const priceStr = artist.feeRange.replace(/[^0-9]/g, "")
    const price = parseInt(priceStr) || 0
    const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1]

    return categoryMatch && locationMatch && priceMatch
  })

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
  )
}

export function useArtist() {
  const context = useContext(ArtistContext)
  if (context === undefined) {
    throw new Error("useArtist must be used within an ArtistProvider")
  }
  return context
}
