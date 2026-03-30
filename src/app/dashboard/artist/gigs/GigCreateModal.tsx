"use client";

import { useState } from "react";
import { createGig } from "@/src/lib/actions/user-actions";
import { Plus, X } from "lucide-react";

export default function GigCreateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = await createGig({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        category: formData.get("category") as any,
        deliveryTime: Number(formData.get("deliveryTime")),
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
        className="flex items-center gap-2 bg-[#f5e642] text-black px-5 py-3 font-black uppercase tracking-wider text-sm border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors"
        style={{ boxShadow: "4px 4px 0px 0px #ff2a6d" }}
      >
        <Plus className="h-4 w-4" />
        Create New Gig
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div
            className="bg-[#111] w-full max-w-lg p-8 border-2 border-white/20 relative"
            style={{ boxShadow: "8px 8px 0px 0px #f5e642" }}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1.5 border border-white/20 text-white/50 hover:border-white hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-2">
              {"// new service"}
            </p>
            <h2 className="text-2xl font-black text-white mb-6">CREATE GIG</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Gig Title
                </label>
                <input
                  name="title"
                  placeholder="e.g. Professional Jazz Performance"
                  required
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe what you offer..."
                  required
                  rows={3}
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Price ($)
                  </label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Delivery (Days)
                  </label>
                  <input
                    name="deliveryTime"
                    type="number"
                    required
                    className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors w-full"
                >
                  <option value="">Select Category</option>
                  <option value="SINGERS">Singer</option>
                  <option value="DANCERS">Dancer</option>
                  <option value="DJS">DJ</option>
                  <option value="SPEAKERS">Speaker</option>
                  <option value="MUSICIANS">Musician</option>
                  <option value="MAGICIANS">Magician</option>
                  <option value="OTHERS">Other</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-white/20 text-white hover:border-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-3 text-sm font-black uppercase tracking-wider bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Save Gig"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
