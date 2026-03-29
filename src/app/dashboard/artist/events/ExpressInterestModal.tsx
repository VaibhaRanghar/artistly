"use client";

import { useState } from "react";
import { expressInterest } from "@/src/lib/actions/user-actions";
import { ArrowRight, X, Loader2 } from "lucide-react";
import type { Prisma } from "@prisma/client";

interface Service {
  id: string;
  title: string;
  price: Prisma.Decimal;
}

interface ExpressInterestModalProps {
  eventId: string;
  services: Service[];
  defaultAmount?: number;
}

export default function ExpressInterestModal({ eventId, services, defaultAmount = 0 }: ExpressInterestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);
    
    const formData = new FormData(event.currentTarget);
    
    try {
      const result = await expressInterest({
        eventId,
        serviceId: selectedServiceId,
        amount: Number(formData.get("amount")),
        requirements: formData.get("requirements") as string,
      });
      
      if (result.success) {
        setIsOpen(false);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#f5e642] text-black px-4 py-2 text-xs font-black uppercase tracking-wider border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors"
      >
        Express Interest
        <ArrowRight className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
          <div className="bg-[#111] w-full max-w-lg p-8 border-2 border-white/20 relative shadow-2xl" style={{ boxShadow: "8px 8px 0px 0px #f5e642" }}>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1.5 border border-white/20 text-white/50 hover:border-white hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-[#f5e642] font-mono text-xs uppercase tracking-widest mb-2">// Submit proposal</p>
            <h2 className="text-2xl font-black text-white mb-6">EXPRESS INTEREST</h2>

            {services.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/50 mb-4">You need to create at least one service before applying to events.</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#f5e642] text-black px-6 py-2 font-bold uppercase"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 flex flex-col items-stretch">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Which Service are you offering?</label>
                  <select 
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    required
                    className="w-full bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.title} (${Number(s.price).toFixed(2)})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Your Proposal / Cover Letter</label>
                  <textarea 
                    name="requirements" 
                    placeholder="Why are you a good fit for this event? What will you do?" 
                    required 
                    rows={4}
                    className="w-full bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors resize-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">Your Bid Amount ($)</label>
                  <input 
                    name="amount" 
                    type="number" 
                    step="0.01" 
                    defaultValue={defaultAmount || Number(services.find(s => s.id === selectedServiceId)?.price) || 0}
                    required
                    className="w-full bg-[#0d0d0d] border-2 border-white/10 text-white px-4 py-3 text-sm font-medium focus:border-[#f5e642] outline-none transition-colors" 
                  />
                </div>

                {error && <p className="text-red-500 font-bold text-sm bg-red-500/10 p-3 border border-red-500/20">{error}</p>}

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsOpen(false)}
                    className="px-5 py-3 text-sm font-bold uppercase tracking-wider border-2 border-white/20 text-white hover:border-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isPending}
                    className="flex items-center gap-2 px-5 py-3 text-sm font-black uppercase tracking-wider bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-[#ffe31a] transition-colors disabled:opacity-50">
                    {isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    ) : "Submit Proposal"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
