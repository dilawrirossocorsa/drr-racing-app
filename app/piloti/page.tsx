import Link from "next/link";
import { dati, CATEGORIE } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";

export const revalidate = 120;

export default async function Piloti() {
  const l = lingua();
  const d = await dati();
  const i = l === "en" ? 1 : 0;
  return (
    <>
      <h1>{tt(l, "Piloti", "Drivers")}</h1>
      {!d.piloti.length ? <p className="vuoto">{tt(l, "Le schede dei piloti arrivano presto.", "Driver profiles coming soon.")}</p> : null}
      <div className="griglia">
        {d.piloti.map((p) => (
          <Link key={p.id} href={`/piloti/${p.id}`} className="card pilota">
            {p.foto ? <img src={p.foto} alt={p.nome} loading="lazy" /> : <div className="pilota-vuoto" style={{ aspectRatio: "4/5", background: "#dde2ea", borderRadius: 10 }} />}
            <h3 style={{ marginTop: 10 }}>{p.numero ? <span className="num">{p.numero}</span> : null} {p.nome}</h3>
            <div className="sotto">{p.categoria ? CATEGORIE[p.categoria]?.[i] ?? p.categoria : ""}{p.classifica[0] ? ` · P${p.classifica[0].posizione} ${tt(l, "in campionato", "in championship")}` : ""}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
