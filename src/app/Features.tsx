import React from "react";
import { Zap, Shield, Star } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "#f5e642",
    title: "INSTANT BOOKING",
    description: "Browse verified artists and make enquiries within minutes. No middlemen, no delays.",
  },
  {
    icon: Shield,
    color: "#ff2a6d",
    title: "SAFE & VERIFIED",
    description: "Every artist is background-checked and rated. Your event is in good hands.",
  },
  {
    icon: Star,
    color: "#00ffcc",
    title: "TRANSPARENT PRICING",
    description: "See fees upfront. No surprises. Artists set their own rates, you choose your budget.",
  },
];

function Features() {
  return (
    <section className="py-24 bg-[#111] border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <p className="text-[#f5e642] font-mono text-sm uppercase tracking-widest mb-3">// why artistly</p>
          <h2 className="text-5xl font-black text-white leading-none">
            THE PLATFORM<br />
            <span style={{ WebkitTextStroke: "2px #f5e642", color: "transparent" }}>BUILT DIFFERENT.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {features.map(({ icon: Icon, color, title, description }) => (
            <div key={title} className="bg-[#111] p-10 group hover:bg-[#161616] transition-colors">
              <div
                className="w-14 h-14 border-2 flex items-center justify-center mb-6"
                style={{ borderColor: color }}
              >
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wide mb-3">{title}</h3>
              <p className="text-white/50 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
