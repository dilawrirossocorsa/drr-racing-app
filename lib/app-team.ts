import { accessoAttivo, clientServer } from "@/lib/supabase";

// Icone delle app del team (Paddock, Stock, Tech, Log) nella barra in alto
// di Racing, solo per chi e' del team e solo quelle a cui puo' accedere
// (Billy, 26 settembre 2026). Le decide Paddock (/api/racing/app-utente)
// con la sessione di chi guarda; per i fan e senza accesso: nessuna icona.
export type AppTeam = { key: string; label: string; href: string; icon: string };

const PADDOCK = (process.env.PADDOCK_URL || "https://app.dilawrirossocorsa.com").replace(/\/+$/, "");

export async function appTeam(): Promise<AppTeam[]> {
  if (!accessoAttivo()) return [];
  try {
    const sb = await clientServer();
    const { data: { session } } = await sb.auth.getSession();
    if (!session?.access_token) return [];
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 2500);
    const r = await fetch(`${PADDOCK}/api/racing/app-utente`, {
      headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store", signal: ctl.signal,
    }).finally(() => clearTimeout(t));
    if (!r.ok) return [];
    const j = (await r.json()) as { apps?: AppTeam[] };
    return (j.apps ?? []).filter((a) => /^https:\/\//.test(a.href) && /^https:\/\//.test(a.icon));
  } catch {
    return [];
  }
}
