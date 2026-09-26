import { NextResponse } from "next/server";

// Giro verso Paddock, che crea l'account del fan "in attesa" e avvisa l'admin.
export async function POST(req: Request) {
  const base = (process.env.PADDOCK_URL || "https://app.dilawrirossocorsa.com").replace(/\/+$/, "");
  try {
    const r = await fetch(`${base}/api/racing/iscrizione`, { method: "POST", headers: { "Content-Type": "application/json" }, body: await req.text(), cache: "no-store" });
    return NextResponse.json(await r.json().catch(() => ({ ok: false, errore: "server" })), { status: r.status });
  } catch {
    return NextResponse.json({ ok: false, errore: "server" }, { status: 502 });
  }
}
