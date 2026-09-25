import { CATEGORIE, SESSIONI, type Risultato } from "@/lib/dati";
import type { Lingua } from "@/lib/lingua";

export default function Risultati({ righe, l }: { righe: Risultato[]; l: Lingua }) {
  const ordine = ["q1", "r1", "q2", "r2"];
  const sess = ordine.filter((s) => righe.some((r) => r.session === s));
  const i = l === "en" ? 1 : 0;
  return (
    <div className="ris">
      {sess.map((s) => (
        <div key={s}>
          <h4>{SESSIONI[s][i]}</h4>
          <table>
            <tbody>
              {righe.filter((r) => r.session === s).sort((a, b) => (a.pos_class ?? 99) - (b.pos_class ?? 99)).map((r, k) => (
                <tr key={k}>
                  <td className="pos">{r.status ? r.status : r.pos_class ? "P" + r.pos_class : "—"}</td>
                  <td><span className="num">{r.numero}</span> {r.driver_name}
                    {r.pole ? <span className="tag">POLE</span> : null}{r.fastest_lap ? <span className="tag">{l === "en" ? "FASTEST LAP" : "GIRO VELOCE"}</span> : null}
                    <div className="sotto">{r.category ? CATEGORIE[r.category]?.[i] ?? r.category : ""}{r.best_lap ? ` · ${r.best_lap}` : ""}</div>
                  </td>
                  <td className="pt">{r.points != null ? `${r.points} pt` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
