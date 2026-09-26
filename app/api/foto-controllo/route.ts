import { NextResponse } from "next/server";
import { controllo } from "@/lib/galleria";

// Mostra cosa risponde la galleria del sito (Pixieset) al server di DRR Racing.
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json(await controllo());
}
