"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/src/lib/actions/user-actions";
import { Loader2, Check, X, ArrowRight, PackageCheck } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  status: string;
  isEventApplication: boolean;
}

export default function OrderActions({ orderId, status, isEventApplication }: OrderActionsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleUpdate = async (newStatus: "ACCEPTED" | "IN_PROGRESS" | "DELIVERED" | "COMPLETED" | "CANCELLED" | "REJECTED") => {
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
      <button disabled className="flex items-center gap-2 px-4 py-2 border-2 border-white/10 text-white/50 bg-black/50 text-xs font-black uppercase">
        <Loader2 className="h-4 w-4 animate-spin" /> Processing...
      </button>
    );
  }

  // EVENT APPLICATION LOGIC
  if (isEventApplication) {
    if (status === "PENDING") {
      return (
        <>
          <span className="text-white/40 text-xs italic mb-2 block">Awaiting Hirer Decision</span>
          <button 
            onClick={() => handleUpdate("CANCELLED")}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white/60 hover:border-red-500 hover:text-red-500 transition-colors text-xs font-bold uppercase"
          >
            <X className="h-3 w-3" /> Withdraw Proposal
          </button>
        </>
      );
    }
    // If accepted by hirer, order goes to IN_PROGRESS. Artist works on it.
    if (status === "IN_PROGRESS") {
      return (
        <button 
          onClick={() => handleUpdate("DELIVERED")}
          className="flex items-center gap-2 px-4 py-2 bg-[#00ffcc] text-black hover:bg-transparent hover:text-[#00ffcc] border-2 border-[#00ffcc] transition-colors text-xs font-black uppercase shadow-[4px_4px_0px_0px_#f5e642]"
        >
          <PackageCheck className="h-4 w-4" /> Mark Delivered
        </button>
      );
    }
    if (status === "DELIVERED") {
      return <span className="text-[#00ffcc] text-xs font-bold uppercase">Awaiting Hirer Review</span>;
    }
    return null;
  }

  // DIRECT BOOKING LOGIC
  if (status === "PENDING") {
    return (
      <div className="flex gap-2">
        <button 
          onClick={() => handleUpdate("REJECTED")}
          className="flex items-center gap-1 px-3 py-2 border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs font-bold uppercase"
        >
          <X className="h-3 w-3" /> Reject
        </button>
        <button 
          onClick={() => handleUpdate("ACCEPTED")}
          className="flex items-center gap-1 px-4 py-2 bg-[#f5e642] text-black hover:bg-transparent hover:text-[#f5e642] border-2 border-[#f5e642] transition-colors text-xs font-black uppercase shadow-[3px_3px_0px_0px_#00ffcc]"
        >
          <Check className="h-3 w-3" /> Accept
        </button>
      </div>
    );
  }

  if (status === "ACCEPTED" || status === "IN_PROGRESS") {
    return (
      <button 
        onClick={() => handleUpdate("DELIVERED")}
        className="flex items-center gap-2 px-4 py-2 bg-[#00ffcc] text-black hover:bg-transparent hover:text-[#00ffcc] border-2 border-[#00ffcc] transition-colors text-xs font-black uppercase shadow-[4px_4px_0px_0px_#f5e642]"
      >
        <PackageCheck className="h-4 w-4" /> Deliver Work
      </button>
    );
  }

  if (status === "DELIVERED") {
    return <span className="text-[#00ffcc] text-xs font-bold uppercase">Work Delivered</span>;
  }

  return null;
}
