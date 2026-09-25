import { dati } from "@/lib/dati";
import { lingua, tt } from "@/lib/lingua";

export const revalidate = 120;

export default async function FotoPag() {
  const l = lingua();
  const d = await dati();
  const nome = new Map(d.eventi.map((e) => [e.slug, e.nome]));
  const per = new Map<string, typeof d.foto>();
  d.foto.forEach((f) => per.set(f.evento, [...(per.get(f.evento) ?? []), f]));
  return (
    <>
      <h1>{tt(l, "Foto", "Photos")}</h1>
      {!d.foto.length ? <p className="vuoto">{tt(l, "Le foto arrivano presto.", "Photos coming soon.")}</p> : null}
      {[...per.entries()].map(([ev, ff]) => (
        <div className="card" key={ev}>
          <h2>{nome.get(ev) ?? ev}</h2>
          <div className="foto">{ff.map((f) => <a key={f.id} href={f.url} target="_blank" rel="noopener"><img src={f.url} alt="" loading="lazy" /></a>)}</div>
        </div>
      ))}
    </>
  );
}
