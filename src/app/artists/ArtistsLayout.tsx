"use client";

import { motion } from "framer-motion";
import { ArtistCard } from "@/src/components/artist-card";
import { useSearchParams } from "next/navigation";
import type { Artist } from "@/src/types";
import { UsersRound } from "lucide-react";

interface ArtistsLayoutProps {
  artists: Artist[];
}

function ArtistsLayout({ artists }: ArtistsLayoutProps) {
  return (
    <>
      {artists.length === 0 ? (
        <div className="border-2 border-dashed border-white/10 p-16 text-center">
          <UsersRound className="h-12 w-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/30 font-black uppercase tracking-wider text-lg mb-2">No artists found</p>
          <p className="text-white/20 text-sm">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {artists.map((artist, index) => (
            <ArtistCard key={artist.id} artist={artist} index={index} />
          ))}
        </motion.div>
      )}
    </>
  );
}

export default ArtistsLayout;
