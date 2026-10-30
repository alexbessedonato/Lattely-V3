import { connection } from "next/server";
import { Suspense } from "react";
import { getRanking } from "@/lib/ranking";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-md p-4">
      <h1 className="text-2xl font-semibold">Lattely</h1>
      <Suspense fallback={<p>Loading Shops…</p>}>
        <RankedShops />
      </Suspense>
    </main>
  );
}

async function RankedShops() {
  await connection(); // read the database on every visit, not once at build time
  const ranking = await getRanking();

  return (
    <ul className="mt-4 space-y-2">
      {ranking.map((shop) => (
        <li key={shop.id}>{shop.name}</li>
      ))}
    </ul>
  );
}
