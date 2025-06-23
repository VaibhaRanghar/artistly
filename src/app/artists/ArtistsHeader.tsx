"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Grid, List } from "lucide-react";
import { Button } from "@/src/components/ui/button";

function ArtistsHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );

  // Update the URL whenever viewMode changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", viewMode);
    router.replace(`?${params.toString()}`);
  }, [viewMode, router, searchParams]);

  return (
    <div className="hidden sm:flex items-center space-x-2">
      <Button
        variant={viewMode === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("grid")}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "list" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewMode("list")}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default ArtistsHeader;
