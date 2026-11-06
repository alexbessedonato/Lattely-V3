import { rateShopCard } from "@/components/rate-shop";
import { Skeleton } from "@/components/ui/skeleton";

// Stands in for <RateShop> while it loads: same card, same sizes, so nothing moves when it arrives.
export function RateShopSkeleton() {
  return (
    <div aria-hidden className={rateShopCard}>
      {/* "How was your cup?" */}
      <Skeleton className="h-8.25 w-48" />

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Skeleton key={star} className="size-13 rounded-full" />
        ))}
      </div>

      {/* "Tap a star to rate it." */}
      <Skeleton className="h-5 w-40" />
    </div>
  );
}
