"use server";

import { refresh } from "next/cache";
import { closeShop } from "@/lib/admin/close-shop";
import { refuseNonAdmins } from "@/lib/admin/get-admin";

// The Close button next to a live Shop posts here. shopId is bound on the page.
export async function closeShopAction(shopId: number) {
  await refuseNonAdmins();
  await closeShop(shopId);
  refresh(); // rebuild /admin so the Shop leaves the Live shops list
}
