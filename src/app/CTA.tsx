import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="py-24 bg-[#0d0d0d] border-t border-white/10">
      <div className="container mx-auto px-4">
        <div
          className="border-2 border-[#f5e642] p-16 text-center relative overflow-hidden"
          style={{ boxShadow: "8px 8px 0px 0px #ff2a6d" }}
        >
          {/* Background accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5e642]/5 rounded-full blur-3xl pointer-events-none" />

          <p className="text-[#f5e642] font-mono text-sm uppercase tracking-widest mb-4">// ready to book?</p>
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-none">
            MAKE YOUR EVENT<br />
            <span className="text-[#ff2a6d]">UNFORGETTABLE.</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
            Join thousands of satisfied customers who found their ideal entertainment through Artistly.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/artists"
              className="inline-flex items-center gap-3 bg-[#f5e642] text-black px-8 py-4 font-black uppercase tracking-wider text-base border-2 border-[#f5e642] hover:bg-transparent hover:text-[#f5e642] transition-colors"
            >
              Find Artists
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-3 bg-transparent text-white px-8 py-4 font-black uppercase tracking-wider text-base border-2 border-white/30 hover:border-white transition-colors"
            >
              Become an Artist
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
