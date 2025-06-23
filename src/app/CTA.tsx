import React from "react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Book Your Perfect Artist?
          </h2>
          <p className="text-purple-100 mb-8">
            Join thousands of satisfied customers who found their ideal
            entertainment through Artistly
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            <Link href="/artists">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CTA;
