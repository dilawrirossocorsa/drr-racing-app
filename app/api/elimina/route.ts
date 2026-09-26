import { NextResponse } from "next/server";
import { clientServer } from "@/lib/supabase";

// Il fan cancella il suo account: Paddock lo riconosce dal token della sessione.
export async function POST() {
  const sb = await clientServer();
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const base = (process.env.PADDOCK_URL || "https://app.dilawrirossocorsa.com").replace(/\/+$/, "");
  try {
    const r = await fetch(`${base}/api/racing/elimina`, { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    const j = await r.json().catch(() => ({ ok: false }));
    if (j.ok) await sb.auth.signOut();
    return NextResponse.json(j, { status: r.status });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
