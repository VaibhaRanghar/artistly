"use client";

import type { Artist } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { MapPin, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500">
                {artist.profileImage ? (
                  <Image
                    src={artist.profileImage || "/placeholder.svg"}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white font-semibold">
                    {artist.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{artist.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {artist.location}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {artist.bio}
          </p>

          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {artist.categories.map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {artist.feeRange}
              </span>
              <div className="flex flex-wrap gap-1">
                {artist.languages.slice(0, 2).map((language) => (
                  <Badge key={language} variant="outline" className="text-xs">
                    {language}
                  </Badge>
                ))}
                {artist.languages.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{artist.languages.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Ask for Quote
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
