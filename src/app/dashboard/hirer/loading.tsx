export default function HirerDashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/10"></div>
          <div className="h-8 w-48 bg-white/20"></div>
        </div>
        <div className="h-10 w-32 bg-white/10"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 border-2 border-white/10 bg-[#111] p-6 space-y-3">
          <div className="h-4 w-20 bg-white/10"></div>
          <div className="h-8 w-32 bg-[#ff2a6d]/20"></div>
        </div>
        <div className="h-32 border-2 border-white/10 bg-[#111] p-6 space-y-3">
          <div className="h-4 w-20 bg-white/10"></div>
          <div className="h-8 w-32 bg-[#ff2a6d]/20"></div>
        </div>
        <div className="h-32 border-2 border-white/10 bg-[#111] p-6 space-y-3">
          <div className="h-4 w-20 bg-white/10"></div>
          <div className="h-8 w-32 bg-[#ff2a6d]/20"></div>
        </div>
      </div>

      <div className="h-64 border-2 border-white/10 bg-[#111] p-6 space-y-4">
        <div className="h-5 w-40 bg-white/20"></div>
        <div className="space-y-2">
          <div className="h-12 w-full bg-white/5"></div>
          <div className="h-12 w-full bg-white/5"></div>
          <div className="h-12 w-full bg-white/5"></div>
        </div>
      </div>
    </div>
  );
}
