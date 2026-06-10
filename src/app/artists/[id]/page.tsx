import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Star,
  DollarSign,
  Clock,
  ArrowLeft,
  Mic2,
  MessageCircle,
} from "lucide-react";
import { BookNowModal } from "@/src/components/book-now-modal";

// Cache individual artist pages for 60 seconds
export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ArtistDetailPage({ params }: Props) {
  const { id } = await params;

  const profile = await prisma.artistProfile.findUnique({
    where: { id },
    include: {
      user: true,
      services: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!profile) notFound();

  // Fix Decimal serialization
  const serializedProfile = {
    ...profile,
    services: profile.services.map((s) => ({
      ...s,
      price: Number(s.price),
    })),
  };

  const artist = serializedProfile.user;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Back bar */}
      <div className="border-b border-white/10 bg-[#0d0d0d] sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center">
          <Link
            href="/artists"
            className="flex items-center gap-2 text-white/50 hover:text-[#f5e642] transition-colors text-sm font-bold uppercase tracking-wide"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Artists
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Profile */}
          <div className="lg:col-span-1">
            <div className="border-2 border-white/10 bg-[#111] p-8 sticky top-20">
              {/* Avatar */}
              <div className="relative w-28 h-28 mx-auto mb-6 border-2 border-[#f5e642] overflow-hidden">
                {artist.imageUrl ? (
                  <Image
                    src={artist.imageUrl}
                    alt={artist.fullName || "Artist"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f5e642]/10 flex items-center justify-center text-5xl font-black text-[#f5e642]">
                    {(artist.fullName || "A").charAt(0)}
                  </div>
                )}
              </div>

              <h1 className="text-2xl font-black text-white text-center mb-2">
                {artist.fullName || "Artist"}
              </h1>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {serializedProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 border border-[#f5e642]/40 text-[#f5e642]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mb-6">
                <div className="bg-[#111] p-4 text-center">
                  <div className="text-2xl font-black text-[#f5e642]">
                    {serializedProfile.rating.toFixed(1)}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider flex items-center justify-center gap-1 mt-1">
                    <Star className="h-3 w-3" /> Rating
                  </div>
                </div>
                <div className="bg-[#111] p-4 text-center">
                  <div className="text-2xl font-black text-[#f5e642]">
                    {serializedProfile.reviewCount}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
                    Reviews
                  </div>
                </div>
                <div className="bg-[#111] p-4 text-center col-span-2">
                  <div className="text-2xl font-black text-[#00ffcc]">
                    {serializedProfile.services.length}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
                    Services
                  </div>
                </div>
              </div>

              {/* Action */}
              <BookNowModal
                artistId={serializedProfile.id}
                artistName={artist.fullName || "Artist"}
                services={serializedProfile.services}
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {serializedProfile.bio && (
              <div>
                <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-4">
                  {"// About"}
                </p>
                <div className="border-2 border-white/10 bg-[#111] p-8">
                  <p className="text-white/70 leading-relaxed text-lg">
                    {serializedProfile.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Services / Gigs */}
            {serializedProfile.services.length > 0 && (
              <div>
                <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-4">
                  {"// Services Offered"}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {serializedProfile.services.map((service) => (
                    <div
                      key={service.id}
                      className="border-2 border-white/10 bg-[#111] p-6 hover:border-[#f5e642] transition-colors group"
                    >
                      <h3 className="font-black text-white mb-2 group-hover:text-[#f5e642] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-white/40 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[#00ffcc] font-black">
                          <DollarSign className="h-4 w-4" />
                          {service.price.toFixed(0)}
                        </div>
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <Clock className="h-3 w-3" />
                          {service.deliveryTime}d delivery
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className="text-xs font-bold uppercase px-2 py-0.5 border border-[#ff2a6d]/30 text-[#ff2a6d]/70">
                          {service.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.services.length === 0 && (
              <div className="border-2 border-dashed border-white/10 p-12 text-center">
                <Mic2 className="h-12 w-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/30 font-bold uppercase tracking-wide">
                  No services listed yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
