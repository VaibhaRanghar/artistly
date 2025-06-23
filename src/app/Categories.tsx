import React from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Mic, Music, Users, Volume2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

const categories = [
  {
    title: "Singers",
    description: "Professional vocalists for all genres and events",
    icon: Mic,
    count: "500+",
    href: "/artists?category=Singers",
  },
  {
    title: "Dancers",
    description: "Choreographers and performers for any style",
    icon: Users,
    count: "300+",
    href: "/artists?category=Dancers",
  },
  {
    title: "Speakers",
    description: "Motivational and keynote speakers",
    icon: Volume2,
    count: "200+",
    href: "/artists?category=Speakers",
  },
  {
    title: "DJs",
    description: "Professional DJs for parties and events",
    icon: Music,
    count: "400+",
    href: "/artists?category=DJs",
  },
];

function Categories() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground">
            Find the perfect artist for your event from our diverse categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-primary mb-4">
                    {category.count}
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Link href={category.href}>Browse {category.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
