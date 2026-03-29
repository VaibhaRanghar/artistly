"use client";

import { useState } from "react";
import { createEvent } from "@/src/lib/actions/user-actions";
import { Plus, X } from "lucide-react";

export default function EventCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = await createEvent({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        date: new Date(formData.get("date") as string),
        location: formData.get("location") as string,
        budget: Number(formData.get("budget")) || undefined,
      });
      if (result.success) {
        setIsOpen(false);
        window.location.reload();
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
        className="flex items-center gap-2 bg-[#ff2a6d] text-white px-5 py-3 font-black uppercase tracking-wider text-sm border-2 border-[#ff2a6d] hover:bg-transparent hover:text-[#ff2a6d] transition-colors"
        style={{ boxShadow: "4px 4px 0px 0px #f5e642" }}
      >
        <Plus className="h-4 w-4" />
        Post New Event
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] w-full max-w-lg p-8 border-2 border-white/20 relative max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: "8px 8px 0px 0px #ff2a6d" }}>
            <button onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1.5 border border-white/20 text-white/50 hover:border-white hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>

            <p className="text-[#ff2a6d] font-mono text-xs uppercase tracking-widest mb-2">// post event</p>
            <h2 className="text-2xl font-black text-white mb-6">POST NEW EVENT</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">Event Name</label>
                <input name="title" placeholder="e.g. Summer Music Festival 2026" required
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#ff2a6d] outline-none transition-colors w-full" />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">Description</label>
                <textarea name="description" placeholder="Describe event and artist requirements..." required rows={3}
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#ff2a6d] outline-none transition-colors w-full resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Date</label>
                  <input name="date" type="date" required
                    className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#ff2a6d] outline-none transition-colors w-full" />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Budget ($)</label>
                  <input name="budget" type="number" placeholder="Optional"
                    className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#ff2a6d] outline-none transition-colors w-full" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">Location</label>
                <input name="location" placeholder="e.g. New York, NY" required
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#ff2a6d] outline-none transition-colors w-full" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)}
                  className="px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-white/20 text-white hover:border-white transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending}
                  className="px-5 py-3 text-sm font-black uppercase tracking-wider bg-[#ff2a6d] text-white border-2 border-[#ff2a6d] hover:bg-transparent hover:text-[#ff2a6d] transition-colors disabled:opacity-50">
                  {isPending ? "Posting..." : "Post Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
