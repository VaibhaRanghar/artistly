"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Slider } from "@/src/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useArtist } from "@/src/contexts/artist-context";
import type { FilterState } from "@/src/types";
import { useSearchParams } from "next/navigation";

const categories = ["Singers", "Dancers", "Speakers", "DJs"];

export function FilterSidebar() {
  const { filters, updateFilters } = useArtist();
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const searchParams = useSearchParams();

  //Filtering Categories if coming from home page.
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setLocalFilters({ ...localFilters, category });
      updateFilters({ ...localFilters, category });
    } else {
      setLocalFilters({ ...localFilters, category: "" });
      updateFilters({ ...localFilters, category: "" });
    }
  }, []);

  const handleApplyFilters = () => {
    updateFilters(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      category: "",
      location: "",
      priceRange: [0, 3000],
    };
    setLocalFilters(resetFilters);
    updateFilters(resetFilters);
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={localFilters.category}
            onValueChange={(value) => {
              value === "All Categories"
                ? setLocalFilters((prev) => ({ ...prev, category: "" }))
                : setLocalFilters((prev) => ({ ...prev, category: value }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter city or state"
            value={localFilters.location}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </div>

        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: value as [number, number],
                }))
              }
              max={3000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${localFilters.priceRange[0]}</span>
            <span>${localFilters.priceRange[1]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
