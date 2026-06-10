import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import Image from "next/image";
import { Mail, User, Star, Music2, ExternalLink } from "lucide-react";
import Link from "next/link";
import EditProfileModal from "./EditProfileModal";
import { getAuthUser, getClerkUser } from "@/src/lib/auth";

export default async function ArtistProfilePage() {
  const [{ dbUser }, user] = await Promise.all([getAuthUser(), getClerkUser()]);
  if (!user || !dbUser?.artistProfile) redirect("/onboarding");

  const profile = dbUser.artistProfile;

  return (
    <DashboardLayout role="ARTIST">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-1">
              {"// my profile"}
            </p>
            <h1 className="text-4xl font-black text-white">PROFILE</h1>
          </div>
          <div className="flex items-center gap-3">
            <EditProfileModal
              initialBio={profile.bio || ""}
              initialLocation={profile.location || profile.city || ""}
              initialLanguages={profile.languages || []}
              initialSkills={profile.skills || []}
            />
            <Link
              href={`/artists/${profile.id}`}
              className="flex items-center gap-2 border-2 border-white/20 text-white/70 px-4 py-2 text-sm font-bold uppercase tracking-wider hover:border-[#f5e642] hover:text-[#f5e642] transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Public View
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Identity */}
          <div className="border-2 border-white/10 bg-[#111] p-8 text-center">
            <div className="relative w-28 h-28 mx-auto mb-5 border-2 border-[#f5e642] overflow-hidden">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || "profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#f5e642]/10 flex items-center justify-center text-5xl font-black text-[#f5e642]">
                  {(user.fullName || "A").charAt(0)}
                </div>
              )}
            </div>
            <h2 className="text-xl font-black text-white mb-1">
              {user.fullName || "Artist"}
            </h2>
            <p className="text-white/40 text-sm font-mono mb-5">
              {user.emailAddresses[0]?.emailAddress}
            </p>
            <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
              <div className="bg-[#111] p-3 text-center">
                <div className="text-xl font-black text-[#f5e642]">
                  {profile.rating.toFixed(1)}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">
                  Rating
                </div>
              </div>
              <div className="bg-[#111] p-3 text-center">
                <div className="text-xl font-black text-[#f5e642]">
                  {profile.reviewCount}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-wider">
                  Reviews
                </div>
              </div>
            </div>
            <p className="text-xs text-white/30 mt-4">
              Profile photo is managed through your Clerk account settings.
            </p>
          </div>

          {/* Right: Details */}
          <div className="md:col-span-2 space-y-5">
            {/* Bio */}
            <div className="border-2 border-white/10 bg-[#111] p-6">
              <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-3">
                {"// Bio"}
              </p>
              {profile.bio ? (
                <p className="text-white/70 leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-white/30 italic">
                  No bio added yet. Complete onboarding to add one.
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="border-2 border-white/10 bg-[#111] p-6">
              <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-4">
                {"// Skills / Categories"}
              </p>
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-black uppercase tracking-wider px-3 py-1.5 border-2 border-[#f5e642] text-[#f5e642]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 italic text-sm">
                  No skills listed.
                </p>
              )}
            </div>

            {/* Account Info */}
            <div className="border-2 border-white/10 bg-[#111] p-6">
              <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-4">
                {"// Account"}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-white/40" />
                  <span className="text-white/70">
                    {user.emailAddresses[0]?.emailAddress}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-white/40" />
                  <span className="text-white/70">{user.fullName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Music2 className="h-4 w-4 text-white/40" />
                  <span className="text-white/70 uppercase tracking-wide">
                    Artist
                  </span>
                </div>
              </div>
              <p className="text-xs text-white/20 mt-4 pt-4 border-t border-white/10">
                To update your name or photo, use the account settings in the
                bottom-left of the sidebar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
