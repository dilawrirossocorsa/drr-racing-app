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
};
export type Classifica = { categoria: string; righe: { position: number; driver_name: string; points: number | null; is_drr_driver: boolean }[] };
export type Foto = { id: string; evento: string; url: string; quando: string };
export type Dati = {
  aggiornato: string;
  link: { racing_site_url?: string | null; racing_instagram_url?: string | null; racing_facebook_url?: string | null; racing_youtube_url?: string | null; racing_intro_it?: string | null; racing_intro_en?: string | null };
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
