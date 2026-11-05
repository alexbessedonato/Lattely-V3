import { MapPin, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Account } from "@/components/account";
import { BackToRanking } from "@/components/back-to-ranking";
import { buttonVariants } from "@/components/ui/button";
import { fallbackImage } from "@/lib/fallback-image";
import { getShop } from "@/lib/shop";
import { cn } from "@/lib/utils";

export default function ShopPage({ params }: PageProps<"/shops/[slug]">) {
  return (
    <main className="mx-auto w-full max-w-md px-4 pb-10">
      <header className="flex h-16 items-center justify-between">
        <BackToRanking />

        <Suspense fallback={<div className="size-11" />}>
          <Account />
        </Suspense>
      </header>

      <Suspense fallback={<p>Loading the Shop…</p>}>
        <ShopDetail params={params} />
      </Suspense>
    </main>
  );
}

// The slug is only known when someone visits, so this part loads on every visit, inside the Suspense above.
async function ShopDetail({
  params,
}: {
  params: PageProps<"/shops/[slug]">["params"];
}) {
  const shop = await getShop((await params).slug);
  if (!shop) notFound();

  // Addresses are stored without the city, and Lattely is Barcelona only (ADR-0001).
  const fullAddress = `${shop.address}, Barcelona`;

  return (
    <>
      <div className="relative mt-1 h-70 overflow-hidden rounded-[28px]">
        <Image
          src={fallbackImage(shop.id)}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      <section className="flex flex-col gap-2.5 px-1 pt-6 pb-5">
        <span className="self-start rounded-full bg-espresso px-3 py-1 font-heading font-semibold text-cream">
          No. {shop.rank} in Barcelona
        </span>

        <h1 className="font-heading text-[34px] leading-[1.08] font-semibold">
          {shop.name}
        </h1>

        {shop.averageRating === null ? (
          <p className="text-mocha">No ratings yet</p>
        ) : (
          <p className="flex items-center gap-2">
            <Star className="size-4.5 fill-clay text-clay" aria-hidden />

            <span className="font-bold">{shop.averageRating.toFixed(1)}</span>

            <span className="text-mocha">
              {`· ${shop.ratingCount} ${shop.ratingCount === 1 ? "rating" : "ratings"}`}
            </span>
          </p>
        )}

        <p className="text-[15px] leading-normal text-mocha">{fullAddress}</p>
      </section>

      <section aria-label="Links" className="flex gap-2.5 px-1">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${fullAddress}`)}`}
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants(),
            "h-12.5 flex-1 gap-2 rounded-full bg-clay text-[15px] font-bold text-paper hover:bg-clay/80",
          )}
        >
          <MapPin className="size-4.5" aria-hidden />
          Take me there
        </a>

        {shop.instagramOrWebsite && (
          <a
            href={shop.instagramOrWebsite}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-12.5 rounded-full border-espresso px-5 text-[15px] font-semibold",
            )}
          >
            {shop.instagramOrWebsite.includes("instagram.com")
              ? "Instagram"
              : "Website"}
          </a>
        )}
      </section>
    </>
  );
}
