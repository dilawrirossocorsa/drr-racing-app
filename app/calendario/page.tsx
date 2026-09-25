import Link from "next/link";
import { dati } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";

export const revalidate = 120;

export default async function Calendario() {
  const l = lingua();
  const d = await dati();
  const ora = Date.now();
  const ev = [...d.eventi].sort((a, b) => (a.inizio || "").localeCompare(b.inizio || ""));
  return (
    <>
      <h1>{tt(l, "Calendario", "Calendar")}</h1>
      {!ev.length ? <p className="vuoto">{tt(l, "Calendario in arrivo.", "Calendar coming soon.")}</p> : null}
      <div className="griglia">
        {ev.map((e) => {
          const passato = !!e.fine && new Date(e.fine).getTime() + 864e5 < ora;
          return (
            <Link key={e.slug} href={`/evento/${e.slug}`} className={"card" + (e.test ? "" : " gara")} style={{ opacity: passato ? 0.6 : 1 }}>
              <div className="sotto">{e.date_label}{e.test ? " · Test" : ""}</div>
              <h3 className={e.test ? "" : "nome-gara"}>{e.nome}</h3>
              <div className="sotto">{e.circuito}</div>
              {e.risultati.length ? <div className="sotto" style={{ marginTop: 6 }}>{tt(l, "Risultati disponibili", "Results available")}</div> : null}
            </Link>
          );
        })}
      </div>
    </>
  );
}
