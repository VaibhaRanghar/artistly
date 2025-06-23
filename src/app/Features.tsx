import { CheckCircle } from "lucide-react";
import React from "react";

const features = [
  "Verified professional artists",
  "Secure booking process",
  "Transparent pricing",
  "24/7 customer support",
];

function Features() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Artistly?</h2>
          <p className="text-muted-foreground">
            We make it easy to find and book the perfect artist for your event
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
