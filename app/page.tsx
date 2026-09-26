import Link from "next/link";
import { dati, prossimo, ultimoConRisultati, CATEGORIE, bandiera, nomeCognome } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";
import Countdown from "@/components/Countdown";
import Risultati from "@/components/Risultati";

export const revalidate = 120;

export default async function Home() {
  const l = lingua();
  const i = l === "en" ? 1 : 0;
  const d = await dati();
  const ev = prossimo(d.eventi);
  const prossimaSess = ev?.sessioni.find((s) => new Date(s.end_at).getTime() > Date.now()) ?? null;
  const ultimo = ultimoConRisultati(d.eventi);
  const intro = l === "en" ? d.link.racing_intro_en : d.link.racing_intro_it;
  const social = (d.link.social ?? []).map((x) => ({ ...x, nome: x.tipo === "sito" ? tt(l, "Sito ufficiale", "Official website") : x.nome }));
  return (
    <>
      {ev ? (
        <Link href={`/evento/${ev.slug}`} className="hero">
          <span className="etichetta">{ev.test ? "Test" : tt(l, "Prossima gara", "Next race")}</span>
          <h2>{ev.nome}</h2>
          <div className="sotto">{ev.circuito} · {ev.date_label}</div>
          {prossimaSess ? (
            <div style={{ marginTop: 14 }}>
              <div className="sotto">{prossimaSess.name}</div>
              <Countdown a={prossimaSess.start_at} finoA={prossimaSess.end_at} lingua={l} />
            </div>
          ) : ev.inizio ? <div style={{ marginTop: 14 }}><Countdown a={ev.inizio} lingua={l} /></div> : null}
        </Link>
      ) : null}

      {d.piloti.length ? (
        <>
          <div className="sezione"><h2>{tt(l, "I nostri piloti", "Our drivers")}</h2><Link href="/piloti">{tt(l, "Tutti", "All")} →</Link></div>
          <div className="fila">
            {d.piloti.map((p) => {
              const [n, c] = nomeCognome(p.nome);
              const pos = p.classifica[0]?.posizione ?? p.ferrari?.posizione ?? null;
              const pt = p.classifica[0]?.punti ?? p.ferrari?.punti ?? p.punti_stagione ?? 0;
              const cat = p.categoria || p.ferrari?.categoria || null;
              return (
                <Link key={p.id} href={`/piloti/${p.id}`} className="board">
                  <div className="board-foto">
                    {p.foto ? <img src={p.foto} alt={p.nome} loading="lazy" /> : <div className="board-vuota">{p.numero ?? ""}</div>}
                    {p.numero ? <span className="board-num">{p.numero}</span> : null}
                  </div>
                  <div className="board-dati">
                    <div className="board-nome">{n} <b>{c}</b> <span className="board-flag">{bandiera(p.nazione || p.ferrari?.nazione)}</span></div>
                    <div className="board-cat">{cat ? CATEGORIE[cat]?.[i] ?? cat : "Ferrari Challenge"}</div>
                    <div className="board-riga" style={{ gridTemplateColumns: "1fr 1fr" }}>
                      <span><small>{tt(l, "Pos.", "Pos.")}</small>{pos ? `P${pos}` : "—"}</span>
                      <span><small>{tt(l, "Punti", "Points")}</small>{pt}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : null}

      {ultimo ? (
        <>
          <div className="sezione"><h2>{tt(l, "Ultimi risultati", "Latest results")}</h2><Link href={`/evento/${ultimo.slug}`}>{ultimo.nome} →</Link></div>
          <div className="card"><Risultati righe={ultimo.risultati} l={l} /></div>
        </>
      ) : null}

      {d.foto.length ? (
        <>
          <div className="sezione"><h2>{tt(l, "Foto", "Photos")}</h2><Link href="/foto">{tt(l, "Tutte", "All")} →</Link></div>
          <div className="foto">{d.foto.slice(0, 6).map((f) => <a key={f.id} href={f.url} target="_blank" rel="noopener"><img src={f.url} alt="" loading="lazy" /></a>)}</div>
        </>
      ) : null}

      {intro ? (
        <>
          <div className="sezione"><h2>{tt(l, "Il team", "The team")}</h2></div>
          <div className="card intro">{intro.split(/\n\s*\n/).map((p, k) => <p key={k}>{p}</p>)}</div>
        </>
      ) : null}

      {social.length ? (
        <>
          <div className="sezione"><h2>{tt(l, "Seguici", "Follow us")}</h2></div>
          <div className="social">{social.map((x) => <a key={x.url} href={x.url} target="_blank" rel="noopener">{x.nome}</a>)}</div>
        </>
      ) : null}
    </>
  );
}
