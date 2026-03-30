"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/src/lib/actions/user-actions";
import { Loader2, Check, X, Trash2 } from "lucide-react";

interface HirerOrderActionsProps {
  orderId: string;
  status: string;
  isEventApplication: boolean;
}

export default function HirerOrderActions({
  orderId,
  status,
  isEventApplication,
}: HirerOrderActionsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (
    newStatus:
      | "ACCEPTED"
      | "IN_PROGRESS"
      | "DELIVERED"
      | "COMPLETED"
      | "CANCELLED"
      | "REJECTED",
  ) => {
    setIsPending(true);
    try {
      await updateOrderStatus({
        orderId,
        status: newStatus,
      });
      // Component will remount with new status from server
    } catch (error) {
      console.error(error);
      setIsPending(false);
    } finally {
      setIsPending(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 text-white/50 bg-black/50 text-xs font-black uppercase">
        <Loader2 className="h-3 w-3 animate-spin" /> Processing...
      </div>
    );
  }

  // EVENT APPLICATION LOGIC
  if (isEventApplication) {
    if (status === "PENDING") {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate("REJECTED")}
            className="flex items-center gap-1 px-3 py-1.5 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs font-bold uppercase"
          >
            <X className="h-3 w-3" /> Reject
          </button>
          <button
            onClick={() => handleUpdate("ACCEPTED")}
            className="flex items-center gap-1 px-4 py-1.5 bg-[#f5e642] text-black hover:bg-[#ffe31a] transition-colors text-xs font-black uppercase"
          >
            <Check className="h-3 w-3" /> Accept Artist
          </button>
        </div>
      );
    }
  } else {
    // DIRECT BOOKING LOGIC
    if (status === "PENDING") {
      return (
        <button
          onClick={() => handleUpdate("CANCELLED")}
          className="flex items-center gap-1 px-3 py-1.5 border border-white/20 text-white/50 hover:border-red-500 hover:text-red-500 transition-colors text-xs font-bold uppercase"
        >
          <X className="h-3 w-3" /> Cancel Request
        </button>
      );
    }
  }

  // COMMON LOGIC
  if (status === "DELIVERED") {
    return (
      <button
        onClick={() => handleUpdate("COMPLETED")}
        className="flex items-center gap-2 px-4 py-2 bg-[#00ffcc] text-black hover:bg-transparent hover:text-[#00ffcc] border-2 border-[#00ffcc] transition-colors text-xs font-black uppercase"
      >
        <Check className="h-4 w-4" /> Approve & Complete
      </button>
    );
  }

  if (status === "CANCELLED" || status === "COMPLETED") {
    return (
      <button
        onClick={async () => {
          // In a real app we might delete it, here we just show a visual cue or maybe we hide it via soft-delete.
          // For MVP, we can just allow them to 'Archived' it, but Prisma schema doesn't have Archive.
          // Let's implement real DELETE in a custom action if we need to.
          alert("Delete functionality coming soon!"); // Placeholder for actual delete
        }}
        className="flex items-center gap-1 px-3 py-1 border border-white/10 text-white/30 hover:text-red-500 hover:border-red-500/50 transition-colors text-[10px] font-bold uppercase"
      >
        <Trash2 className="h-3 w-3" /> Remove
      </button>
    );
  }

  if (status === "IN_PROGRESS" || status === "ACCEPTED") {
    return (
      <span className="px-3 py-1.5 border border-white/10 text-white/40 bg-black/20 text-xs font-bold uppercase">
        Awaiting Delivery
      </span>
    );
  }

  return null;
}
