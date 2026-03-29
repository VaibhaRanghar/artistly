"use client";

import type { Artist } from "@/src/types";
import { Badge } from "@/src/components/ui/badge";
import { MapPin, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/artists/${artist.id}`}>
        <div
          className="border-2 border-white/10 bg-[#111] hover:border-[#f5e642] transition-all duration-200 p-5 flex flex-col gap-4"
          style={{ "--hover-shadow": "4px 4px 0px 0px #f5e642" } as any}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "4px 4px 0px 0px #f5e642")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 flex-shrink-0 border-2 border-white/20 group-hover:border-[#f5e642] transition-colors overflow-hidden">
              {artist.profileImage ? (
                <Image
                  src={artist.profileImage}
                  alt={artist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-[#f5e642]/10 text-[#f5e642] font-black text-xl">
                  {artist.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-white text-base truncate group-hover:text-[#f5e642] transition-colors">
                {artist.name}
              </h3>
              <div className="flex items-center gap-1 text-white/40 text-xs mt-0.5">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{artist.location}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
            {artist.bio}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {(artist.categories || []).slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-[#f5e642]/30 text-[#f5e642]/70"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-1 text-sm font-black text-[#00ffcc]">
              <DollarSign className="h-3.5 w-3.5" />
              {artist.feeRange}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-white/30 group-hover:text-[#f5e642] transition-colors">
              View Profile →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
