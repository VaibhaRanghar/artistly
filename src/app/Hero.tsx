import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

function Hero() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-6">
            <Star className="h-4 w-4 mr-2 text-yellow-500" />
            Trusted by 10,000+ event organizers
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            Book Professional{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Artists
            </span>{" "}
            for Your Events
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with talented singers, dancers, speakers, and DJs. Make your
            next event unforgettable with verified professional artists.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/artists">
                Find Artists
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8"
            >
              <Link href="/onboarding">Join as Artist</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
