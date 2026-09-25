// Dati pubblici da DRR Paddock (/api/pubblico). Solo quello che Paddock
// segna come pubblico.
export type Sessione = { name: string; category: string; start_at: string; end_at: string };
export type Risultato = {
  session: "q1" | "r1" | "q2" | "r2"; numero: string; driver_name: string; category: string | null;
  pos_class: number | null; pos_overall: number | null; points: number | null; pole: boolean; fastest_lap: boolean;
  best_lap: string | null; status: string;
};
export type Evento = {
  slug: string; nome: string; circuito: string | null; date_label: string | null; timezone: string | null; test: boolean;
  inizio: string | null; fine: string | null; sessioni: Sessione[]; risultati: Risultato[];
};
export type Pilota = {
  id: string; nome: string; numero: string | null; categoria: string | null; nazione: string | null; foto: string | null;
  bio_it: string | null; bio_en: string | null; instagram: string | null; sito: string | null; punti_stagione: number;
  classifica: { categoria: string; posizione: number; punti: number | null }[]; gare: number;
  // scheda ufficiale letta ogni giorno da ferrari.com (Paddock, lib/ferrari-drivers.ts)
  ferrari?: Ferrari | null;
};
export type Ferrari = {
  slug: string; url: string; nome: string; cognome: string; nazione: string | null; numero: string | null; team: string | null;
  categoria: string | null; categoria_nome: string | null; posizione: number | null; punti: number | null; auto: string | null;
  debutto: string | null; stagioni: string | null; titoli: number; titoli_dettaglio: { anno: string; campionato: string; auto: string }[];
  finali_mondiali: number; media_punti: string | null; punti_carriera: number | null; gare: number | null; podi: number | null;
  top10: number | null; vittorie: number | null; pole: number | null; giri_veloci: number | null;
  miglior_stagione: string | null; miglior_stagione_punti: string | null; primo_top10: string | null;
  anno: string | null; gare_stagione: { data: string; circuito: string; gara: string; pos: string; punti: number | null; pole: boolean; giro_veloce: boolean }[];
  foto: { ritratto: string | null; ritratto_grande: string | null; copertina: string | null; copertina_mob: string | null; auto: string | null };
};
export type Classifica = { categoria: string; righe: { position: number; driver_name: string; points: number | null; is_drr_driver: boolean }[] };
export type Foto = { id: string; evento: string; url: string; quando: string };
export type Dati = {
  aggiornato: string;
  // sito e social: la lista e' in Paddock, qui arrivano solo quelli spuntati "visibile in DRR Racing"
  link: { social?: { nome: string; tipo: string; url: string }[]; racing_intro_it?: string | null; racing_intro_en?: string | null };
  eventi: Evento[]; classifica: Classifica[]; piloti: Pilota[]; foto: Foto[];
};

const URL_DATI = (process.env.PADDOCK_URL || "https://app.dilawrirossocorsa.com") + "/api/pubblico";

export async function dati(): Promise<Dati> {
  try {
    const r = await fetch(URL_DATI, { next: { revalidate: 120 } });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()) as Dati;
  } catch {
    return { aggiornato: new Date().toISOString(), link: {}, eventi: [], classifica: [], piloti: [], foto: [] };
  }
}

export const CATEGORIE: Record<string, [string, string]> = {
  pirelli: ["Trofeo Pirelli", "Trofeo Pirelli"],
  pirelli_am: ["Trofeo Pirelli Am", "Trofeo Pirelli Am"],
  shell: ["Coppa Shell", "Coppa Shell"],
  shell_am: ["Coppa Shell Am", "Coppa Shell Am"],
  pirelli_gentlemen: ["Pirelli Gentlemen", "Pirelli Gentlemen"],
  pirelli_am_gentlemen: ["Pirelli Am Gentlemen", "Pirelli Am Gentlemen"],
  shell_gentlemen: ["Shell Gentlemen", "Shell Gentlemen"],
  shell_am_gentlemen: ["Shell Am Gentlemen", "Shell Am Gentlemen"],
};
export const SESSIONI: Record<string, [string, string]> = { q1: ["Qualifica 1", "Qualifying 1"], r1: ["Gara 1", "Race 1"], q2: ["Qualifica 2", "Qualifying 2"], r2: ["Gara 2", "Race 2"] };

export function prossimo(eventi: Evento[]): Evento | null {
  const ora = Date.now();
  const futuri = eventi.filter((e) => e.fine && new Date(e.fine).getTime() + 864e5 >= ora).sort((a, b) => (a.inizio || "").localeCompare(b.inizio || ""));
  return futuri[0] ?? null;
}
export function ultimoConRisultati(eventi: Evento[]): Evento | null {
  const con = eventi.filter((e) => e.risultati.length).sort((a, b) => (b.inizio || "").localeCompare(a.inizio || ""));
  return con[0] ?? null;
}

// Bandiera dalla sigla della nazione (it, us, ca...).
export function bandiera(n: string | null | undefined): string {
  const c = (n || "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(c)) return "";
  return String.fromCodePoint(...[...c].map((x) => 0x1f1e6 + x.charCodeAt(0) - 65));
}
// "Michael Owens" -> ["Michael", "OWENS"] per le schede in stile tabellone
export function nomeCognome(n: string): [string, string] {
  const p = n.trim().split(/\s+/);
  if (p.length < 2) return ["", n.toUpperCase()];
  return [p.slice(0, -1).join(" "), p[p.length - 1].toUpperCase()];
}
