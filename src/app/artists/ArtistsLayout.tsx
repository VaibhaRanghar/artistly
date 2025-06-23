"use client";

import { motion } from "framer-motion";
import { ArtistCard } from "@/src/components/artist-card";
import { useSearchParams } from "next/navigation";
import { useArtist } from "@/src/contexts/artist-context";

function ArtistsLayout() {
  const { filteredArtists } = useArtist();
  const searchParams = useSearchParams();
  const viewMode = (searchParams.get("view") as "grid" | "list") || "grid";

  return (
    <>
      {filteredArtists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No artists found matching your criteria.
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredArtists.map((artist, index) => (
            <ArtistCard key={artist.id} artist={artist} index={index} />
          ))}
        </motion.div>
      )}
    </>
  );
}

export default ArtistsLayout;
