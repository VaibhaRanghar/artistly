"use client";

import { useState } from "react";
import { updateArtistProfile } from "@/src/lib/actions/user-actions";
import { Pencil, X, Loader2 } from "lucide-react";

interface EditProfileModalProps {
  initialBio: string;
  initialLocation: string;
  initialLanguages: string[];
  initialSkills: string[];
}

export default function EditProfileModal({
  initialBio,
  initialLocation,
  initialLanguages,
  initialSkills,
}: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    
    const skillsString = formData.get("skills") as string;
    const languagesString = formData.get("languages") as string;
    
    const skills = skillsString ? skillsString.split(",").map(s => s.trim()).filter(Boolean) : [];
    const languages = languagesString ? languagesString.split(",").map(s => s.trim()).filter(Boolean) : [];

    try {
      const result = await updateArtistProfile({
        bio: formData.get("bio") as string,
        location: formData.get("location") as string,
        skills,
        languages,
      });
      if (result.success) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-transparent text-[#f5e642] px-4 py-2 font-bold uppercase tracking-wider text-sm border-2 border-[#f5e642] hover:bg-[#f5e642] hover:text-black transition-colors"
      >
        <Pencil className="h-4 w-4" />
        Edit Profile
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] w-full max-w-xl p-8 border-2 border-white/20 relative" style={{ boxShadow: "8px 8px 0px 0px #f5e642" }}>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1.5 border border-white/20 text-white/50 hover:border-white hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-2">// settings</p>
            <h2 className="text-2xl font-black text-white mb-6">EDIT PROFILE</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">Bio</label>
                <textarea name="bio" defaultValue={initialBio || ""} placeholder="Tell your story..." rows={4}
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full resize-none" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Location / City</label>
                  <input name="location" defaultValue={initialLocation || ""} placeholder="e.g. New York, NY"
                    className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full" />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Languages (comma separated)</label>
                  <input name="languages" defaultValue={initialLanguages.join(", ")} placeholder="e.g. English, Spanish"
                    className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full" />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">Skills / Categories (comma separated)</label>
                <input name="skills" defaultValue={initialSkills.join(", ")} placeholder="e.g. Guitar, Vocals, DJ"
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full" />
              </div>
             
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-white/20 text-white hover:border-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-black uppercase tracking-wider bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-[#ffe31a] transition-colors disabled:opacity-50">
                  {isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
