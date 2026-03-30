import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/10 border-t-[#f5e642] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-[#ff2a6d] font-black">
          A
        </div>
      </div>
      <p className="text-white/40 font-mono text-xs uppercase tracking-widest animate-pulse mt-4">
        FETCHING DASHBOARD DATA...
      </p>
    </div>
  );
}
