import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Star, Zap, Music2 } from "lucide-react";

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#0d0d0d] overflow-hidden">
      {/* Background grid lines */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#f5e642]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#ff2a6d]/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border-2 border-[#f5e642] px-4 py-2 mb-8">
            <Star className="h-4 w-4 text-[#f5e642] fill-current" />
            <span className="text-sm font-bold text-[#f5e642] uppercase tracking-widest">
              Trusted by 10,000+ event organizers
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl lg:text-8xl font-black tracking-tight mb-8 leading-none">
            <span className="block text-white">BOOK WORLD-CLASS</span>
            <span className="block" style={{ 
              WebkitTextStroke: "2px #f5e642",
              color: "transparent"
            }}>
              ARTISTS.
            </span>
            <span className="block text-[#ff2a6d]">EVERY EVENT.</span>
          </h1>

          <p className="text-xl text-white/60 mb-12 max-w-2xl font-medium leading-relaxed">
            Connect with verified singers, dancers, speakers, and DJs.
            <br />
            Professional artist booking — <span className="text-white font-bold">brutally simple.</span>
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/artists"
              className="inline-flex items-center gap-3 bg-[#f5e642] text-black px-8 py-4 font-black uppercase tracking-wider text-lg border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors"
              style={{ boxShadow: "6px 6px 0px 0px #ff2a6d" }}
            >
              Find Artists
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-3 bg-transparent text-white px-8 py-4 font-black uppercase tracking-wider text-lg border-2 border-white/30 hover:border-white transition-colors"
            >
              <Zap className="h-5 w-5" />
              Join as Artist
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px bg-white/10 mt-16 border border-white/10 max-w-2xl">
            {[
              { value: "2,400+", label: "Artists" },
              { value: "10K+", label: "Bookings" },
              { value: "4.9★", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0d0d0d] p-6 text-center">
                <div className="text-3xl font-black text-[#f5e642] mb-1">{stat.value}</div>
                <div className="text-sm text-white/50 uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
