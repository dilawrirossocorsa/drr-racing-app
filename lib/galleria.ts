// Foto di DRR Racing: SOLO quelle pubblicate sulla galleria del sito del
// team (Billy, 26/09/2026: "carica solo quelle che vengono pubblicate sul
// nostro sito, divise per evento come c'e' sul sito, ed aggiornale in
// automatico quando si caricano sul sito").
// La galleria del sito (dilawri.ca > Dilawri Rossocorsa Racing > Gallery)
// sta su Pixieset: una cartella per evento. Qui si rilegge l'elenco delle
// cartelle e le loro foto ogni ora: una foto o una cartella nuova sul sito
// compare da sola in DRR Racing entro un'ora.

const BASE = "https://dilawrigroupofcompanies17.pixieset.com";
const CUK = "dilawrirossocorsa";
export const GALLERIA_URL = `${BASE}/${CUK}/`;
const OGNI = 3600; // secondi
// intestazioni da browser normale: senza, Pixieset puo' rispondere diversamente ai server
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
const H_PAGINA = { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9" };
const H_DATI = { "User-Agent": UA, "X-Requested-With": "XMLHttpRequest", Accept: "application/json, text/javascript, */*; q=0.01", "Accept-Language": "en-US,en;q=0.9", Referer: `${BASE}/${CUK}/` };

export type Foto = { id: string; piccola: string; media: string; grande: string; w: number; h: number };
export type Album = { slug: string; titolo: string; url: string; foto: Foto[] };

const https = (p: string) => (p.startsWith("//") ? "https:" + p : p);

async function albumFoto(cid: string, slug: string): Promise<Foto[]> {
  const out: Foto[] = [];
  for (let p = 1; p <= 40; p++) {
    const r = await fetch(`${BASE}/client/loadphotos/?cuk=${CUK}&cid=${cid}&gs=${slug}&fk=&clientDownloads=false&page=${p}&size=100`, {
      headers: H_DATI,
      next: { revalidate: OGNI },
    });
    if (!r.ok) break;
    const j = (await r.json()) as { status: string; content: string; isLastPage: boolean };
    if (j.status !== "success") break;
    const righe = JSON.parse(j.content || "[]") as { id: number; pathMedium: string; pathLarge: string; pathXxlarge: string; pathXlarge: string; width: number; height: number; isPrivate?: boolean }[];
    for (const x of righe) {
      if (x.isPrivate) continue;
      out.push({ id: String(x.id), piccola: https(x.pathMedium), media: https(x.pathLarge), grande: https(x.pathXxlarge || x.pathXlarge), w: x.width, h: x.height });
    }
    if (j.isLastPage || !righe.length) break;
  }
  return out;
}

export async function galleria(): Promise<Album[]> {
  try {
    const r = await fetch(GALLERIA_URL, { next: { revalidate: OGNI }, headers: H_PAGINA });
    if (!r.ok) return [];
    const html = await r.text();
    const cid = (html.match(/cid=(\d+)/) || [])[1];
    if (!cid) return [];
    const visti = new Set<string>();
    const cartelle: { slug: string; titolo: string }[] = [];
    for (const m of html.matchAll(new RegExp(`/${CUK}/([a-z0-9-]+)/"[^>]*>\\s*([^<]{2,80})<`, "g"))) {
      const slug = m[1], titolo = m[2].trim();
      if (slug === "store" || visti.has(slug)) continue;
      visti.add(slug);
      cartelle.push({ slug, titolo });
    }
    const album = await Promise.all(cartelle.map(async (c) => ({ ...c, url: `${BASE}/${CUK}/${c.slug}/`, foto: await albumFoto(cid, c.slug).catch(() => []) })));
    return album.filter((a) => a.foto.length);
  } catch {
    return [];
  }
}

const norm = (s: string | null | undefined) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const SINONIMI: [RegExp, string][] = [[/circuit of the americas|\bcota\b/, "cota"], [/thermal/, "thermal"], [/laguna seca|weathertech/, "laguna"], [/road america/, "road america"], [/sonoma/, "sonoma"], [/sebring/, "sebring"], [/barcelona|catalunya|montmelo/, "barcelona"], [/daytona/, "daytona"], [/miami/, "miami"], [/indianapolis/, "indianapolis"], [/watkins/, "watkins"], [/mugello/, "mugello"], [/misano/, "misano"], [/monza/, "monza"], [/imola/, "imola"], [/vallelunga/, "vallelunga"]];
const chiave = (s: string) => { const n = norm(s); return SINONIMI.find(([re]) => re.test(n))?.[1] ?? null; };
const anno = (s: string | null | undefined) => (String(s || "").match(/20\d\d/) || [])[0] ?? null;

// Cartella del sito che corrisponde a un evento (stesso circuito e, se c'e', stesso anno)
export function albumDiEvento(album: Album[], ev: { nome: string; circuito: string | null; inizio: string | null }): Album | null {
  const k = chiave(`${ev.nome} ${ev.circuito ?? ""}`);
  if (!k) return null;
  const a = anno(ev.inizio);
  return album.find((x) => chiave(x.titolo) === k && (!a || !anno(x.titolo) || anno(x.titolo) === a)) ?? null;
}

// Controllo per capire cosa risponde Pixieset al server (api/foto-controllo)
export async function controllo() {
  const out: Record<string, unknown> = {};
  try {
    const r = await fetch(GALLERIA_URL, { cache: "no-store", headers: H_PAGINA });
    const html = await r.text();
    const cid = (html.match(/cid=(\d+)/) || [])[1] || null;
    const cartelle = [...html.matchAll(new RegExp(`/${CUK}/([a-z0-9-]+)/"[^>]*>\\s*([^<]{2,80})<`, "g"))].map((m) => m[1]);
    out.pagina = { stato: r.status, lunghezza: html.length, cid, cartelle: [...new Set(cartelle)], inizio: html.slice(0, 300) };
    if (cid && cartelle.length) {
      const g = cartelle.find((c) => c !== "store")!;
      const d = await fetch(`${BASE}/client/loadphotos/?cuk=${CUK}&cid=${cid}&gs=${g}&fk=&clientDownloads=false&page=1&size=100`, { cache: "no-store", headers: H_DATI });
      const t = await d.text();
      out.dati = { cartella: g, stato: d.status, lunghezza: t.length, inizio: t.slice(0, 200) };
    }
  } catch (e) {
    out.errore = String(e);
  }
  return out;
}
