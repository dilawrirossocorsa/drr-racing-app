import { notFound } from "next/navigation";
import Link from "next/link";
import { dati, CATEGORIE, SESSIONI } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";

export const revalidate = 120;

export default async function Pilota({ params }: { params: { id: string } }) {
  const l = lingua();
  const d = await dati();
  const p = d.piloti.find((x) => x.id === params.id);
  if (!p) notFound();
  const i = l === "en" ? 1 : 0;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const gare = d.eventi
    .map((e) => ({ e, r: e.risultati.filter((r) => (p.numero && r.numero === p.numero) || norm(r.driver_name) === norm(p.nome)) }))
    .filter((x) => x.r.length)
    .sort((a, b) => (a.e.inizio || "").localeCompare(b.e.inizio || ""));
  const bio = l === "en" ? p.bio_en || p.bio_it : p.bio_it || p.bio_en;
  return (
    <>
      <div className="card pilota" style={{ display: "grid", gap: 16, gridTemplateColumns: "minmax(0,220px) 1fr" }}>
        {p.foto ? <img src={p.foto} alt={p.nome} /> : <div style={{ aspectRatio: "4/5", background: "#dde2ea", borderRadius: 10 }} />}
        <div>
          <h1 style={{ marginTop: 0 }}>{p.numero ? <span className="num">{p.numero}</span> : null} {p.nome}</h1>
          <div className="sotto">{p.categoria ? CATEGORIE[p.categoria]?.[i] ?? p.categoria : ""}{p.nazione ? ` · ${p.nazione.toUpperCase()}` : ""}</div>
          {p.classifica.map((c) => <p key={c.categoria}><b>P{c.posizione}</b> {CATEGORIE[c.categoria]?.[i] ?? c.categoria} · {c.punti ?? 0} pt</p>)}
          {bio ? <p>{bio}</p> : null}
          <div className="bottoni">
            {p.instagram ? <a className="btn" href={p.instagram.startsWith("http") ? p.instagram : `https://instagram.com/${p.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener">Instagram</a> : null}
            {p.sito ? <a className="btn" href={p.sito.startsWith("http") ? p.sito : `https://${p.sito}`} target="_blank" rel="noopener">{tt(l, "Sito", "Website")}</a> : null}
          </div>
        </div>
      </div>
      <div className="card">
        <h2>{tt(l, "Risultati della stagione", "Season results")}</h2>
        {!gare.length ? <p className="vuoto">{tt(l, "Ancora nessun risultato.", "No results yet.")}</p> : (
          <table><tbody>
            {gare.flatMap(({ e, r }) => r.map((x, k) => (
              <tr key={e.slug + k}>
                <td><Link href={`/evento/${e.slug}`}>{e.nome}</Link><div className="sotto">{SESSIONI[x.session]?.[i]}</div></td>
                <td className="pos">{x.status || (x.pos_class ? "P" + x.pos_class : "—")}{x.pole ? <span className="tag">POLE</span> : null}</td>
                <td className="pt">{x.points != null ? `${x.points} pt` : ""}</td>
              </tr>
            )))}
          </tbody></table>
        )}
      </div>
    </>
  );
}
