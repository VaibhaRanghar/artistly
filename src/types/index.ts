export interface Artist {
  id: string
  name: string
  bio: string
  location: string
  city: string
  categories: string[]
  languages: string[]
  feeRange: string
  profileImage?: string
  createdAt: Date
}

export interface FilterState {
  category: string
  location: string
  priceRange: [number, number]
}

export interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
}

export interface ArtistContextType {
  artists: Artist[]
  addArtist: (artist: Omit<Artist, "id" | "createdAt">) => void
  filteredArtists: Artist[]
  filters: FilterState
  updateFilters: (filters: Partial<FilterState>) => void
}
