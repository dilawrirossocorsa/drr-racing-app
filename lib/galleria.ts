// Foto di DRR Racing: SOLO quelle pubblicate sulla galleria del sito del
// team (Billy, 26/09/2026), divise per evento come sul sito.
// La galleria sta su Pixieset, che respinge i server (Cloudflare): l'elenco
// lo aggiorna Paddock (Admin > DRR Racing > Foto dal sito) e arriva qui da
// /api/pubblico insieme al resto. Le immagini si caricano da Pixieset.
import { dati } from "@/lib/dati";

export const GALLERIA_URL = "https://dilawrigroupofcompanies17.pixieset.com/dilawrirossocorsa/";

export type Foto = { id: string; piccola: string; media: string; grande: string; w: number; h: number };
export type Album = { slug: string; titolo: string; url: string; foto: Foto[] };
type Grezzo = { slug: string; titolo: string; url: string | null; foto: [string, string, string, number, number][] };

const IMG = "https://images.pixieset.com/";

export async function galleria(): Promise<Album[]> {
  const d = await dati();
  const g = ((d as unknown as { galleria?: Grezzo[] }).galleria ?? []) as Grezzo[];
  return g
    .map((a) => ({
      slug: a.slug,
      titolo: a.titolo,
      url: a.url || GALLERIA_URL + a.slug + "/",
      foto: (a.foto || []).map(([id, p, ext, w, h]) => ({
        id, w, h,
        piccola: `${IMG}${p}-medium.${ext}`,
        media: `${IMG}${p}-large.${ext}`,
        grande: `${IMG}${p}-xxlarge.${ext}`,
      })),
    }))
    .filter((a) => a.foto.length);
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
