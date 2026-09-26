"use client";
import { useEffect, useState } from "react";
import type { Foto } from "@/lib/galleria";

// Griglia di foto con visore a tutto schermo (frecce, scorrimento col dito, Esc).
export default function Galleria({ foto, max }: { foto: Foto[]; max?: number }) {
  const [i, setI] = useState<number | null>(null);
  const [tutte, setTutte] = useState(!max);
  const vis = tutte || !max ? foto : foto.slice(0, max);
  const vai = (d: number) => setI((x) => (x === null ? x : (x + d + foto.length) % foto.length));
  useEffect(() => {
    if (i === null) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setI(null); if (e.key === "ArrowRight") vai(1); if (e.key === "ArrowLeft") vai(-1); };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);
  let x0 = 0;
  return (
    <>
      <div className="foto">
        {vis.map((f, k) => (
          <button key={f.id} className="foto-btn" onClick={() => setI(k)} aria-label="Apri foto">
            <img src={f.piccola} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {max && foto.length > max && !tutte ? (
        <button className="altre" onClick={() => setTutte(true)}>+ {foto.length - max}</button>
      ) : null}
      {i !== null ? (
        <div className="visore" onClick={() => setI(null)}
          onTouchStart={(e) => { x0 = e.touches[0].clientX; }}
          onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { e.stopPropagation(); vai(dx < 0 ? 1 : -1); } }}>
          <img src={foto[i].grande} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="v-chiudi" onClick={() => setI(null)} aria-label="Chiudi">✕</button>
          <button className="v-prec" onClick={(e) => { e.stopPropagation(); vai(-1); }} aria-label="Precedente">‹</button>
          <button className="v-succ" onClick={(e) => { e.stopPropagation(); vai(1); }} aria-label="Successiva">›</button>
          <div className="v-conta">{i + 1} / {foto.length}</div>
        </div>
      ) : null}
    </>
  );
}
