"use client";

import { useState } from "react";
import { editService, deleteService } from "@/src/lib/actions/user-actions";
import { DollarSign, Clock, Edit2, Trash2, Loader2, X } from "lucide-react";

interface GigProps {
  gig: {
    id: string;
    title: string;
    description: string;
    price: number | string | any;
    category: string;
    deliveryTime: number;
    revisionCount: number;
  };
}

export default function GigManageCard({ gig }: GigProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const numPrice = Number(gig.price);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this gig? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteService(gig.id);
    } catch (err: any) {
      alert("Failed to delete the gig.");
      setIsDeleting(false);
    }
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const res = await editService({
        id: gig.id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        category: formData.get("category") as any,
        deliveryTime: Number(formData.get("deliveryTime")),
        revisionCount: Number(formData.get("revisionCount")),
      });
      if (res.success) setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="border border-white/10 bg-[#111] p-5 hover:border-[#f5e642]/50 transition-colors group relative flex flex-col justify-between">
        
        {/* Absolute Action Buttons (visible on hover) */}
        <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 bg-[#111] pl-2 pb-2">
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-white/50 hover:text-[#f5e642] border border-white/10 hover:border-[#f5e642] transition-colors" title="Edit Gig">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="p-1.5 text-white/50 hover:text-red-500 border border-white/10 hover:border-red-500 transition-colors disabled:opacity-50" title="Delete Gig">
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>

        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-white group-hover:text-[#f5e642] transition-colors leading-tight pr-16 line-clamp-2">
              {gig.title}
            </h3>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 border border-[#ff2a6d]/40 text-[#ff2a6d] w-fit mb-3 block">
            {gig.category}
          </span>
          <p className="text-xs text-white/40 mb-4 line-clamp-3">{gig.description}</p>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-1 text-[#00ffcc] font-black text-sm">
            <DollarSign className="h-3.5 w-3.5" />
            {numPrice.toFixed(0)}
          </div>
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <Clock className="h-3 w-3" />
            {gig.deliveryTime}d delivery
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111] w-full max-w-xl p-8 border-2 border-white/20 relative shadow-[8px_8px_0px_0px_#f5e642] my-8">
            <button onClick={() => setIsEditing(false)} className="absolute right-4 top-4 p-1.5 border border-white/20 text-white/50 hover:border-white hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-black text-white mb-6 uppercase">Edit Gig</h2>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/60">Title</label>
                <input name="title" defaultValue={gig.title} required minLength={5} className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/60">Category</label>
                  <select name="category" defaultValue={gig.category} required className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors">
                    <option value="SINGERS">Singers</option>
                    <option value="DANCERS">Dancers</option>
                    <option value="DJS">DJs</option>
                    <option value="SPEAKERS">Speakers</option>
                    <option value="MUSICIANS">Musicians</option>
                    <option value="MAGICIANS">Magicians</option>
                    <option value="OTHERS">Others</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/60">Price ($)</label>
                  <input name="price" type="number" defaultValue={numPrice} required min="1" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/60">Delivery (Days)</label>
                  <input name="deliveryTime" type="number" defaultValue={gig.deliveryTime} required min="1" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/60">Revisions</label>
                  <input name="revisionCount" type="number" defaultValue={gig.revisionCount || 0} required min="0" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/60">Description</label>
                <textarea name="description" defaultValue={gig.description} required minLength={20} rows={4} className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors resize-none" />
              </div>

              {error && <p className="text-red-500 text-xs font-bold bg-red-500/10 p-2 border border-red-500/20">{error}</p>}

              <button type="submit" disabled={isSaving} className="w-full py-3 mt-4 bg-[#f5e642] text-black font-black uppercase text-sm flex justify-center items-center gap-2 hover:bg-[#ffe31a] disabled:opacity-50">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
