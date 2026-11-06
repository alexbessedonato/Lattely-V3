"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getMember } from "@/lib/auth/auth-server";
import { rateShop } from "@/lib/rating/rate-shop";

// A Server Action: tapping a star posts its form here. shopId is bound on the page; stars comes from the tapped button.
export async function rateShopAction(shopId: number, formData: FormData) {
  const member = await getMember();
  if (!member) redirect("/sign-in"); // only Members can rate

  // Anyone can call a Server Action with anything; rateShop refuses stars that aren't 1–5.
  await rateShop(member, shopId, Number(formData.get("stars")));

  refresh(); // rebuild the page so the new Rating, Average rating and Rank show
}
