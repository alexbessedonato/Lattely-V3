import { Star } from "lucide-react";
import { getMember } from "@/lib/auth/auth-server";
import { getMemberRating } from "@/lib/rating/member-rating";
import { rateShopAction } from "@/lib/rating/rate-shop-action";
import { cn } from "cn";

// The "How was your cup?" card: five star buttons and the Member's current Rating.
// It reads the session cookie, so the page shows it inside <Suspense>.
export async function RateShop({ shopId }: { shopId: number }) {
  const member = await getMember();
  const given = member ? await getMemberRating(member, shopId) : null;

  return (
    <section
      aria-label="Your rating"
      className="mx-1 mt-6 flex flex-col gap-3 rounded-3xl border border-latte bg-paper px-5 py-5.5"
    >
      <h2 className="font-heading text-[22px] font-semibold">
        How was your cup?
      </h2>

      {/* Each star is a submit button carrying its number, so this works without any browser JavaScript. */}
      <form
        action={rateShopAction.bind(null, shopId)}
        role="group"
        aria-label="Rate this shop from 1 to 5 stars"
        className="flex gap-1"
      >
        {[1, 2, 3, 4, 5].map((stars) => (
          <button
            key={stars}
            type="submit"
            name="stars"
            value={stars}
            aria-label={`${stars} ${stars === 1 ? "star" : "stars"}`}
            aria-pressed={stars === given}
            className="flex size-13 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Star
              aria-hidden
              strokeWidth={1.5}
              className={cn(
                "size-9 text-clay",
                given !== null && stars <= given && "fill-clay",
              )}
            />
          </button>
        ))}
      </form>

      <p className="text-sm text-mocha">
        {given === null
          ? "Tap a star to rate it."
          : `You gave it ${given} ${given === 1 ? "star" : "stars"}. Changed your mind? Tap again.`}
      </p>
    </section>
  );
}
