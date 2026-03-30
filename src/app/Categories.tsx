import React from "react";
import { Mic2, Music, Users, Star, Wand2, Radio, Headphones } from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: Mic2,      label: "Singers",   color: "#f5e642", count: "340+" },
  { icon: Music,     label: "Dancers",   color: "#ff2a6d", count: "210+" },
  { icon: Radio,     label: "DJs",       color: "#00ffcc", count: "180+" },
  { icon: Users,     label: "Speakers",  color: "#f5e642", count: "290+" },
  { icon: Headphones,label: "Musicians", color: "#ff2a6d", count: "420+" },
  { icon: Wand2,     label: "Magicians", color: "#00ffcc", count: "90+"  },
];

function Categories() {
  return (
    <section className="py-24 bg-[#0d0d0d] border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-[#f5e642] font-mono text-sm uppercase tracking-widest mb-3">{"// 06 categories"}</p>
            <h2 className="text-5xl font-black text-white leading-none">
              BROWSE BY<br />
              <span className="text-[#ff2a6d]">TALENT</span>
            </h2>
          </div>
          <Link href="/artists" className="hidden md:inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white/50 hover:text-[#f5e642] transition-colors border border-white/20 px-4 py-2 hover:border-[#f5e642]">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {categories.map(({ icon: Icon, label, color, count }) => (
            <Link
              key={label}
              href={`/artists?category=${label.toUpperCase()}`}
              className="group relative bg-[#111] p-8 flex flex-col gap-4 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              <div
                className="w-12 h-12 border-2 flex items-center justify-center transition-all group-hover:scale-110"
                style={{ borderColor: color }}
              >
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-wide">{label}</h3>
                <p className="text-sm text-white/40 font-mono">{count} artists</p>
              </div>
              <div
                className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: color }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
