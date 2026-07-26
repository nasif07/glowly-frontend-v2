import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder that matches the ProductCard footprint. */
export default function ProductCardSkeleton() {
  return (
    <Card className="rounded p-1.5 md:p-3 border border-stone-200 shadow-none gap-0">
      <Skeleton className="aspect-[4/5] w-full rounded bg-[#300332]/5" />
      <div className="mt-2 px-1 space-y-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-[#300332]/5"
            />
          ))}
        </div>
        <Skeleton className="h-5 w-3/4 rounded bg-[#300332]/5" />
        <Skeleton className="h-6 w-1/3 rounded bg-[#300332]/5" />
      </div>
    </Card>
  );
}
