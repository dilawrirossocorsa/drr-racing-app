import Link from "next/link";
import { dati, prossimo, ultimoConRisultati } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";
import Countdown from "@/components/Countdown";
import Risultati from "@/components/Risultati";

export const revalidate = 120;

export default async function Home() {
  const l = lingua();
  const d = await dati();
  const ev = prossimo(d.eventi);
  const prossimaSess = ev?.sessioni.find((s) => new Date(s.end_at).getTime() > Date.now()) ?? null;
  const ultimo = ultimoConRisultati(d.eventi);
  const intro = l === "en" ? d.link.racing_intro_en : d.link.racing_intro_it;
  const social = (d.link.social ?? []).map((x) => ({ ...x, nome: x.tipo === "sito" ? tt(l, "Sito", "Website") : x.nome }));
  return (
    <>
      {intro ? <div className="card intro">{intro.split(/\n\s*\n/).map((p, k) => <p key={k}>{p}</p>)}</div> : null}
      {ev ? (
        <div className={"card" + (ev.test ? "" : " gara")}>
          <div className="sotto">{tt(l, "Prossimo evento", "Next event")}</div>
          <h2 className={ev.test ? "" : "nome-gara"}><Link href={`/evento/${ev.slug}`}>{ev.nome}</Link></h2>
          <div className="sotto">{ev.circuito} · {ev.date_label}</div>
          {prossimaSess ? (
            <div style={{ marginTop: 10 }}>
              <div className="sotto">{prossimaSess.name}</div>
              <Countdown a={prossimaSess.start_at} finoA={prossimaSess.end_at} lingua={l} />
            </div>
          ) : ev.inizio ? <div style={{ marginTop: 10 }}><Countdown a={ev.inizio} lingua={l} /></div> : null}
        </div>
      ) : null}
      {ultimo ? (
        <div className="card">
          <h2>{tt(l, "Ultimi risultati", "Latest results")} · <Link href={`/evento/${ultimo.slug}`}>{ultimo.nome}</Link></h2>
          <Risultati righe={ultimo.risultati} l={l} />
        </div>
      ) : null}
      {d.foto.length ? (
        <div className="card">
          <h2><Link href="/foto">{tt(l, "Foto", "Photos")}</Link></h2>
          <div className="foto">{d.foto.slice(0, 6).map((f) => <a key={f.id} href={f.url} target="_blank" rel="noopener"><img src={f.url} alt="" loading="lazy" /></a>)}</div>
        </div>
      ) : null}
      <div className="bottoni">
        {social.map((x) => <a key={x.url} className="btn" href={x.url} target="_blank" rel="noopener">{x.nome}</a>)}
      </div>
    </>
  );
}
