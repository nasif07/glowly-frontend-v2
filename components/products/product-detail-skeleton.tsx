import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder mirroring the product detail layout. */
export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-12">
          {/* IMAGE SECTION */}
          <div className="space-y-6">
            <Skeleton className="rounded-[2.5rem] aspect-square w-full" />
            <div className="flex gap-4 px-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-1/5 rounded-2xl" />
              ))}
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="flex flex-col">
            <div className="mb-6 space-y-4">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-8 w-3/4 rounded" />
              <Skeleton className="h-8 w-1/3 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="p-4 rounded-2xl border border-[#E8D8C3]/40 shadow-none gap-2">
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </Card>
              <Card className="p-4 rounded-2xl border border-[#E8D8C3]/40 shadow-none gap-2">
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </Card>
            </div>

            <div className="mb-4 space-y-3">
              <Skeleton className="h-4 w-40 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
            </div>

            <div className="hidden lg:flex gap-4 mt-4">
              <Skeleton className="h-14 flex-1 rounded-2xl" />
              <Skeleton className="h-14 flex-1 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
