import { notFound } from "next/navigation";
import { dati } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";
import Countdown from "@/components/Countdown";
import Risultati from "@/components/Risultati";
import Galleria from "@/components/Galleria";
import { galleria, albumDiEvento } from "@/lib/galleria";

export const revalidate = 120;

export default async function Evento({ params }: { params: { slug: string } }) {
  const l = lingua();
  const d = await dati();
  const ev = d.eventi.find((e) => e.slug === params.slug);
  if (!ev) notFound();
  const tz = ev.timezone || "America/New_York";
  const giorno = (s: string) => new Date(s).toLocaleDateString(l === "en" ? "en-US" : "it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: tz });
  const ora = (s: string) => new Date(s).toLocaleTimeString(l === "en" ? "en-US" : "it-IT", { hour: "2-digit", minute: "2-digit", timeZone: tz });
  const perGiorno = new Map<string, typeof ev.sessioni>();
  ev.sessioni.forEach((s) => perGiorno.set(giorno(s.start_at), [...(perGiorno.get(giorno(s.start_at)) ?? []), s]));
  const album = albumDiEvento(await galleria(), ev);
  const prossima = ev.sessioni.find((s) => new Date(s.end_at).getTime() > Date.now());
  return (
    <>
      <div className={"card" + (ev.test ? "" : " gara")}>
        <div className="sotto">{ev.date_label}{ev.test ? " · Test" : ""}</div>
        <h1 className={ev.test ? "" : "nome-gara"} style={{ margin: "4px 0" }}>{ev.nome}</h1>
        <div className="sotto">{ev.circuito}</div>
        {prossima ? <div style={{ marginTop: 10 }}><div className="sotto">{prossima.name}</div><Countdown a={prossima.start_at} finoA={prossima.end_at} lingua={l} /></div> : null}
      </div>
      {ev.risultati.length ? <div className="card"><h2>{tt(l, "Risultati DRR", "DRR results")}</h2><Risultati righe={ev.risultati} l={l} /></div> : null}
      {ev.sessioni.length ? (
        <div className="card">
          <h2>{tt(l, "Orari", "Schedule")} <span className="sotto">({tt(l, "ora del circuito", "track time")})</span></h2>
          {[...perGiorno.entries()].map(([g, ss]) => (
            <div key={g}>
              <h4>{g}</h4>
              <table><tbody>
                {ss.map((s, i) => <tr key={i}><td style={{ width: 110 }}>{ora(s.start_at)} – {ora(s.end_at)}</td><td>{s.name}</td></tr>)}
              </tbody></table>
            </div>
          ))}
        </div>
      ) : null}
      {album ? <div className="card"><h2>{tt(l, "Foto", "Photos")} <span className="sotto">· {album.titolo}</span></h2><Galleria foto={album.foto} max={12} /></div> : null}
    </>
  );
}
