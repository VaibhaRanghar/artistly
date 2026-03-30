"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X, Loader2 } from "lucide-react";

const categories = [
  { label: "All",      value: "all"      },
  { label: "Singer",   value: "SINGERS"  },
  { label: "Dancer",   value: "DANCERS"  },
  { label: "DJ",       value: "DJS"      },
  { label: "Speaker",  value: "SPEAKERS" },
  { label: "Musician", value: "MUSICIANS"},
  { label: "Magician", value: "MAGICIANS"},
  { label: "Other",    value: "OTHERS"   },
];

export function FilterSidebar() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isOpen,    setIsOpen]    = useState(false);
  const [category,  setCategory]  = useState(searchParams.get("category") || "all");
  const [minPrice,  setMinPrice]  = useState(searchParams.get("minPrice") || "0");
  const [maxPrice,  setMaxPrice]  = useState(searchParams.get("maxPrice") || "3000");

  const apply = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (category && category !== "all") params.set("category", category); else params.delete("category");
      params.set("minPrice", minPrice);
      params.set("maxPrice", maxPrice);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const reset = () => {
    setCategory("all");
    setMinPrice("0");
    setMaxPrice("3000");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="border-2 border-white/10 bg-[#111] sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <p className="font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#f5e642]" />
          Filters
        </p>
        <button className="md:hidden text-white/40 hover:text-white transition-colors" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        </button>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <div className="p-4 space-y-6">
          {/* Category */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Category</p>
            <div className="flex flex-col gap-1">
              {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`text-left px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors border ${
                    category === c.value
                      ? "border-[#f5e642] bg-[#f5e642]/10 text-[#f5e642]"
                      : "border-transparent text-white/40 hover:text-white hover:border-white/20"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Price Range ($)</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-white/30 mb-1">Min</p>
                <input
                  type="number" value={minPrice} min={0} step={100}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-[#0d0d0d] border-2 border-white/10 text-white px-3 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors"
                />
              </div>
              <div>
                <p className="text-xs text-white/30 mb-1">Max</p>
                <input
                  type="number" value={maxPrice} min={0} step={100}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-[#0d0d0d] border-2 border-white/10 text-white px-3 py-2 text-sm focus:border-[#f5e642] outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            <button onClick={apply} disabled={isPending}
              className="flex justify-center items-center gap-2 w-full py-3 font-black text-sm uppercase tracking-wider bg-[#f5e642] text-black border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors disabled:opacity-50">
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Fetching...</> : "Apply Filters"}
            </button>
            <button onClick={reset} disabled={isPending}
              className="w-full py-3 font-bold text-sm uppercase tracking-wider border-2 border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-colors disabled:opacity-50">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
