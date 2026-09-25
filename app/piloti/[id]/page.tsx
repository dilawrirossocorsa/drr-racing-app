import { notFound } from "next/navigation";
import Link from "next/link";
import { dati, CATEGORIE, SESSIONI, bandiera, nomeCognome } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";

export const revalidate = 120;

// Scheda pilota: dati di Paddock + scheda ufficiale Ferrari Corse Clienti
// (foto, carriera, titoli, risultati della stagione) letta ogni giorno da
// Paddock su ferrari.com.
export default async function Pilota({ params }: { params: { id: string } }) {
  const l = lingua();
  const d = await dati();
  const p = d.piloti.find((x) => x.id === params.id);
  if (!p) notFound();
  const i = l === "en" ? 1 : 0;
  const f = p.ferrari ?? null;
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const gare = d.eventi
    .map((e) => ({ e, r: e.risultati.filter((r) => (p.numero && r.numero === p.numero) || norm(r.driver_name) === norm(p.nome)) }))
    .filter((x) => x.r.length)
    .sort((a, b) => (a.e.inizio || "").localeCompare(b.e.inizio || ""));
  const bio = l === "en" ? p.bio_en || p.bio_it : p.bio_it || p.bio_en;
  const [nome, cognome] = nomeCognome(p.nome);
  const cat = p.categoria || f?.categoria || null;
  const pos = p.classifica[0]?.posizione ?? f?.posizione ?? null;
  const punti = p.classifica[0]?.punti ?? f?.punti ?? p.punti_stagione ?? 0;
  const garaEn = (g: string) => g.replace("Race-", l === "en" ? "Race " : "Gara ");
  const stat: [string, string, string | number | null | undefined][] = f ? [
    ["Debutto", "Debut", f.debutto], ["Stagioni", "Seasons", f.stagioni], ["Gare", "Races", f.gare], ["Vittorie", "Wins", f.vittorie],
    ["Podi", "Podiums", f.podi], ["Top 10", "Top 10", f.top10], ["Pole", "Poles", f.pole], ["Giri veloci", "Fastest laps", f.giri_veloci],
    ["Titoli", "Titles", f.titoli], ["Punti in carriera", "Career points", f.punti_carriera], ["Media punti", "Avg points", f.media_punti],
  ] : [];
  return (
    <>
      {f?.foto.copertina ? (
        <picture className="copertina">
          {f.foto.copertina_mob ? <source media="(max-width: 700px)" srcSet={f.foto.copertina_mob} /> : null}
          <img src={f.foto.copertina} alt={p.nome} />
        </picture>
      ) : null}
      <div className="board board-grande">
        <div className="board-foto">
          {p.foto ? <img src={p.foto} alt={p.nome} /> : <div className="board-vuota">{p.numero ?? ""}</div>}
          {p.numero || f?.numero ? <span className="board-num">{p.numero || f?.numero}</span> : null}
        </div>
        <div className="board-dati">
          <div className="board-nome">{nome} <b>{cognome}</b> <span className="board-flag">{bandiera(p.nazione || f?.nazione)}</span></div>
          <div className="board-cat">{cat ? CATEGORIE[cat]?.[i] ?? cat : "Ferrari Challenge"} · Ferrari {f?.auto || "296 Challenge"}</div>
          {f?.team ? <div className="board-cat">{f.team}</div> : null}
          <div className="board-riga">
            <span><small>{tt(l, "Pos.", "Pos.")}</small>{pos ? `P${pos}` : "—"}</span>
            <span><small>{tt(l, "Punti", "Points")}</small>{punti}</span>
            <span><small>{tt(l, "Gare", "Races")}</small>{f?.gare_stagione.length || p.gare}</span>
          </div>
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
      {f ? (
        <div className="card">
          <h2>{tt(l, "Carriera nel Ferrari Challenge", "Ferrari Challenge career")}</h2>
          <div className="stat">
            {stat.filter(([, , v]) => v !== null && v !== undefined && v !== "").map(([a, b, v]) => <div key={a}><b>{v}</b><small>{tt(l, a, b)}</small></div>)}
          </div>
          {f.titoli_dettaglio.length ? (
            <>
              <h4>{tt(l, "Titoli", "Titles")}</h4>
              {f.titoli_dettaglio.map((t) => <p key={t.anno + t.campionato} style={{ margin: "2px 0" }}>🏆 <b>{t.anno}</b> · {t.campionato} · {t.auto}</p>)}
            </>
          ) : null}
          {f.miglior_stagione ? <p className="sotto">{tt(l, "Miglior stagione", "Best season")}: {f.miglior_stagione}</p> : null}
        </div>
      ) : null}
      <div className="card">
        <h2>{tt(l, "Risultati della stagione", "Season results")}{f?.anno ? ` ${f.anno}` : ""}</h2>
        {f?.gare_stagione.length ? (
          <table><tbody>
            {[...f.gare_stagione].reverse().map((g, k) => (
              <tr key={k}>
                <td>{g.circuito}<div className="sotto">{garaEn(g.gara)} · {g.data}</div></td>
                <td className="pos">{/^\d+$/.test(g.pos) ? "P" + g.pos : g.pos === "/" ? "DNF" : g.pos}{g.pole ? <span className="tag">POLE</span> : null}{g.giro_veloce ? <span className="tag">GV</span> : null}</td>
                <td className="pt">{g.punti != null ? `${g.punti} pt` : ""}</td>
              </tr>
            ))}
          </tbody></table>
        ) : !gare.length ? <p className="vuoto">{tt(l, "Ancora nessun risultato.", "No results yet.")}</p> : (
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
      {f?.foto.auto ? <img className="foto-grande" src={f.foto.auto} alt={p.nome} loading="lazy" /> : null}
      {f ? (
        <p className="fonte">
          {tt(l, "Foto e dati: Ferrari Corse Clienti", "Photos and data: Ferrari Corse Clienti")} · <a href={f.url} target="_blank" rel="noopener">{tt(l, "scheda ufficiale su ferrari.com", "official profile on ferrari.com")}</a>
        </p>
      ) : null}
    </>
  );
}
