import { dati, CATEGORIE } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";

export const revalidate = 120;

export default async function ClassificaPag() {
  const l = lingua();
  const d = await dati();
  const i = l === "en" ? 1 : 0;
  return (
    <>
      <h1>{tt(l, "Classifica di campionato", "Championship standings")}</h1>
      {!d.classifica.length ? <p className="vuoto">{tt(l, "Classifica in arrivo.", "Standings coming soon.")}</p> : null}
      {d.classifica.map((c) => (
        <div className="card" key={c.categoria}>
          <h2>{CATEGORIE[c.categoria]?.[i] ?? c.categoria}</h2>
          <table><tbody>
            {c.righe.map((r) => (
              <tr key={r.position + r.driver_name} className={r.is_drr_driver ? "nostro" : ""}>
                <td className="pos">{r.position}</td><td>{r.driver_name}</td><td className="pt">{r.points ?? 0} pt</td>
              </tr>
            ))}
          </tbody></table>
        </div>
      ))}
    </>
  );
}
