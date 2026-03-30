import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="h-12 w-12 text-[#f5e642] animate-spin" />
      <p className="text-[#f5e642] font-mono text-sm uppercase tracking-widest animate-pulse">
        {"LOADING // PLEASE WAIT..."}
      </p>
    </div>
  );
}
