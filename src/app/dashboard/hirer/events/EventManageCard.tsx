"use client";

import { useState } from "react";
import { editEvent, deleteEvent } from "@/src/lib/actions/user-actions";
import { Calendar, MapPin, DollarSign, Edit2, Trash2, Loader2, X } from "lucide-react";

interface EventProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    budget: any;
    status: string;
    _count: { orders: number };
  };
}

const statusColor: Record<string, string> = {
  OPEN: "#00ffcc",
  IN_PROGRESS: "#f5e642",
  COMPLETED: "#888",
  CANCELLED: "#ff2a6d",
};

export default function EventManageCard({ event }: EventProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const numBudget = event.budget ? Number(event.budget) : undefined;
  const color = statusColor[event.status] || "#888";
  
  // Format date for the input field (YYYY-MM-DD)
  const dateObj = new Date(event.date);
  const dateString = dateObj.toISOString().split("T")[0];

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteEvent(event.id);
    } catch (err: any) {
      alert("Failed to delete the event.");
      setIsDeleting(false);
    }
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      const bStr = formData.get("budget");
      const res = await editEvent({
        id: event.id,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        location: formData.get("location") as string,
        date: formData.get("date") as string,
        budget: bStr ? Number(bStr) : undefined,
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
      <div className="border-2 border-white/10 bg-[#111] p-6 hover:border-[#ff2a6d] transition-colors group relative flex flex-col justify-between">
        
        {/* Absolute Action Buttons (visible on hover) */}
        <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-2 bg-[#111] pl-2 pb-2 z-10">
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-white/50 hover:text-[#f5e642] border border-white/10 hover:border-[#f5e642] transition-colors" title="Edit Event">
            <Edit2 className="h-4 w-4" />
          </button>
          <button onClick={handleDelete} disabled={isDeleting} className="p-1.5 text-white/50 hover:text-red-500 border border-white/10 hover:border-red-500 transition-colors disabled:opacity-50" title="Delete Event">
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex-1 min-w-0 pr-16 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 border"
              style={{ borderColor: color + "60", color }}>
              {event.status}
            </span>
            <span className="text-xs text-white/30 font-mono">{event._count.orders} proposals</span>
          </div>
          <h3 className="text-xl font-black text-white group-hover:text-[#ff2a6d] transition-colors mb-2">{event.title}</h3>
          <p className="text-white/50 text-sm line-clamp-2">{event.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {event.location}
          </div>
          {numBudget && (
            <div className="flex items-center gap-1 text-[#00ffcc] font-bold">
              <DollarSign className="h-3 w-3" />
              ${numBudget.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111] w-full max-w-xl p-8 border-2 border-white/20 relative shadow-[8px_8px_0px_0px_#ff2a6d] my-8">
            <button onClick={() => setIsEditing(false)} className="absolute right-4 top-4 p-1.5 border border-white/20 text-white/50 hover:border-white hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-black text-white mb-6 uppercase">Edit Event</h2>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/60">Event Title</label>
                <input name="title" defaultValue={event.title} required minLength={5} className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#ff2a6d] outline-none transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/60">Date</label>
                  <input name="date" type="date" defaultValue={dateString} required min={new Date().toISOString().split("T")[0]} className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#ff2a6d] outline-none transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-white/60">Budget ($) (Optional)</label>
                  <input name="budget" type="number" defaultValue={numBudget} min="1" className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#ff2a6d] outline-none transition-colors" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/60">Location</label>
                <input name="location" defaultValue={event.location} required className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#ff2a6d] outline-none transition-colors" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-white/60">Description</label>
                <textarea name="description" defaultValue={event.description} required minLength={20} rows={4} className="w-full bg-[#0d0d0d] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#ff2a6d] outline-none transition-colors resize-none" />
              </div>

              {error && <p className="text-red-500 text-xs font-bold bg-red-500/10 p-2 border border-red-500/20">{error}</p>}

              <button type="submit" disabled={isSaving} className="w-full py-3 mt-4 bg-[#ff2a6d] text-white font-black uppercase text-sm flex justify-center items-center gap-2 hover:bg-[#ff1a5d] disabled:opacity-50">
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
