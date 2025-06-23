import type { Metadata } from "next";
import Hero from "./Hero";
import Features from "./Features";
import Categories from "./Categories";
import CTA from "./CTA";

export const metadata: Metadata = {
  title: "Artistly - Professional Artist Booking Platform",
  description:
    "Book talented singers, dancers, speakers, and DJs for your events. Connect with professional artists and make your event unforgettable.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Categories />
      <CTA />
    </div>
  );
}
