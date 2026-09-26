import { galleria, GALLERIA_URL } from "@/lib/galleria";
import { lingua, tt } from "@/lib/lingua";
import Galleria from "@/components/Galleria";

// Foto: solo quelle della galleria del sito del team, divise per evento
// come sul sito, aggiornate da sole ogni ora (lib/galleria.ts).
export const revalidate = 120;

export default async function FotoPag() {
  const l = lingua();
  const album = await galleria();
  return (
    <>
      <h1>{tt(l, "Foto", "Photos")}</h1>
      {!album.length ? <p className="vuoto">{tt(l, "Le foto arrivano presto.", "Photos coming soon.")}</p> : null}
      {album.map((a) => (
        <section key={a.slug} id={a.slug} className="album">
          <div className="sezione"><h2>{a.titolo}</h2><span className="sotto">{a.foto.length} {tt(l, "foto", "photos")}</span></div>
          <Galleria foto={a.foto} max={12} />
        </section>
      ))}
      {album.length ? <p className="fonte"><a href={GALLERIA_URL} target="_blank" rel="noopener">{tt(l, "Galleria completa sul sito del team", "Full gallery on the team website")} ↗</a></p> : null}
    </>
  );
}
