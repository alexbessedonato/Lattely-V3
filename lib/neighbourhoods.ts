import { asc } from "drizzle-orm";
import { db } from "@/db/client";
import { neighbourhoods } from "@/db/schema";

export async function getNeighbourhoods() {
  return db.select().from(neighbourhoods).orderBy(asc(neighbourhoods.name));
}
