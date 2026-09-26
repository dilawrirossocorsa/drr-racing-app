import Link from "next/link";
import { dati, CATEGORIE, bandiera, nomeCognome } from "@/lib/dati";
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
      <div className="griglia piloti">
        {d.piloti.map((p) => {
          const [nome, cognome] = nomeCognome(p.nome);
          const c = p.classifica[0] ?? (p.ferrari?.posizione ? { posizione: p.ferrari.posizione, punti: p.ferrari.punti } : undefined);
          const cat = p.categoria || p.ferrari?.categoria || null;
          return (
            <Link key={p.id} href={`/piloti/${p.id}`} className="board">
              <div className="board-foto">
                {p.foto ? <img src={p.foto} alt={p.nome} loading="lazy" /> : <div className="board-vuota">{p.numero ?? ""}</div>}
                {p.numero ? <span className="board-num">{p.numero}</span> : null}
              </div>
              <div className="board-dati">
                <div className="board-nome">{nome} <b>{cognome}</b> <span className="board-flag">{bandiera(p.nazione)}</span></div>
                <div className="board-cat">{cat ? CATEGORIE[cat]?.[i] ?? cat : "Ferrari Challenge"}</div>
                <div className="board-riga">
                  <span><small>{tt(l, "Pos.", "Pos.")}</small>{c ? `P${c.posizione}` : "—"}</span>
                  <span><small>{tt(l, "Punti", "Points")}</small>{c?.punti ?? p.punti_stagione ?? 0}</span>
                  <span><small>{tt(l, "Gare", "Races")}</small>{p.ferrari?.gare_stagione?.length || p.gare}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {d.piloti.some((p) => p.ferrari) ? <p className="fonte">{tt(l, "Foto e dati: Ferrari Corse Clienti", "Photos and data: Ferrari Corse Clienti")}</p> : null}
    </>
  );
}
