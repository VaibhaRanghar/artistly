import { FilterSidebar } from "@/src/components/filter-sidebar";
import { Suspense } from "react";
import ArtistsLayout from "./ArtistsLayout";
import ArtistsHeader from "./ArtistsHeader";

export default function ArtistListingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          Loading Data...
        </div>
      }>
      <ArtistListingContent />
    </Suspense>
  );
}

function ArtistListingContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <FilterSidebar />
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Find Artists</h1>
            </div>
            <ArtistsHeader />
          </div>

          <ArtistsLayout />
        </div>
      </div>
    </div>
  );
}
