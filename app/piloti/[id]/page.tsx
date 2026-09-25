import { notFound } from "next/navigation";
import Link from "next/link";
import { dati, CATEGORIE, SESSIONI, bandiera, nomeCognome } from "@/lib/dati";
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
      <div className="board board-grande">
        <div className="board-foto">
          {p.foto ? <img src={p.foto} alt={p.nome} /> : <div className="board-vuota">{p.numero ?? ""}</div>}
          {p.numero ? <span className="board-num">{p.numero}</span> : null}
        </div>
        <div className="board-dati">
          <div className="board-nome">{nomeCognome(p.nome)[0]} <b>{nomeCognome(p.nome)[1]}</b> <span className="board-flag">{bandiera(p.nazione)}</span></div>
          <div className="board-cat">{p.categoria ? CATEGORIE[p.categoria]?.[i] ?? p.categoria : "Ferrari Challenge"} · Ferrari 296 Challenge</div>
          <div className="board-riga">
            <span><small>{tt(l, "Pos.", "Pos.")}</small>{p.classifica[0] ? `P${p.classifica[0].posizione}` : "—"}</span>
            <span><small>{tt(l, "Punti", "Points")}</small>{p.classifica[0]?.punti ?? p.punti_stagione ?? 0}</span>
            <span><small>{tt(l, "Gare", "Races")}</small>{p.gare}</span>
          </div>
          {p.classifica.length > 1 ? p.classifica.slice(1).map((c) => <div key={c.categoria} className="board-cat">P{c.posizione} {CATEGORIE[c.categoria]?.[i] ?? c.categoria} · {c.punti ?? 0} pt</div>) : null}
        </div>
      </div>
      {bio || p.instagram || p.sito ? (
        <div className="card">
          {bio ? <p style={{ marginTop: 0 }}>{bio}</p> : null}
          <div className="bottoni">
            {p.instagram ? <a className="btn" href={p.instagram.startsWith("http") ? p.instagram : `https://instagram.com/${p.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener">Instagram</a> : null}
            {p.sito ? <a className="btn" href={p.sito.startsWith("http") ? p.sito : `https://${p.sito}`} target="_blank" rel="noopener">{tt(l, "Sito", "Website")}</a> : null}
          </div>
        </div>
      ) : null}
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
